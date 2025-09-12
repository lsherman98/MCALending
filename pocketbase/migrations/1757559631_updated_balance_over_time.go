package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1404239436")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    t.deal as id,\n    sd.date,\n    sd.beginning_balance\nFROM\n    statement_details sd\nJOIN (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nORDER BY\n    t.deal, sd.date;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_LpgO")

		// remove field
		collection.Fields.RemoveById("text3825123606")

		// remove field
		collection.Fields.RemoveById("_clone_fFqv")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_QUQj",
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
			"id": "_clone_McjA",
			"max": null,
			"min": null,
			"name": "beginning_balance",
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
		collection, err := app.FindCollectionByNameOrId("pbc_1404239436")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    sd.id as id,\n    sd.date,\n    CAST(t.deal as TEXT) as deal,\n    sd.beginning_balance\nFROM\n    statement_details sd\nJOIN (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nORDER BY\n    t.deal, sd.date;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_LpgO",
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
			"hidden": false,
			"id": "_clone_fFqv",
			"max": null,
			"min": null,
			"name": "beginning_balance",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_QUQj")

		// remove field
		collection.Fields.RemoveById("_clone_McjA")

		return app.Save(collection)
	})
}
