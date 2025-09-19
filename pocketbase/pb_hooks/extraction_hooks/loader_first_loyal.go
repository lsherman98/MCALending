package extraction_hooks

import (
	"encoding/json"

	"github.com/lsherman98/mca-platform/pocketbase/collections"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/routine"
)

func FirstLoyalLoader(content []byte, e *core.RecordEvent, statement, deal *core.Record, transactions *[]Transaction) error {
	var data FirstLoyalStatement

	if err := json.Unmarshal(content, &data); err != nil {
		e.App.Logger().Error("First Loyal Loader: failed to unmarshal JSON: " + err.Error())
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
			e.App.Logger().Error("First Loyal Loader: failed to create statement_details record: " + err.Error())
			return
		}

		statement.Set("details", statement_details.Id)
		if err := e.App.Save(statement); err != nil {
			e.App.Logger().Error("First Loyal Loader: failed to update statement record: " + err.Error())
		}
	})

	for _, dailyBalance := range data.DailyBalance {
		routine.FireAndForget(func() {
			dailyBalanceRecord := core.NewRecord(dailyBalanceCollection)
			SetDailyBalanceRecordFields(dailyBalance, dailyBalanceRecord, statement, deal)
			if err := e.App.Save(dailyBalanceRecord); err != nil {
				e.App.Logger().Error("First Loyal Loader: failed to create daily_balance record: " + err.Error())
			}
		})
	}

	routine.FireAndForget(func() {
		SetDealRecordFields(deal, data.Business.Name, data.Business.Address, data.Business.City, data.Business.State, data.Business.ZipCode, data.Bank.Name)
		if err := e.App.Save(deal); err != nil {
			e.App.Logger().Error("First Loyal Loader: failed to save deal record: " + err.Error())
		}
	})

	for _, deposit := range data.Deposits {
		*transactions = append(*transactions, Transaction{
			Amount:      deposit.Deposits,
			Date:        deposit.Date,
			Description: deposit.Description,
		})
	}

	for _, deposit := range data.CardActivity {
		*transactions = append(*transactions, Transaction{
			Amount:      -deposit.Withdrawals,
			Date:        deposit.Date,
			Description: deposit.Location,
		})
	}

	for _, deposit := range data.OtherDebits {
		*transactions = append(*transactions, Transaction{
			Amount:      -deposit.Withdrawals,
			Date:        deposit.Date,
			Description: deposit.Description,
		})
	}

	for _, deposit := range data.Checks {
		*transactions = append(*transactions, Transaction{
			Amount:      -deposit.Amount,
			Date:        deposit.Date,
			Description: "Check",
		})
	}

	return nil
}
