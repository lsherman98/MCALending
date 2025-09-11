package statement_hooks

import (
	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase/core"
)

func SetJobFields(job *core.Record, jobId, runId, agentId, dealId, statementId string, status llama_client.StatusEnum) {
	job.Set("job_id", jobId)
	job.Set("run_id", runId)
	job.Set("status", status)
	job.Set("agent_id", agentId)
	job.Set("deal", dealId)
	job.Set("statement", statementId)
}
