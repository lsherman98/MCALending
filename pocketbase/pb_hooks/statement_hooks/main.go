package statement_hooks

import (
	"context"
	"fmt"
	"os"

	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/routine"
)

func buildUrl(statement *core.Record, token string) string {
	return fmt.Sprintf(
		"https://mca.levisherman.xyz/api/files/%s/%s/%s?token=%s",
		"statements",
		statement.Id,
		statement.GetString("file"),
		token,
	)
}

func buildS3Url(collectionId, recordId, filename string) string {
	return fmt.Sprintf(
		"https://storage.googleapis.com/%s/%s/%s/%s",
		"mca-bank-statement-parser-raw-test",
		collectionId,
		recordId,
		filename,
	)
}

func Init(app *pocketbase.PocketBase, llama *llama_client.LlamaClient) error {
	dev := os.Getenv("DEV")

	app.OnRecordCreateRequest("statements").BindFunc(func(e *core.RecordRequestEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		jobsCollection, err := app.FindCollectionByNameOrId("jobs")
		if err != nil {
			return err
		}

		body := map[string]any{}
		err = e.BindBody(&body)
		if err != nil {
			e.App.Logger().Error("Statement: failed to read body: " + err.Error())
			return err
		}

		statement := e.Record
		agent, ok := body["agent"].(string)
		if !ok {
			e.App.Logger().Error("Statement: agent not found in body")
			return e.BadRequestError("agent not found in body", nil)
		}

		jobRecord := core.NewRecord(jobsCollection)
		jobRecord.Set("deal", statement.GetString("deal"))
		jobRecord.Set("statement", statement.Id)

		routine.FireAndForget(func() {
			token, err := e.Auth.NewFileToken()
			if err != nil {
				handleError(e, jobRecord, "failed to create file token", err.Error())
				return
			}

			var url string
			if dev == "true" {
				url = buildS3Url(statement.Collection().Id, statement.Id, statement.GetString("file"))
			} else {
				url = buildUrl(statement, token)
			}

			upload, err := llama.Upload(context.Background(), llama_client.UploadRequest{
				Name: statement.GetString("filename"),
				URL:  url,
			})
			if err != nil {
				handleError(e, jobRecord, "failed to upload file to LlamaIndex", err.Error())
				return
			}

			statement.Set("llama_index_file_id", upload.ID)
			if err := e.App.Save(statement); err != nil {
				e.App.Logger().Error("Statement: failed to save statement record: " + err.Error())
			}

			job, err := llama.RunJob(context.Background(), llama_client.JobRequest{
				FileID:            upload.ID,
				ExtractionAgentID: agent,
				WebhookConfigurations: []llama_client.WebhookConfiguration{
					{
						WebhookURL:          "https://mca.levisherman.xyz/webhooks/llamaindex",
						WebhookEvents:       []string{"extract.success", "extract.error", "extract.partial_success", "extract.cancelled"},
						WebhookOutputFormat: "json",
					},
				},
			})
			if err != nil {
				handleError(e, jobRecord, "failed to run extraction job", err.Error())
				return
			}

			run, err := llama.GetRunByJobID(context.Background(), job.ID)
			if err != nil {
				handleError(e, jobRecord, "failed to get run information", err.Error())
				return
			}

			SetJobFields(jobRecord, job.ID, run.ID, agent, job.Status)
			if err := e.App.Save(jobRecord); err != nil {
				e.App.Logger().Error("Statement: failed to save job record: " + err.Error())
			}
		})

		return nil
	})

	return nil
}

func handleError(e *core.RecordRequestEvent, jobRecord *core.Record, message, err string) {
	e.App.Logger().Error("Statement: " + message + ": " + err)
	jobRecord.Set("error", message)
	jobRecord.Set("status", llama_client.StatusError)
	if err := e.App.Save(jobRecord); err != nil {
		e.App.Logger().Error("Statement: failed to save job record: " + err.Error())
	}
}

func SetJobFields(job *core.Record, jobId, runId, agentId string, status llama_client.StatusEnum) {
	job.Set("job_id", jobId)
	job.Set("run_id", runId)
	job.Set("status", status)
	job.Set("agent_id", agentId)
}
