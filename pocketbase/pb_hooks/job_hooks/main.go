package job_hooks

import (
	"context"
	"encoding/json"
	"os"
	"time"

	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

func Init(app *pocketbase.PocketBase, llama *llama_client.LlamaClient) error {
	app.OnRecordAfterCreateSuccess("jobs").BindFunc(func(e *core.RecordEvent) error {
		if os.Getenv("DEV") == "false" {
			return e.Next()
		}

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
			time.Sleep(5 * time.Second)
		}

		jobRecord.Set("status", "CLASSIFY")
		if err := app.Save(jobRecord); err != nil {
			e.App.Logger().Error("Failed to save job record: " + err.Error())
			return nil
		}

		return e.Next()
	})

	app.OnRecordAfterUpdateSuccess("jobs").BindFunc(func(e *core.RecordEvent) error {
		job := e.Record
		status := job.GetString("status")

		if !job.GetDateTime("completed").IsZero() {
			return e.Next()
		}

		extractionsCollection, err := app.FindCollectionByNameOrId("extractions")
		if err != nil {
			return err
		}

		switch status {
		case
			string(llama_client.StatusCancelled),
			string(llama_client.StatusError),
			string(llama_client.StatusPending),
			string(llama_client.StatusPartialSuccess):
			return e.Next()
		}

		extraction, err := llama.GetJobResult(context.Background(), job.GetString("job_id"))
		if err != nil {
			e.App.Logger().Error("Job: failed to get extraction result: " + err.Error())
			return e.Next()
		}

		data, err := json.Marshal(extraction.Data)
		if err != nil {
			e.App.Logger().Error("Job: failed to marshal extraction result data: " + err.Error())
			return e.Next()
		}

		f, err := filesystem.NewFileFromBytes(data, job.Id+".json")
		if err != nil {
			e.App.Logger().Error("Job: failed to create file from json: " + err.Error())
			return e.Next()
		}

		extractionRecord := core.NewRecord(extractionsCollection)
		SetExtractionRecordFields(extractionRecord, job, f)
		SetJobRecordFields(job, extraction)
		if err := e.App.Save(job); err != nil {
			e.App.Logger().Error("Job: failed to save job record: " + err.Error())
		}

		if err := e.App.Save(extractionRecord); err != nil {
			e.App.Logger().Error("Job: failed to save extraction record: " + err.Error())
		}

		return e.Next()
	})

	app.OnRecordAfterDeleteSuccess("jobs").BindFunc(func(e *core.RecordEvent) error {
		job := e.Record
		run_id := job.GetString("run_id")

		if err := llama.DeleteExtractionRun(context.Background(), run_id); err != nil {
			e.App.Logger().Error("Job: failed to delete extraction run: " + err.Error())
			return e.Next()
		}

		return e.Next()
	})

	return nil
}
