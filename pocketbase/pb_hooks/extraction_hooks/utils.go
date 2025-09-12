package extraction_hooks

import (
	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase/core"
	"google.golang.org/genai"
)

func SetDealRecordFields(data llama_client.Statement, deal *core.Record) {
	deal.Set("merchant", data.Business.Name)
	deal.Set("address", data.Business.Address)
	deal.Set("city", data.Business.City)
	deal.Set("state", data.Business.State)
	deal.Set("zip_code", data.Business.ZipCode)
	deal.Set("bank", data.Bank.Name)
}

func SetStatementDetailsRecordFields(data llama_client.Statement, statement_details, statement, deal *core.Record) {
	statement_details.Set("statement", statement.Id)
	statement_details.Set("deal", deal.Id)
	statement_details.Set("date", data.Bank.StatementDate)
	statement_details.Set("beginning_balance", data.Account.BeginningBalance)
	statement_details.Set("credits", data.Account.Credits)
	statement_details.Set("debits", data.Account.Debits)
	statement_details.Set("service_charge", data.Account.ServiceCharge)
	statement_details.Set("interest_paid", data.Account.InterestPaid)
	statement_details.Set("ending_balance", data.Account.EndingBalance)
	statement_details.Set("days_in_period", data.Account.DaysInPeriod)
	statement_details.Set("overdraft_fee", data.Fees.OverdraftFee)
	statement_details.Set("returned_items_fees", data.Fees.ReturnedItemFees)
}

func SetCheckPaidRecordFields(data llama_client.CheckPaid, checkPaidRecord *core.Record, statement, deal *core.Record) {
	checkPaidRecord.Set("date", data.Date)
	checkPaidRecord.Set("check_number", data.CheckNumber)
	checkPaidRecord.Set("reference", data.Reference)
	checkPaidRecord.Set("amount", data.Amount)
	checkPaidRecord.Set("statement", statement.Id)
	checkPaidRecord.Set("deal", deal.Id)
}

func SetDailyBalanceRecordFields(data llama_client.DailyBalance, dailyBalanceRecord *core.Record, statement, deal *core.Record) {
	dailyBalanceRecord.Set("date", data.Date)
	dailyBalanceRecord.Set("balance", data.Balance)
	dailyBalanceRecord.Set("statement", statement.Id)
	dailyBalanceRecord.Set("deal", deal.Id)
}

func SetTransactionRecordFields(data llama_client.Transaction, transaction *core.Record, statement, deal *core.Record) {
	transaction.Set("date", data.Date)
	transaction.Set("amount", data.Amount)
	transaction.Set("description", data.Description)
	transaction.Set("trace_number", data.TraceNumber)
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
