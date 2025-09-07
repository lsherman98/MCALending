package extraction_hooks

import (
	"context"
	"encoding/json"

	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/routine"
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
		deal.Set("city", data.BusinessInformation.City)
		deal.Set("state", data.BusinessInformation.State)
		deal.Set("zip_code", data.BusinessInformation.ZipCode)
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

		routine.FireAndForget(func() {
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
		})

		routine.FireAndForget(func() {
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
		})

		transactionsJSON, err := json.Marshal(data.Transactions)
		if err != nil {
			e.App.Logger().Error("Failed to marshal transactions: " + err.Error())
			return err
		}

		transactionsJSONString := "```json\n" + string(transactionsJSON) + "\n```"
		systemPrompt := "For each transaction in the following JSON, add a field 'type' with one of: 'revenue', 'transfer', 'funding', 'loan_payment', 'business_expense'. If the type is unclear or cannot be determined, leave the 'type' field blank.\nHere is some guidance on how to categorize each transaction:\n- the revenue type should be applied to transaction are that are deposits into the account that are real business revenue, not a transfer from another account.\n- the transfer type will be transactions that are deposits from another account. It should not be confused for a financing deposit from a lender.\n- the funding type is a deposit from a lender. It is not revenue or a transfer.\n- the loan_payment type is a credit from the account that is a payment on a loan from a lender\n- the business_expense type is a transaction that is not a loan payment and is cleary a business expense. if not confident just leave it blank.\n\nWe should always lean on not setting a type if the confidence is low.\n\nReturn the array of transactions in the same order as received, with all original fields plus the new 'type' field. JSON: " + transactionsJSONString

		parts := []*genai.Part{
			genai.NewPartFromText("JSON: " + transactionsJSONString),
		}
		contents := []*genai.Content{
			genai.NewContentFromParts(parts, genai.RoleUser),
		}

		config := &genai.GenerateContentConfig{
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
									Description: "The determined category (e.g., 'revenue', 'transfer', 'funding', 'loan_payment', 'business_expense').",
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

		var transactionsWithTypes TransactionTypeList
		if err := json.Unmarshal([]byte(result.Text()), &transactionsWithTypes); err != nil {
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

			if i < len(transactionsWithTypes.Transactions) {
				transactionType := transactionsWithTypes.Transactions[i].Type
				if transactionType == "revenue" || transactionType == "funding" || transactionType == "transfer" || transactionType == "loan_payment" || transactionType == "business_expense" {
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
