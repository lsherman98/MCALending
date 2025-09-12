package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3400703803")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "credits_and_debits"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_ZmDq")

		// remove field
		collection.Fields.RemoveById("_clone_VpCD")

		// remove field
		collection.Fields.RemoveById("_clone_ZZ2f")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_D5Ss",
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
			"id": "_clone_4wOd",
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
			"id": "_clone_y6lS",
			"max": null,
			"min": null,
			"name": "debits",
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
		collection, err := app.FindCollectionByNameOrId("pbc_3400703803")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "credits_vs_debits"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_ZmDq",
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
			"id": "_clone_VpCD",
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
			"id": "_clone_ZZ2f",
			"max": null,
			"min": null,
			"name": "debits",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_D5Ss")

		// remove field
		collection.Fields.RemoveById("_clone_4wOd")

		// remove field
		collection.Fields.RemoveById("_clone_y6lS")

		return app.Save(collection)
	})
}
