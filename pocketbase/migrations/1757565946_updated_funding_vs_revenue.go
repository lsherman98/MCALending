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
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    CAST(t.deal as TEXT) as deal,\n    STRFTIME('%Y-%m-%d', t.date) AS date,\n    t.financing,\n    t.revenue,\n    t.payments,\n    t.expenses,\n    t.transfers\nFROM (\n    SELECT\n        t.deal,\n        sd.date,\n        t.statement,\n        SUM(CASE WHEN t.type = 'funding' THEN t.amount ELSE 0 END) as financing,\n        SUM(CASE WHEN t.type = 'revenue' THEN t.amount ELSE 0 END) as revenue,\n  SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END) as payments,\n  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expenses,\n  SUM(CASE WHEN t.type = 'transfer' THEN t.amount ELSE 0 END) as transfers\n    FROM\n        transactions t\n     JOIN (SELECT DISTINCT date, statement FROM statement_details) sd ON sd.statement = t.statement\n    GROUP BY\n        deal,\n        sd.date\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "json1708301106",
			"maxSize": 1,
			"name": "payments",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "json613872475",
			"maxSize": 1,
			"name": "expenses",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
			"hidden": false,
			"id": "json2150250776",
			"maxSize": 1,
			"name": "transfers",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
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
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    CAST(t.deal as TEXT) as deal,\n    t.financing,\n    t.revenue,\n    STRFTIME('%Y-%m-%d', t.date) AS date\nFROM (\n    SELECT\n        t.deal,\n        sd.date,\n        t.statement,\n        SUM(CASE WHEN t.type = 'funding' THEN t.amount ELSE 0 END) as financing,\n        SUM(CASE WHEN t.type = 'revenue' THEN t.amount ELSE 0 END) as revenue,\n  SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END) as payments,\n  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expenses,\n  SUM(CASE WHEN t.type = 'transfer' THEN t.amount ELSE 0 END) as transfers\n    FROM\n        transactions t\n     JOIN (SELECT DISTINCT date, statement FROM statement_details) sd ON sd.statement = t.statement\n    GROUP BY\n        deal,\n        sd.date\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json1708301106")

		// remove field
		collection.Fields.RemoveById("json613872475")

		// remove field
		collection.Fields.RemoveById("json2150250776")

		return app.Save(collection)
	})
}
