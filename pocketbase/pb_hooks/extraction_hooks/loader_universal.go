package extraction_hooks

import (
	"encoding/json"
	"time"

	"github.com/lsherman98/mca-platform/pocketbase/collections"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/routine"
)

func UniversalLoader(content []byte, e *core.RecordEvent, statement, deal *core.Record, transactions *[]Transaction) error {
	var data UniversalStatement

	if err := json.Unmarshal(content, &data); err != nil {
		e.App.Logger().Error("Universal Loader: failed to unmarshal JSON: " + err.Error())
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
		statement_details := core.NewRecord(statementDetailsCollection)
		SetStatementDetailsRecordFields(statement_details, statement.Id, deal.Id, data.Bank.StatementDate, data.Account.BeginningBalance, data.Account.Credits, data.Account.Debits, data.Account.EndingBalance)
		if err := e.App.Save(statement_details); err != nil {
			e.App.Logger().Error("Universal Loader: failed to create statement_details record: " + err.Error())
			return
		}

		statement.Set("details", statement_details.Id)
		if err := e.App.Save(statement); err != nil {
			e.App.Logger().Error("Universal Loader: failed to update statement record: " + err.Error())
		}
	})

	dailyBalances := calculateDailyBalances(data.Transactions, data.Account.BeginningBalance)
	for date, balance := range dailyBalances {
		dateStr := date.Format("2006-01-02")

		routine.FireAndForget(func() {
			dailyBalanceRecord := core.NewRecord(dailyBalanceCollection)
			dailyBalanceRecord.Set("statement", statement.Id)
			dailyBalanceRecord.Set("deal", deal.Id)
			dailyBalanceRecord.Set("date", dateStr)
			dailyBalanceRecord.Set("balance", balance)

			if err := e.App.Save(dailyBalanceRecord); err != nil {
				e.App.Logger().Error("Universal Loader: failed to create daily_balance record: " + err.Error())
			}
		})
	}

	routine.FireAndForget(func() {
		SetDealRecordFields(deal, data.Business.Name, data.Business.Address, data.Business.City, data.Business.State, data.Business.ZipCode, data.Bank.Name)
		if err := e.App.Save(deal); err != nil {
			e.App.Logger().Error("Universal Loader: failed to save deal record: " + err.Error())
		}
	})

	*transactions = data.Transactions

	return nil
}

func calculateDailyBalances(transactions []Transaction, beginningBalance float64) map[time.Time]float64 {
	dailyBalances := make(map[time.Time]float64)
	currentBalance := beginningBalance

	transactionsByDate := make(map[time.Time][]Transaction)
	for _, transaction := range transactions {
		date, err := time.Parse("2006-01-02", transaction.Date)
		if err != nil {
			continue
		}
		transactionsByDate[date] = append(transactionsByDate[date], transaction)
	}

	for date, transactions := range transactionsByDate {
		dailyChange := 0.0
		for _, transaction := range transactions {
			dailyChange += transaction.Amount
		}
		currentBalance += dailyChange
		dailyBalances[date] = currentBalance
	}

	return dailyBalances
}
