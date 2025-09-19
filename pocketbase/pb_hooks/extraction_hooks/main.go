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

		agentId := job.GetString("agent_id")
		agent, err := e.App.FindFirstRecordByData("extraction_agents", "agent_id", agentId)
		if err != nil {
			e.App.Logger().Error("Extraction: failed to find extraction agent record: " + err.Error())
			return err
		}
		key := agent.GetString("key")
		var transactions []Transaction

		switch key {
		case "ascend":
			if err := AscendLoader(content.Bytes(), e, statement, deal, &transactions); err != nil {
				e.App.Logger().Error("Extraction: Ascend Loader failed: " + err.Error())
				return err
			}
		case "bmo":
			if err := BMOLoader(content.Bytes(), e, statement, deal, &transactions); err != nil {
				e.App.Logger().Error("Extraction: BMO Loader failed: " + err.Error())
				return err
			}
		case "choice_one":
			if err := ChoiceOneLoader(content.Bytes(), e, statement, deal, &transactions); err != nil {
				e.App.Logger().Error("Extraction: Choice One Loader failed: " + err.Error())
				return err
			}
		case "chase":
			if err := ChaseLoader(content.Bytes(), e, statement, deal, &transactions); err != nil {
				e.App.Logger().Error("Extraction: Chase Loader failed: " + err.Error())
				return err
			}
		case "wells_fargo":
			if err := WellsFargoLoader(content.Bytes(), e, statement, deal, &transactions); err != nil {
				e.App.Logger().Error("Extraction: Wells Fargo Loader failed: " + err.Error())
				return err
			}
		case "first_loyal":
			if err := FirstLoyalLoader(content.Bytes(), e, statement, deal, &transactions); err != nil {
				e.App.Logger().Error("Extraction: First Loyal Loader failed: " + err.Error())
				return err
			}
		case "universal":
			err := UniversalLoader(content.Bytes(), e, statement, deal, &transactions)
			if err != nil {
				e.App.Logger().Error("Extraction: Universal Loader failed: " + err.Error())
				return err
			}
		default:
			e.App.Logger().Error("Extraction: unknown extraction agent key: " + key)
			return nil

		}

		var wg sync.WaitGroup
		for i := 0; i < len(transactions); i += transactionChunkSize {
			wg.Add(1)
			start := i
			routine.FireAndForget(func() {
				defer wg.Done()
				end := min(start+transactionChunkSize, len(transactions))
				chunk := transactions[start:end]

				transactionsJSON, err := json.Marshal(chunk)
				if err != nil {
					e.App.Logger().Error("Failed to marshal transactions chunk: " + err.Error())
					saveTransactions(e.App, transactionsCollection, statement, deal, chunk, nil)
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
					saveTransactions(e.App, transactionsCollection, statement, deal, chunk, nil)
					return
				}

				var transactionsWithTypes TransactionTypeList
				if err := json.Unmarshal([]byte(result.Text()), &transactionsWithTypes); err != nil {
					e.App.Logger().Error("Extraction: failed to parse Gemini response: " + err.Error())
					saveTransactions(e.App, transactionsCollection, statement, deal, chunk, nil)
					return
				}

				saveTransactions(e.App, transactionsCollection, statement, deal, chunk, transactionsWithTypes.Transactions)
			})
		}

		routine.FireAndForget(func() {
			wg.Wait()

			job.Set("status", llama_client.StatusSuccess)
			job.Set("extraction", extraction.Id)
			if err := e.App.Save(job); err != nil {
				e.App.Logger().Error("Extraction: failed to save job record: " + err.Error())
			}
		})

		return e.Next()
	})

	return nil
}

func saveTransactions(
	app core.App,
	transactionsCollection *core.Collection,
	statement *core.Record,
	deal *core.Record,
	chunk []Transaction,
	categorizedChunk []TransactionType,
) {
	for i, transaction := range chunk {
		routine.FireAndForget(func() {
			transactionRecord := core.NewRecord(transactionsCollection)
			SetTransactionRecordFields(transaction, transactionRecord, statement, deal)

			transactionType := "none"
			if categorizedChunk != nil && i < len(categorizedChunk) {
				tt := categorizedChunk[i].Type
				if tt == "revenue" || tt == "funding" || tt == "transfer" || tt == "payment" || tt == "expense" {
					transactionType = tt
				}
			}
			transactionRecord.Set("type", transactionType)

			if err := app.Save(transactionRecord); err != nil {
				app.Logger().Error("Extraction: failed to create transactions record: " + err.Error())
			}
		})
	}
}
