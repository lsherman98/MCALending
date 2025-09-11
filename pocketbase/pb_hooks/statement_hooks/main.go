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

const (
	agentId = "75a67a3c-c668-4a2a-8acb-bed0d5111e12"
)

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

		statement := e.Record

		routine.FireAndForget(func() {
			token, err := e.Auth.NewFileToken()
			if err != nil {
				e.App.Logger().Error("Failed to create file token: " + err.Error())
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
				e.App.Logger().Error("Failed to upload file to LlamaIndex: " + err.Error())
			}

			statement.Set("llama_index_file_id", upload.ID)

			if err := app.Save(statement); err != nil {
				e.App.Logger().Error("Failed to save statement record: " + err.Error())
			}

			job, err := llama.RunJob(context.Background(), llama_client.JobRequest{
				FileID:            upload.ID,
				ExtractionAgentID: agentId,
			})
			if err != nil {
				e.App.Logger().Error("Failed to run extraction job: " + err.Error())
			}

			run, err := llama.GetRunByJobID(context.Background(), job.ID)
			if err != nil {
				e.App.Logger().Error("Failed to get run information: " + err.Error())
				return
			}

			jobRecord := core.NewRecord(jobsCollection)
			SetJobFields(jobRecord, job.ID, run.ID, agentId, statement.GetString("deal"), statement.Id, job.Status)
			if err := app.Save(jobRecord); err != nil {
				e.App.Logger().Error("Failed to save job record: " + err.Error())
			}
		})

		return nil
	})

	return nil
}
