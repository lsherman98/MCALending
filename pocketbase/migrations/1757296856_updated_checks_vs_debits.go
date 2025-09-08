package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_78697642")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    sd.id as id,\n    sd.date,\n    CAST(t.deal as TEXT) as deal,\n    sd.statement,\n    sd.total_checks_debits,\n    IFNULL(cp.total_checks_amount, 0) as total_checks_amount\nFROM\n    statement_details sd\nJOIN\n    (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nLEFT JOIN\n    (SELECT statement, SUM(amount) as total_checks_amount FROM checks_paid GROUP BY statement) cp ON sd.statement = cp.statement\nORDER BY\n    t.deal, sd.date;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_JwSz")

		// remove field
		collection.Fields.RemoveById("json3825123606")

		// remove field
		collection.Fields.RemoveById("_clone_5Gb1")

		// remove field
		collection.Fields.RemoveById("_clone_IWnl")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_W0Hs",
			"max": "",
			"min": "",
			"name": "date",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "_clone_cHU7",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "statement",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_hI6N",
			"max": null,
			"min": null,
			"name": "total_checks_debits",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_78697642")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    sd.id as id,\n    sd.date,\n    t.deal,\n    sd.statement,\n    sd.total_checks_debits,\n    IFNULL(cp.total_checks_amount, 0) as total_checks_amount\nFROM\n    statement_details sd\nJOIN\n    (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nLEFT JOIN\n    (SELECT statement, SUM(amount) as total_checks_amount FROM checks_paid GROUP BY statement) cp ON sd.statement = cp.statement\nORDER BY\n    t.deal, sd.date;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_JwSz",
			"max": "",
			"min": "",
			"name": "date",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "json3825123606",
			"maxSize": 1,
			"name": "deal",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "_clone_5Gb1",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "statement",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_IWnl",
			"max": null,
			"min": null,
			"name": "total_checks_debits",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_W0Hs")

		// remove field
		collection.Fields.RemoveById("text3825123606")

		// remove field
		collection.Fields.RemoveById("_clone_cHU7")

		// remove field
		collection.Fields.RemoveById("_clone_hI6N")

		return app.Save(collection)
	})
}
