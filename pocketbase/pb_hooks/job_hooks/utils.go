package job_hooks

import (
	"time"

	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

func SetExtractionRecordFields(extractionRecord, job *core.Record, file *filesystem.File) {
	extractionRecord.Set("job", job.Id)
	extractionRecord.Set("data", file)
	extractionRecord.Set("statement", job.GetString("statement"))
}

func SetJobRecordFields(job *core.Record, extraction *llama_client.JobResultResponse) {
	job.Set("metadata", extraction.ExtractionMetadata)
	job.Set("num_pages", extraction.ExtractionMetadata.Usage.PagesExtracted)
	job.Set("document_tokens", extraction.ExtractionMetadata.Usage.DocumentTokens)
	job.Set("output_tokens", extraction.ExtractionMetadata.Usage.OutputTokens)
	job.Set("completed", time.Now().UTC())
}
