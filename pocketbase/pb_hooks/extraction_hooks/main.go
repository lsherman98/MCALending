package extraction_hooks

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"sync"

	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/routine"
	"google.golang.org/genai"
)

const transactionChunkSize = 15

func Init(app *pocketbase.PocketBase, gemini *genai.Client) error {
	app.OnRecordAfterCreateSuccess("extractions").BindFunc(func(e *core.RecordEvent) error {
		extraction := e.Record

		fileKey := extraction.BaseFilesPath() + "/" + extraction.GetString("data")

		fsys, err := e.App.NewFilesystem()
		if err != nil {
			e.App.Logger().Error("Extraction: failed to initialize filesystem: " + err.Error())
			return err
		}
		defer fsys.Close()

		r, err := fsys.GetReader(fileKey)
		if err != nil {
			e.App.Logger().Error("Extraction: failed to get file reader: " + err.Error())
			return err
		}
		defer r.Close()

		content := new(bytes.Buffer)
		_, err = io.Copy(content, r)
		if err != nil {
			e.App.Logger().Error("Extraction: failed to read file content: " + err.Error())
			return err
		}

		var data llama_client.Statement
		if err := json.Unmarshal(content.Bytes(), &data); err != nil {
			e.App.Logger().Error("Extraction: failed to unmarshal JSON: " + err.Error())
			return err
		}

		statementDetailsCollection, err := e.App.FindCollectionByNameOrId("statement_details")
		if err != nil {
			return err
		}

		checksPaidCollection, err := e.App.FindCollectionByNameOrId("checks_paid")
		if err != nil {
			return err
		}

		dailyBalanceCollection, err := e.App.FindCollectionByNameOrId("daily_balance")
		if err != nil {
			return err
		}

		transactionsCollection, err := e.App.FindCollectionByNameOrId("transactions")
		if err != nil {
			return err
		}

		statement, err := e.App.FindRecordById("statements", extraction.GetString("statement"))
		if err != nil {
			e.App.Logger().Error("Extraction: failed to find statement record: " + err.Error())
			return err
		}

		job, err := e.App.FindRecordById("jobs", extraction.GetString("job"))
		if err != nil {
			e.App.Logger().Error("Extraction: failed to find job record: " + err.Error())
			return err
		}

		deal, err := e.App.FindRecordById("deals", statement.GetString("deal"))
		if err != nil {
			e.App.Logger().Error("Extraction: failed to find deal record: " + err.Error())
			return err
		}

		routine.FireAndForget(func() {
			SetDealRecordFields(data, deal)
			if err := e.App.Save(deal); err != nil {
				e.App.Logger().Error("Extraction: failed to save deal record: " + err.Error())
			}
		})

		routine.FireAndForget(func() {
			statement_details := core.NewRecord(statementDetailsCollection)
			SetStatementDetailsRecordFields(data, statement_details, statement, deal)
			if err := e.App.Save(statement_details); err != nil {
				e.App.Logger().Error("Extraction: failed to create statement_details record: " + err.Error())
			}

			statement.Set("details", statement_details.Id)
			if err := e.App.Save(statement); err != nil {
				e.App.Logger().Error("Extraction: failed to update statement record: " + err.Error())
			}
		})

		for _, checkPaid := range data.Checks {
			routine.FireAndForget(func() {
				checkPaidRecord := core.NewRecord(checksPaidCollection)
				SetCheckPaidRecordFields(checkPaid, checkPaidRecord, statement, deal)
				if err := e.App.Save(checkPaidRecord); err != nil {
					e.App.Logger().Error("Extraction: failed to create checks_paid record: " + err.Error())
				}
			})
		}

		for _, dailyBalance := range data.DailyBalance {
			routine.FireAndForget(func() {
				dailyBalanceRecord := core.NewRecord(dailyBalanceCollection)
				SetDailyBalanceRecordFields(dailyBalance, dailyBalanceRecord, statement, deal)
				if err := e.App.Save(dailyBalanceRecord); err != nil {
					e.App.Logger().Error("Extraction: failed to create daily_balance record: " + err.Error())
				}
			})
		}

		var wg sync.WaitGroup
		var mu sync.Mutex
		allCategorizedTransactions := make([]TransactionType, len(data.Transactions))

		for i := 0; i < len(data.Transactions); i += transactionChunkSize {
			wg.Add(1)
			go func(start int) {
				defer wg.Done()

				end := min(start + transactionChunkSize, len(data.Transactions))
				chunk := data.Transactions[start:end]

				transactionsJSON, err := json.Marshal(chunk)
				if err != nil {
					e.App.Logger().Error("Failed to marshal transactions chunk: " + err.Error())
					return
				}

				transactionsJSONString := "```json\n" + string(transactionsJSON) + "\n```"
				systemPrompt := "For each transaction in the following JSON, add a field 'type' with one of: 'revenue', 'transfer', 'funding', 'payment', 'expense'. If the type is unclear or cannot be determined, leave the 'type' field blank.\nHere is some guidance on how to categorize each transaction:\n- the revenue type should be applied to transaction are that are deposits into the account that are real business revenue, not a transfer from another account.\n- the transfer type will be transactions that are deposits from another account. It should not be confused for a financing deposit from a lender.\n- the funding type is a deposit from a lender. It is not revenue or a transfer.\n- the payment type is a credit from the account that is a payment on a loan from a lender\n- the expense type is a transaction that is not a loan payment and is cleary a business expense. if not confident just leave it blank.\n\nWe should always lean on not setting a type if the confidence is low.\n\nReturn the array of transactions in the same order as received, with all original fields plus the new 'type' field. JSON: " + transactionsJSONString

				parts := []*genai.Part{
					genai.NewPartFromText("JSON: " + transactionsJSONString),
				}
				contents := []*genai.Content{
					genai.NewContentFromParts(parts, genai.RoleUser),
				}

				config := GenerateGeminiConfig(systemPrompt)

				result, err := gemini.Models.GenerateContent(
					context.Background(),
					"gemini-2.5-flash",
					contents,
					config,
				)
				if err != nil {
					e.App.Logger().Error("Extraction: Gemini transaction categorization failed: " + err.Error())
					return
				}

				var transactionsWithTypes TransactionTypeList
				if err := json.Unmarshal([]byte(result.Text()), &transactionsWithTypes); err != nil {
					e.App.Logger().Error("Extraction: failed to parse Gemini response: " + err.Error())
					return
				}

				mu.Lock()
				defer mu.Unlock()
				for i, t := range transactionsWithTypes.Transactions {
					if start+i < len(allCategorizedTransactions) {
						allCategorizedTransactions[start+i] = t
					}
				}
			}(i)
		}

		wg.Wait()

		for i, transaction := range data.Transactions {
			routine.FireAndForget(func() {
				transactionRecord := core.NewRecord(transactionsCollection)
				SetTransactionRecordFields(transaction, transactionRecord, statement, deal)

				if i < len(allCategorizedTransactions) {
					transactionType := allCategorizedTransactions[i].Type
					if transactionType == "revenue" || transactionType == "funding" || transactionType == "transfer" || transactionType == "payment" || transactionType == "expense" {
						transactionRecord.Set("type", transactionType)
					} else {
						transactionRecord.Set("type", "none")
					}
				}

				if err := e.App.Save(transactionRecord); err != nil {
					e.App.Logger().Error("Extraction: failed to create transactions record: " + err.Error())
				}
			})
		}

		job.Set("status", llama_client.StatusSuccess)
		job.Set("extraction", extraction.Id)
		if err := e.App.Save(job); err != nil {
			e.App.Logger().Error("Extraction: failed to save job record: " + err.Error())
			return err
		}

		return e.Next()
	})

	return nil
}
