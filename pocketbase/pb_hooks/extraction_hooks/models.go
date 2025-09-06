package extraction_hooks

type TransactionType struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}

type TransactionTypeList struct {
	Transactions []TransactionType `json:"transactions"`
}