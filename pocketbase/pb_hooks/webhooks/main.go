package webhooks

import (
	"net/http"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func Init(app *pocketbase.PocketBase) error {
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.POST("/webhooks/llamaindex", func(e *core.RequestEvent) error {
			event := LlamaEvent{}
			if err := e.BindBody(&event); err != nil {
				return e.BadRequestError("LlamaIndex Webhook: invalid request body", err)
			}

            llamaWebhooksCollection, err := app.FindCollectionByNameOrId("llama_webhooks")
            if err != nil {
                return e.InternalServerError("LlamaIndex Webhook: failed to find llama_webhooks collection", err)
            }

            eventRecord := core.NewRecord(llamaWebhooksCollection)
            eventRecord.Set("event_id", event.EventID)
            eventRecord.Set("type", event.EventType)
            eventRecord.Set("run_id", event.Data.RunID)
            eventRecord.Set("job_id", event.Data.JobID)
            if err := e.App.Save(eventRecord); err != nil {
                e.App.Logger().Error("LlamaIndex Webhook: failed to save webhook event record: " + err.Error())
            }

			job, err := app.FindFirstRecordByData("jobs", "job_id", event.Data.JobID)
			if err != nil {
				e.App.Logger().Error("LlamaIndex Webhook: failed to find job record: " + err.Error())
				return e.InternalServerError("LlamaIndex Webhook: failed to find job record", err)
			}

			switch event.EventType {
			case EventTypeExtractSuccess:
				job.Set("status", "CLASSIFY")
			case EventTypeExtractError:
                e.App.Logger().Error("LlamaIndex Webhook: Extract Error", "event", event)
				job.Set("status", "ERROR")
			case EventTypeExtractPartialSuccess:
                e.App.Logger().Error("LlamaIndex Webhook: Extract Partial Success", "event", event)
				job.Set("status", "PARTIAL_SUCCESS")
			case EventTypeExtractCancelled:
                e.App.Logger().Error("LlamaIndex Webhook: Extract Cancelled", "event", event)
				job.Set("status", "CANCELLED")
			default:
				e.App.Logger().Error("LlamaIndex Webhook: Unknown Event Type", "event", event.EventType)
			}

			if err := e.App.Save(job); err != nil {
				e.App.Logger().Error("LlamaIndex Webhook: failed to save job record: " + err.Error())
			}

			e.Response.WriteHeader(http.StatusOK)
			return nil
		})

		return se.Next()
	})

	return nil
}
