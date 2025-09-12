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
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    CAST(t.deal as TEXT) as deal,\n    STRFTIME('%Y-%m-%d', t.date) AS date,\n    t.funding,\n    t.revenue,\n    t.payments,\n    t.expenses,\n    t.transfers\nFROM (\n    SELECT\n        t.deal,\n        sd.date,\n        t.statement,\n        SUM(CASE WHEN t.type = 'funding' THEN t.amount ELSE 0 END) as funding,\n        SUM(CASE WHEN type = 'revenue' OR (t.amount > 0 AND t.type = 'none') THEN t.amount ELSE 0 END) as revenue,\n  SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END) as payments,\n  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expenses,\n  SUM(CASE WHEN t.type = 'transfer' THEN t.amount ELSE 0 END) as transfers\n    FROM\n        transactions t\n     JOIN (SELECT DISTINCT date, statement FROM statement_details) sd ON sd.statement = t.statement\n    GROUP BY\n        deal,\n        sd.date\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("number3825123606")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text3825123606",
			"max": 0,
			"min": 0,
			"name": "deal",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
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
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    CAST(t.deal as INT) as deal,\n    STRFTIME('%Y-%m-%d', t.date) AS date,\n    t.funding,\n    t.revenue,\n    t.payments,\n    t.expenses,\n    t.transfers\nFROM (\n    SELECT\n        t.deal,\n        sd.date,\n        t.statement,\n        SUM(CASE WHEN t.type = 'funding' THEN t.amount ELSE 0 END) as funding,\n        SUM(CASE WHEN type = 'revenue' OR (t.amount > 0 AND t.type = 'none') THEN t.amount ELSE 0 END) as revenue,\n  SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END) as payments,\n  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expenses,\n  SUM(CASE WHEN t.type = 'transfer' THEN t.amount ELSE 0 END) as transfers\n    FROM\n        transactions t\n     JOIN (SELECT DISTINCT date, statement FROM statement_details) sd ON sd.statement = t.statement\n    GROUP BY\n        deal,\n        sd.date\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "number3825123606",
			"max": null,
			"min": null,
			"name": "deal",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("text3825123606")

		return app.Save(collection)
	})
}
