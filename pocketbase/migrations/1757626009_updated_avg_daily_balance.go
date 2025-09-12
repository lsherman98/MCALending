package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2574898529")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n(ROW_NUMBER() OVER()) as id,\nCAST(STRFTIME('%Y-%m', date) AS TEXT) AS month,\nCAST(deal AS TEXT) AS deal,\nROUND(AVG(balance), 2) AS average_daily_ending_balance\nFROM\ndaily_balance\nGROUP BY\nmonth,\ndeal;"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2574898529")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n(ROW_NUMBER() OVER()) as id,\nCAST(STRFTIME('%Y-%m', date) AS TEXT) AS month,\nCAST(deal AS TEXT) AS deal,\nAVG(balance) AS average_daily_ending_balance\nFROM\ndaily_balance\nGROUP BY\nmonth,\ndeal;"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
