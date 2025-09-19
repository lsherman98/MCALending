package extraction_hooks

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/routine"
)

func WellsFargoLoader(content []byte, e *core.RecordEvent, statement, deal *core.Record, transactions *[]Transaction) error {
	var data WellsFargoStatement

	if err := json.Unmarshal(content, &data); err != nil {
		e.App.Logger().Error("Extraction: failed to unmarshal JSON: " + err.Error())
		return err
	}

	statementDetailsCollection, err := e.App.FindCollectionByNameOrId("statement_details")
	if err != nil {
		return err
	}

	dailyBalanceCollection, err := e.App.FindCollectionByNameOrId("daily_balance")
	if err != nil {
		return err
	}

	routine.FireAndForget(func() {
		statement_details := core.NewRecord(statementDetailsCollection)
		SetStatementDetailsRecordFields(statement_details, statement.Id, deal.Id, data.Bank.StatementDate, data.Account.BeginningBalance, data.Account.Credits, data.Account.Debits, data.Account.EndingBalance)
		if err := e.App.Save(statement_details); err != nil {
			e.App.Logger().Error("Extraction: failed to create statement_details record: " + err.Error())
			return
		}

		statement.Set("details", statement_details.Id)
		if err := e.App.Save(statement); err != nil {
			e.App.Logger().Error("Extraction: failed to update statement record: " + err.Error())
		}
	})

	routine.FireAndForget(func() {
		SetDealRecordFields(deal, data.Business.Name, data.Business.Address, data.Business.City, data.Business.State, data.Business.ZipCode, data.Bank.Name)
		if err := e.App.Save(deal); err != nil {
			e.App.Logger().Error("Extraction: failed to save deal record: " + err.Error())
		}
	})

	for _, transaction := range data.TransactionHistory {
		normalizeTransaction := Transaction{
			Date:        transaction.Date,
			Description: transaction.Description,
		}

		if transaction.Credits != nil {
			normalizeTransaction.Amount = *transaction.Credits
		} else if transaction.Debits != nil {
			normalizeTransaction.Amount = -*transaction.Debits
		}

		if transaction.EndingDailyBalance != nil {
			routine.FireAndForget(func() {
				dailyBalanceRecord := core.NewRecord(dailyBalanceCollection)
				dailyBalanceRecord.Set("statement", statement.Id)
				dailyBalanceRecord.Set("deal", deal.Id)
				dailyBalanceRecord.Set("date", transaction.Date)
				dailyBalanceRecord.Set("balance", *transaction.EndingDailyBalance)

				if err := e.App.Save(dailyBalanceRecord); err != nil {
					e.App.Logger().Error("Extraction: failed to create daily_balance record: " + err.Error())
				}
			})
		}

		*transactions = append(*transactions, normalizeTransaction)
	}

	return nil
}
