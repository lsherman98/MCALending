package job_hooks

import (
	"context"
	"encoding/json"
	"time"

	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

func Init(app *pocketbase.PocketBase, llama *llama_client.LlamaClient) error {
	app.OnRecordAfterCreateSuccess("jobs").BindFunc(func(e *core.RecordEvent) error {
		jobRecord := e.Record

		completed := false
		job := &llama_client.JobResponse{}
		time.Sleep(10 * time.Second)
		for !completed {
			res, err := llama.GetJob(context.Background(), jobRecord.GetString("job_id"))
			if err != nil {
				e.App.Logger().Error("Failed to get job status: " + err.Error())
			}

			job = res

			switch job.Status {
			case
				llama_client.StatusSuccess,
				llama_client.StatusCancelled,
				llama_client.StatusError,
				llama_client.StatusPartialSuccess:
				completed = true
			}
			time.Sleep(10 * time.Second)
		}

		jobRecord.Set("status", job.Status)
		if err := app.Save(jobRecord); err != nil {
			e.App.Logger().Error("Failed to save job record: " + err.Error())
			return nil
		}

		return e.Next()
	})

	app.OnRecordAfterUpdateSuccess("jobs").BindFunc(func(e *core.RecordEvent) error {
		job := e.Record
		status := e.Record.Get("status")

		if !job.GetDateTime("completed").IsZero() {
			return e.Next()
		}

		extractionsCollection, err := app.FindCollectionByNameOrId("extractions")
		if err != nil {
			return err
		}

		switch status {
		case
			llama_client.StatusCancelled,
			llama_client.StatusError,
			llama_client.StatusPending,
			llama_client.StatusPartialSuccess:
			return e.Next()
		}

		extraction, err := llama.GetJobResult(context.Background(), job.GetString("job_id"))
		if err != nil {
			e.App.Logger().Error("Failed to get extraction result: " + err.Error())
			return nil
		}

		data, err := json.Marshal(extraction.Data)
		if err != nil {
			e.App.Logger().Error("Failed to marshal extraction result data: " + err.Error())
			return nil
		}

		f, err := filesystem.NewFileFromBytes(data, job.Id+".json")
		if err != nil {
			e.App.Logger().Error("Failed to create file from json: " + err.Error())
			return nil
		}

		extractionRecord := core.NewRecord(extractionsCollection)
		extractionRecord.Set("job", job.Id)
		extractionRecord.Set("file", f)
		extractionRecord.Set("data", data)
		extractionRecord.Set("statement", job.GetString("statement"))

		if err := app.Save(extractionRecord); err != nil {
			e.App.Logger().Error("Failed to save extraction record: " + err.Error())
			return nil
		}

		job.Set("extraction", extractionRecord.Id)
		job.Set("run_id", extraction.RunID)
		job.Set("metadata", extraction.ExtractionMetadata)
		job.Set("num_pages", extraction.ExtractionMetadata.Usage.NumPagesExtracted)
		job.Set("document_tokens", extraction.ExtractionMetadata.Usage.NumDocumentTokens)
		job.Set("output_tokens", extraction.ExtractionMetadata.Usage.NumOutputTokens)
		job.Set("completed", time.Now().UTC())

		if err := app.Save(job); err != nil {
			e.App.Logger().Error("Failed to save job record: " + err.Error())
			return nil
		}

		return e.Next()
	})

	return nil
}
