package llama_client

type UploadRequest struct {
	Name            string            `json:"name"`
	URL             string            `json:"url"`
	ProxyURL        string            `json:"proxy_url,omitempty"`
	RequestHeaders  map[string]string `json:"request_headers,omitempty"`
	VerifySSL       bool              `json:"verify_ssl,omitempty"`
	FollowRedirects bool              `json:"follow_redirects,omitempty"`
	ResourceInfo    map[string]any    `json:"resource_info,omitempty"`
}

type UploadResponse struct {
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

type JobRequest struct {
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

type JobResponse struct {
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
	RunID              string             `json:"run_id"`
	ExtractionAgentID  string             `json:"extraction_agent_id"`
	Data               Statement          `json:"data"`
	ExtractionMetadata ExtractionMetadata `json:"extraction_metadata"`
}

type ExtractionMetadata struct {
	FieldMetadata map[string]any `json:"field_metadata"`
	Usage         struct {
		NumDocumentTokens int `json:"num_document_tokens"`
		NumOutputTokens   int `json:"num_output_tokens"`
		NumPagesExtracted int `json:"num_pages_extracted"`
	} `json:"usage"`
}

type Statement struct {
	AccountSummary      AccountSummary      `json:"account_summary"`
	BankInformation     BankInformation     `json:"bank_information"`
	BusinessInformation BusinessInformation `json:"business_information"`
	ChecksPaid          []CheckPaid         `json:"checks_paid"`
	DailyBalanceSummary []DailyBalance      `json:"daily_balance_summary"`
	FeeSummary          FeeSummary          `json:"fee_summary"`
	Transactions        []Transaction       `json:"transactions"`
}

type AccountSummary struct {
	BeginningBalance     float64 `json:"beginning_balance"`
	DaysInPeriod         string  `json:"days_in_period"`
	EndingBalance        float64 `json:"ending_balance"`
	InterestPaid         float64 `json:"interest_paid"`
	ServiceCharge        float64 `json:"service_charge"`
	TotalChecksDebits    float64 `json:"total_checks_debits"`
	TotalDepositsCredits float64 `json:"total_deposits_credits"`
}

type BankInformation struct {
	AccountEnding  string `json:"account_ending"`
	BankName       string `json:"bank_name"`
	PrimaryAccount string `json:"primary_account"`
	StatementDate  string `json:"statement_date"`
}

type BusinessInformation struct {
	AccountNumber  string `json:"account_number"`
	AccountTitle   string `json:"account_title"`
	CompanyAddress string `json:"company_address"`
	CompanyName    string `json:"company_name"`
}

type CheckPaid struct {
	Amount      float64 `json:"amount"`
	CheckNumber string  `json:"check_number"`
	Date        string  `json:"date"`
	Reference   string  `json:"reference"`
}

type DailyBalance struct {
	Balance float64 `json:"balance"`
	Date    string  `json:"date"`
}

type FeeSummary struct {
	TotalOverdraftFee     float64 `json:"total_overdraft_fee"`
	TotalReturnedItemFees float64 `json:"total_returned_item_fees"`
}

type Transaction struct {
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	Description string  `json:"description"`
	TraceNumber *string `json:"trace_number"`
}
