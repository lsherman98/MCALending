package extraction_hooks

import (
	"context"
	"encoding/json"

	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"google.golang.org/genai"
)

func Init(app *pocketbase.PocketBase, gemini *genai.Client) error {
	app.OnRecordAfterCreateSuccess("extractions").BindFunc(func(e *core.RecordEvent) error {
		extraction := e.Record

		var data llama_client.Statement
		extraction.UnmarshalJSONField("data", &data)

		statementDetailsCollection, err := e.App.FindCollectionByNameOrId("statement_details")
		if err != nil {
			e.App.Logger().Error("Failed to find statement_details collection: " + err.Error())
			return err
		}

		checksPaidCollection, err := e.App.FindCollectionByNameOrId("checks_paid")
		if err != nil {
			e.App.Logger().Error("Failed to find checks_paid collection: " + err.Error())
			return err
		}

		dailyBalanceCollection, err := e.App.FindCollectionByNameOrId("daily_balance")
		if err != nil {
			e.App.Logger().Error("Failed to find daily_balance collection: " + err.Error())
			return err
		}

		transactionsCollection, err := e.App.FindCollectionByNameOrId("transactions")
		if err != nil {
			e.App.Logger().Error("Failed to find transactions collection: " + err.Error())
			return err
		}

		statement, err := e.App.FindRecordById("statements", extraction.GetString("statement"))
		if err != nil {
			e.App.Logger().Error("Failed to find statement record: " + err.Error())
			return err
		}

		deal, err := e.App.FindRecordById("deals", statement.GetString("deal"))
		if err != nil {
			e.App.Logger().Error("Failed to find deal record: " + err.Error())
			return err
		}

		deal.Set("merchant", data.BusinessInformation.CompanyName)
		deal.Set("address", data.BusinessInformation.CompanyAddress)
		deal.Set("bank", data.BankInformation.BankName)

		if err := e.App.Save(deal); err != nil {
			e.App.Logger().Error("Failed to save deal record: " + err.Error())
		}

		statement_details := core.NewRecord(statementDetailsCollection)
		statement_details.Set("statement", statement.Id)
		statement_details.Set("deal", deal.Id)
		statement_details.Set("date", data.BankInformation.StatementDate)
		statement_details.Set("beginning_balance", data.AccountSummary.BeginningBalance)
		statement_details.Set("total_deposits_credits", data.AccountSummary.TotalDepositsCredits)
		statement_details.Set("total_checks_debits", data.AccountSummary.TotalChecksDebits)
		statement_details.Set("service_charge", data.AccountSummary.ServiceCharge)
		statement_details.Set("interest_paid", data.AccountSummary.InterestPaid)
		statement_details.Set("ending_balance", data.AccountSummary.EndingBalance)
		statement_details.Set("days_in_period", data.AccountSummary.DaysInPeriod)
		statement_details.Set("total_overdraft_fee", data.FeeSummary.TotalOverdraftFee)
		statement_details.Set("total_returned_items_fee", data.FeeSummary.TotalReturnedItemFees)

		if err := e.App.Save(statement_details); err != nil {
			e.App.Logger().Error("Failed to create statement_details record: " + err.Error())
		}

		for _, checkPaid := range data.ChecksPaid {
			checkPaidRecord := core.NewRecord(checksPaidCollection)
			checkPaidRecord.Set("date", checkPaid.Date)
			checkPaidRecord.Set("check_number", checkPaid.CheckNumber)
			checkPaidRecord.Set("reference", checkPaid.Reference)
			checkPaidRecord.Set("amount", checkPaid.Amount)
			checkPaidRecord.Set("statement", statement.Id)
			checkPaidRecord.Set("deal", deal.Id)

			if err := e.App.Save(checkPaidRecord); err != nil {
				e.App.Logger().Error("Failed to create checks_paid record: " + err.Error())
			}
		}

		for _, dailyBalance := range data.DailyBalanceSummary {
			dailyBalanceRecord := core.NewRecord(dailyBalanceCollection)
			dailyBalanceRecord.Set("date", dailyBalance.Date)
			dailyBalanceRecord.Set("balance", dailyBalance.Balance)
			dailyBalanceRecord.Set("statement", statement.Id)
			dailyBalanceRecord.Set("deal", deal.Id)

			if err := e.App.Save(dailyBalanceRecord); err != nil {
				e.App.Logger().Error("Failed to create daily_balance record: " + err.Error())
			}
		}

		transactionsJSON, err := json.Marshal(data.Transactions)
		if err != nil {
			e.App.Logger().Error("Failed to marshal transactions: " + err.Error())
			return err
		}

		transactionsJSONString := "```" + string(transactionsJSON) + "```"

		parts := []*genai.Part{
			genai.NewPartFromText(
				`For each transaction in the following JSON, add a field "type" with one of: "revenue", "transfer", or "financing". If the type is unclear or cannot be determined, leave the "type" field blank. Return the array of transactions in the same order as received, with all original fields plus the new "type" field. JSON: ` + transactionsJSONString,
			),
		}
		contents := []*genai.Content{
			genai.NewContentFromParts(parts, genai.RoleUser),
		}

		config := &genai.GenerateContentConfig{
			ResponseMIMEType: "application/json",
			ResponseSchema: &genai.Schema{
				Type: genai.TypeArray,
				Items: &genai.Schema{
					Type: genai.TypeObject,
					Properties: map[string]*genai.Schema{
						"date":         {Type: genai.TypeString},
						"amount":       {Type: genai.TypeNumber},
						"description":  {Type: genai.TypeString},
						"trace_number": {Type: genai.TypeString},
						"type":         {Type: genai.TypeString},
					},
					PropertyOrdering: []string{"date", "amount", "description", "trace_number", "type"},
				},
			},
		}

		result, err := gemini.Models.GenerateContent(
			context.Background(),
			"gemini-2.5-flash",
			contents,
			config,
		)
		if err != nil {
			e.App.Logger().Error("Gemini transaction categorization failed: " + err.Error())
			return err
		}

		var categorized []struct {
			Date        string  `json:"date"`
			Amount      float64 `json:"amount"`
			Description string  `json:"description"`
			TraceNumber string  `json:"trace_number"`
			Type        string  `json:"type"`
		}
		if err := json.Unmarshal([]byte(result.Text()), &categorized); err != nil {
			e.App.Logger().Error("Failed to parse Gemini response: " + err.Error())
			return err
		}

		for i, transaction := range data.Transactions {
			transactionRecord := core.NewRecord(transactionsCollection)
			transactionRecord.Set("date", transaction.Date)
			transactionRecord.Set("amount", transaction.Amount)
			transactionRecord.Set("description", transaction.Description)
			transactionRecord.Set("trace_number", transaction.TraceNumber)
			transactionRecord.Set("statement", statement.Id)
			transactionRecord.Set("deal", deal.Id)

			if i < len(categorized) {
				transactionType := categorized[i].Type
				if transactionType == "revenue" || transactionType == "financing" || transactionType == "transfer" {
					transactionRecord.Set("type", transactionType)
				}
			}

			if err := e.App.Save(transactionRecord); err != nil {
				e.App.Logger().Error("Failed to create transactions record: " + err.Error())
			}
		}

		return e.Next()
	})

	return nil
}
