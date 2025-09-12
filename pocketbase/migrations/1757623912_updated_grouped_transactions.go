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
			"viewQuery": "SELECT \n(ROW_NUMBER() OVER()) as id,\n  REPLACE(\n    REPLACE(\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(description, '0', ''),\n                    '1', ''),\n                  '2', ''),\n                '3', ''),\n              '4', ''),\n            '5', ''),\n          '6', ''),\n        '7', ''),\n      '8', ''),\n    '9', ''), '  ', ' ') AS gdescription,\nSUM(amount) as total,\nCOUNT(id) as count,\ndeal\nFROM \ntransactions\nGROUP BY\ngdescription, \ndeal;\n"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_UE8q")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_612317808",
			"hidden": false,
			"id": "_clone_7l7q",
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
			"viewQuery": "SELECT \n(ROW_NUMBER() OVER()) as id,\nREPLACE(\n    REPLACE(\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(description, '0', ''),\n                  '1', ''),\n                '2', ''),\n              '3', ''),\n            '4', ''),\n          '5', ''),\n        '6', ''),\n      '7', ''),\n    '8', ''),\n  '9', '') AS gdescription,\nSUM(amount) as total,\nCOUNT(id) as count,\ndeal\nFROM \ntransactions\nGROUP BY\ngdescription, \ndeal;\n"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_612317808",
			"hidden": false,
			"id": "_clone_UE8q",
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
		collection.Fields.RemoveById("_clone_7l7q")

		return app.Save(collection)
	})
}
