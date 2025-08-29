package statement_hooks

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/lsherman98/mca-platform/pocketbase/llamaindex_client"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

// func buildUrl(statement *core.Record, token string) string {
// 	return fmt.Sprintf(
// 		"/api/files/%s/%s/%s?token=%s",
// 		"statements",
// 		statement.Id,
// 		statement.GetString("file"),
// 		token,
// 	)
// }

const (
	extractionAgentId = "75a67a3c-c668-4a2a-8acb-bed0d5111e12"
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

func Init(app *pocketbase.PocketBase) error {
	llamaIndexClient, err := llamaindex_client.New()
	if err != nil {
		return err
	}

	app.OnRecordCreateRequest("statements").BindFunc(func(e *core.RecordRequestEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		jobsCollection, err := app.FindCollectionByNameOrId("jobs")
		if err != nil {
			return err
		}

		extractionsCollection, err := app.FindCollectionByNameOrId("extractions")
		if err != nil {
			return err
		}

		statement := e.Record
		// token, err := e.Auth.NewFileToken()
		// if err != nil {
		// 	e.App.Logger().Error("Failed to create file token: " + err.Error())
		// 	return nil
		// }

		// url := buildUrl(statement, token)
		url := buildS3Url(statement.Collection().Id, statement.Id, statement.GetString("file"))
		filename := statement.GetString("filename")

		uploadResp, err := llamaIndexClient.UploadFileFromURL(context.Background(), llamaindex_client.FileUploadRequest{
			Name: filename,
			URL:  url,
		})
		if err != nil {
			e.App.Logger().Error("Failed to upload file to LlamaIndex: " + err.Error())
			return nil
		}

		llamaIndexFileId := uploadResp.ID

        statement.Set("llama_index_file_id", llamaIndexFileId)
        if err := app.Save(statement); err != nil {
			e.App.Logger().Error("Failed to save statement record: " + err.Error())
			return nil
		}

		jobResp, err := llamaIndexClient.RunExtractionJob(context.Background(), llamaindex_client.ExtractionJobRequest{
			FileID:            llamaIndexFileId,
			ExtractionAgentID: extractionAgentId,
		})
		if err != nil {
			e.App.Logger().Error("Failed to run extraction job: " + err.Error())
			return nil
		}

		jobId := jobResp.ID
		jobStatus := jobResp.Status

		jobRecord := core.NewRecord(jobsCollection)
		jobRecord.Set("job_id", jobId)
		jobRecord.Set("status", jobStatus)
		jobRecord.Set("agent_id", extractionAgentId)
		jobRecord.Set("deal", statement.GetString("deal"))
		jobRecord.Set("statement", statement.Id)

		if err := app.Save(jobRecord); err != nil {
			e.App.Logger().Error("Failed to save job record: " + err.Error())
			return nil
		}

		jobSuccess := false
		jobResp = &llamaindex_client.ExtractionJobResponse{}
		time.Sleep(10 * time.Second)
		for !jobSuccess {
			jobResp, err = llamaIndexClient.GetJob(context.Background(), jobId)
			if err != nil {
				e.App.Logger().Error("Failed to get job status: " + err.Error())
			}

			jobSuccess = jobResp.Status == llamaindex_client.StatusSuccess
			time.Sleep(10 * time.Second)
		}

		jobRecord.Set("status", jobResp.Status)
		if err := app.Save(jobRecord); err != nil {
			e.App.Logger().Error("Failed to save job record: " + err.Error())
			return nil
		}

		e.App.Logger().Info("Job completed successfully")

		extractionResult, err := llamaIndexClient.GetJobResult(context.Background(), jobId)
		if err != nil {
			e.App.Logger().Error("Failed to get extraction result: " + err.Error())
			return nil
		}

		e.App.Logger().Info("Extraction result retrieved successfully", "data", extractionResult)

		jobRecord.Set("run_id", extractionResult.RunID)
		jobRecord.Set("metadata", extractionResult.ExtractionMetadata)

		if err := app.Save(jobRecord); err != nil {
			e.App.Logger().Error("Failed to save job record: " + err.Error())
			return nil
		}

		jsonBytes, err := json.Marshal(extractionResult.Data)
		if err != nil {
			e.App.Logger().Error("Failed to marshal extraction result data: " + err.Error())
			return nil
		}

		f, err := filesystem.NewFileFromBytes(jsonBytes, jobId+".json")
		if err != nil {
			e.App.Logger().Error("Failed to create file from bytes: " + err.Error())
			return nil
		}

		extractionRecord := core.NewRecord(extractionsCollection)
		extractionRecord.Set("job", jobRecord.Id)
		extractionRecord.Set("data", f)

		if err := app.Save(extractionRecord); err != nil {
			e.App.Logger().Error("Failed to save extraction record: " + err.Error())
			return nil
		}

        jobRecord.Set("extraction", extractionRecord.Id)
        if err := app.Save(jobRecord); err != nil {
			e.App.Logger().Error("Failed to save job record: " + err.Error())
			return nil
		}

		return nil
	})

	return nil
}
