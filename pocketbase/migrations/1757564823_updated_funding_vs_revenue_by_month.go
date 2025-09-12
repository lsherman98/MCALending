package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2848304293")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    CAST(t.deal as TEXT) as deal,\n    t.financing,\n    t.revenue,\n    t.date\nFROM (\n    SELECT\n        t.deal,\n        sd.date,\n        t.statement,\n        SUM(CASE WHEN t.type = 'funding' THEN t.amount ELSE 0 END) as financing,\n        SUM(CASE WHEN t.type = 'revenue' THEN t.amount ELSE 0 END) as revenue\n    FROM\n        transactions t\n     JOIN (SELECT DISTINCT date, statement FROM statement_details) sd ON sd.statement = t.statement\n    GROUP BY\n        deal,\n        sd.date\n) t;"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2848304293")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    CAST(t.deal as TEXT) as deal,\n    t.financing,\n    t.revenue,\n    CAST(t.date as DATE) as date\nFROM (\n    SELECT\n        t.deal,\n        sd.date,\n        t.statement,\n        SUM(CASE WHEN t.type = 'funding' THEN t.amount ELSE 0 END) as financing,\n        SUM(CASE WHEN t.type = 'revenue' THEN t.amount ELSE 0 END) as revenue\n    FROM\n        transactions t\n     JOIN (SELECT DISTINCT date, statement FROM statement_details) sd ON sd.statement = t.statement\n    GROUP BY\n        deal,\n        sd.date\n) t;"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
