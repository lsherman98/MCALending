package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2813799467")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT \n(ROW_NUMBER() OVER()) as id,\ndescription,\nSUM(amount) as total,\nCOUNT(id) as count,\ndeal\nFROM \ntransactions\nGROUP BY\ndescription, \ndeal;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_VJQD")

		// remove field
		collection.Fields.RemoveById("_clone_WIt0")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_YWws",
			"max": 0,
			"min": 0,
			"name": "description",
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
			"id": "number2245608546",
			"max": null,
			"min": null,
			"name": "count",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_612317808",
			"hidden": false,
			"id": "_clone_If2I",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "deal",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2813799467")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT \n(ROW_NUMBER() OVER()) as id,\ndescription, \nSUM(amount) as total,\ndeal\nFROM \ntransactions\nGROUP BY\ndescription, \ndeal;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_VJQD",
			"max": 0,
			"min": 0,
			"name": "description",
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
			"collectionId": "pbc_612317808",
			"hidden": false,
			"id": "_clone_WIt0",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "deal",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_YWws")

		// remove field
		collection.Fields.RemoveById("number2245608546")

		// remove field
		collection.Fields.RemoveById("_clone_If2I")

		return app.Save(collection)
	})
}
