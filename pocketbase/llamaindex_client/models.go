package llamaindex_client

type FileUploadRequest struct {
	Name            string            `json:"name"`
	URL             string            `json:"url"`
	ProxyURL        string            `json:"proxy_url,omitempty"`
	RequestHeaders  map[string]string `json:"request_headers,omitempty"`
	VerifySSL       bool              `json:"verify_ssl,omitempty"`
	FollowRedirects bool              `json:"follow_redirects,omitempty"`
	ResourceInfo    map[string]any    `json:"resource_info,omitempty"`
}

type FileUploadResponse struct {
	ID             string         `json:"id"`
	CreatedAt      string         `json:"created_at"`
	UpdatedAt      string         `json:"updated_at"`
	Name           string         `json:"name"`
	ExternalFileID string         `json:"external_file_id,omitempty"`
	FileSize       int            `json:"file_size,omitempty"`
	FileType       string         `json:"file_type,omitempty"`
	ProjectID      string         `json:"project_id"`
	LastModifiedAt string         `json:"last_modified_at,omitempty"`
	ResourceInfo   map[string]any `json:"resource_info,omitempty"`
	PermissionInfo map[string]any `json:"permission_info,omitempty"`
	DataSourceID   string         `json:"data_source_id,omitempty"`
}

type ExtractionJobRequest struct {
	Priority              map[string]any         `json:"priority,omitempty"`
	WebhookConfigurations []WebhookConfiguration `json:"webhook_configurations,omitempty"`
	ExtractionAgentID     string                 `json:"extraction_agent_id"`
	FileID                string                 `json:"file_id"`
	DataSchemaOverride    map[string]any         `json:"data_schema_override,omitempty"`
	ConfigOverride        map[string]any         `json:"config_override,omitempty"`
}

type StatusEnum string

const (
	StatusPending        StatusEnum = "PENDING"
	StatusSuccess        StatusEnum = "SUCCESS"
	StatusError          StatusEnum = "ERROR"
	StatusPartialSuccess StatusEnum = "PARTIAL_SUCCESS"
	StatusCancelled      StatusEnum = "CANCELLED"
)

type ExtractionJobResponse struct {
	ID              string         `json:"id"`
	ExtractionAgent map[string]any `json:"extraction_agent"`
	Status          StatusEnum     `json:"status"`
	Error           map[string]any `json:"error,omitempty"`
	File            map[string]any `json:"file,omitempty"`
}

type WebhookConfiguration struct {
	WebhookURL          string            `json:"webhook_url"`
	WebhookHeaders      map[string]string `json:"webhook_headers,omitempty"`
	WebhookEvents       []string          `json:"webhook_events,omitempty"`
	WebhookOutputFormat string            `json:"webhook_output_format,omitempty"`
}

type JobResultResponse struct {
	RunID              string         `json:"run_id"`
	ExtractionAgentID  string         `json:"extraction_agent_id"`
	Data               map[string]any `json:"data"`
	ExtractionMetadata map[string]any `json:"extraction_metadata"`
}
