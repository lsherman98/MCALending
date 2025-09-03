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
			"viewQuery": "SELECT\n    sd.id as id,\n    sd.date,\n    t.deal,\n    sd.statement,\n    sd.total_checks_debits,\n    IFNULL(cp.total_checks_amount, 0) as total_checks_amount\nFROM\n    statement_details sd\nJOIN\n    (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nLEFT JOIN\n    (SELECT statement, SUM(amount) as total_checks_amount FROM checks_paid GROUP BY statement) cp ON sd.statement = cp.statement\nORDER BY\n    t.deal, sd.date;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_gOSw")

		// remove field
		collection.Fields.RemoveById("_clone_1WPs")

		// remove field
		collection.Fields.RemoveById("_clone_Bljr")

		// remove field
		collection.Fields.RemoveById("json4148658733")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_IUgI",
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
			"cascadeDelete": true,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "_clone_VWk4",
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
			"id": "_clone_u1jy",
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "json1022920607",
			"maxSize": 1,
			"name": "total_checks_amount",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
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
			"viewQuery": "SELECT\n    sd.id as id,\n    sd.date,\n    t.deal,\n    sd.statement,\n    sd.total_checks_debits,\n    IFNULL(cp.total_checks_amount, 0) as totalChecksAmount\nFROM\n    statement_details sd\nJOIN\n    (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nLEFT JOIN\n    (SELECT statement, SUM(amount) as total_checks_amount FROM checks_paid GROUP BY statement) cp ON sd.statement = cp.statement\nORDER BY\n    t.deal, sd.date;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_gOSw",
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
			"cascadeDelete": true,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "_clone_1WPs",
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
			"id": "_clone_Bljr",
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "json4148658733",
			"maxSize": 1,
			"name": "totalChecksAmount",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_IUgI")

		// remove field
		collection.Fields.RemoveById("_clone_VWk4")

		// remove field
		collection.Fields.RemoveById("_clone_u1jy")

		// remove field
		collection.Fields.RemoveById("json1022920607")

		return app.Save(collection)
	})
}
