package extraction_hooks

import (
	"encoding/json"

	"github.com/lsherman98/mca-platform/pocketbase/collections"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/routine"
)

func AscendLoader(content []byte, e *core.RecordEvent, statement, deal *core.Record, transactions *[]Transaction) error {
	var data AscendStatement
	if err := json.Unmarshal(content, &data); err != nil {
		e.App.Logger().Error("Ascend Credit Union Loader: failed to unmarshal JSON: " + err.Error())
		return err
	}

	statementDetailsCollection, err := e.App.FindCollectionByNameOrId(collections.StatementDetails)
	if err != nil {
		return err
	}

	dailyBalanceCollection, err := e.App.FindCollectionByNameOrId(collections.DailyBalance)
	if err != nil {
		return err
	}

	routine.FireAndForget(func() {
		SetDealFields(deal, data.Business.Name, data.Business.Address, data.Business.City, data.Business.State, data.Business.ZipCode, data.Bank.Name)
		if err := e.App.Save(deal); err != nil {
			e.App.Logger().Error("Ascend Credit Union Loader: failed to save deal record: " + err.Error())
		}
	})

	totalBeginningBalance := 0.0
	totalEndingBalance := 0.0
	totalCredits := 0.0
	totalDebits := 0.0

	for _, account := range data.Accounts {
		totalBeginningBalance += account.Account.BeginningBalance
		totalEndingBalance += account.Account.EndingBalance
		totalCredits += account.Account.Credits
		totalDebits += account.Account.Debits

		for _, check := range account.ChecksPaid {
			*transactions = append(*transactions, Transaction{
				Date:        check.Date,
				Description: "Check Paid",
				Amount:      -check.Amount,
			})
		}

		for _, transaction := range account.Transactions {
			normalizeTransaction := Transaction{
				Date:        transaction.Date,
				Description: transaction.Description,
			}

			if transaction.Deposit != nil {
				normalizeTransaction.Amount = *transaction.Deposit
			} else if transaction.Withdrawal != nil {
				normalizeTransaction.Amount = -*transaction.Withdrawal
			}

			routine.FireAndForget(func() {
				dailyBalanceRecord := core.NewRecord(dailyBalanceCollection)
				dailyBalanceRecord.Set("statement", statement.Id)
				dailyBalanceRecord.Set("deal", deal.Id)
				dailyBalanceRecord.Set("date", transaction.Date)
				dailyBalanceRecord.Set("balance", transaction.Balance)

				if err := e.App.Save(dailyBalanceRecord); err != nil {
					e.App.Logger().Error("Ascend Credit Union Loader: failed to create daily_balance record: " + err.Error())
				}
			})

			*transactions = append(*transactions, normalizeTransaction)
		}
	}

	routine.FireAndForget(func() {
		statement_details := core.NewRecord(statementDetailsCollection)
		SetStatementDetailsFields(statement_details, statement.Id, deal.Id, data.Bank.StatementDate, totalBeginningBalance, totalCredits, totalDebits, totalEndingBalance)
		if err := e.App.Save(statement_details); err != nil {
			e.App.Logger().Error("Ascend Credit Union Loader: failed to create statement_details record: " + err.Error())
			return
		}

		statement.Set("details", statement_details.Id)
		if err := e.App.Save(statement); err != nil {
			e.App.Logger().Error("Ascend Credit Union Loader: failed to update statement record: " + err.Error())
		}
	})

	return nil
}
