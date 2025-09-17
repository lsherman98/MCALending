package plaid_hooks

type CreateLinkTokenRequest struct {
	UserID string `json:"user"`
}

type SetAccessTokenRequest struct {
	PublicToken string `json:"public_token"`
	User        string `json:"user"`
	Deal        string `json:"deal"`
}

type WebhookRequest struct {
	WebhookType     string      `json:"webhook_type"`
	WebhookCode     string      `json:"webhook_code"`
	ItemID          string      `json:"item_id"`
	Error           interface{} `json:"error"`
	NewTransactions int         `json:"new_transactions"`
	Environment     string      `json:"environment"`
}
