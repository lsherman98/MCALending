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
			"viewQuery": "SELECT\n    sd.id as id,\n    sd.date,\n    t.deal,\n    sd.beginning_balance\nFROM\n    statement_details sd\nJOIN (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nORDER BY\n    t.deal, sd.date;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_EDxl")

		// remove field
		collection.Fields.RemoveById("_clone_0zbc")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_n52T",
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
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "_clone_DOZQ",
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
			"viewQuery": "SELECT\n    t.deal as id,\n    sd.date,\n    t.deal,\n    sd.beginning_balance\nFROM\n    statement_details sd\nJOIN (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nORDER BY\n    t.deal, sd.date;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_EDxl",
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
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "_clone_0zbc",
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
		collection.Fields.RemoveById("_clone_n52T")

		// remove field
		collection.Fields.RemoveById("_clone_DOZQ")

		return app.Save(collection)
	})
}
