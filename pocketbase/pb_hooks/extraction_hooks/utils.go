package extraction_hooks

import (
	"github.com/pocketbase/pocketbase/core"
	"google.golang.org/genai"
)

func SetDealFields(deal *core.Record, merchant, address, city, state, zipCode, bank string) {
	deal.Set("merchant", merchant)
	deal.Set("address", address)
	deal.Set("city", city)
	deal.Set("state", state)
	deal.Set("zip_code", zipCode)
	deal.Set("bank", bank)
}

func SetStatementDetailsFields(statementDetails *core.Record, statementId, dealId, date string, beginningBalance, credits, debits, endingBalance float64) {
	statementDetails.Set("statement", statementId)
	statementDetails.Set("deal", dealId)
	statementDetails.Set("date", date)
	statementDetails.Set("beginning_balance", beginningBalance)
	statementDetails.Set("credits", credits)
	statementDetails.Set("debits", debits)
	statementDetails.Set("ending_balance", endingBalance)
}

func SetDailyBalanceFields(data DailyBalance, dailyBalanceRecord *core.Record, statement, deal *core.Record) {
	dailyBalanceRecord.Set("date", data.Date)
	dailyBalanceRecord.Set("balance", data.Balance)
	dailyBalanceRecord.Set("statement", statement.Id)
	dailyBalanceRecord.Set("deal", deal.Id)
}

func SetTransactionFields(data Transaction, transaction *core.Record, statement, deal *core.Record) {
	transaction.Set("date", data.Date)
	transaction.Set("amount", data.Amount)
	transaction.Set("description", data.Description)
	transaction.Set("statement", statement.Id)
	transaction.Set("deal", deal.Id)
	transaction.Set("type", "none")
}

func GenerateGeminiConfig(systemPrompt string) *genai.GenerateContentConfig {
	return &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"transactions": {
					Type:        genai.TypeArray,
					Description: "A list of transactions and their types.",
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"id": {
								Type:        genai.TypeString,
								Description: "The unique identifier for the transaction.",
							},
							"type": {
								Type:        genai.TypeString,
								Description: "The determined category (e.g., 'revenue', 'transfer', 'funding', 'payment', 'expense').",
							},
						},
						Required: []string{"id", "type"},
					},
				},
			},
			Required: []string{"transactions"},
		},
		SystemInstruction: genai.NewContentFromText(systemPrompt, genai.RoleUser),
	}
}
