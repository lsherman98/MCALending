package webhooks

type ExtractEvent string

const (
	EventTypeExtractPending        ExtractEvent = "extract.pending"
	EventTypeExtractSuccess        ExtractEvent = "extract.success"
	EventTypeExtractError          ExtractEvent = "extract.error"
	EventTypeExtractPartialSuccess ExtractEvent = "extract.partial_success"
	EventTypeExtractCancelled      ExtractEvent = "extract.cancelled"
)

type LlamaEventData struct {
	RunID string `json:"id"`
	JobID string `json:"job_id"`
}

type LlamaEvent struct {
	EventID   string         `json:"event_id"`
	EventType ExtractEvent   `json:"event_type"`
	Timestamp float32        `json:"timestamp"`
	Data      LlamaEventData `json:"data"`
}
