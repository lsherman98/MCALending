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
			"viewQuery": "SELECT \n(ROW_NUMBER() OVER()) as id,\n  REPLACE(\n    REPLACE(\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(description, '0', ''),\n                    '1', ''),\n                  '2', ''),\n                '3', ''),\n              '4', ''),\n            '5', ''),\n          '6', ''),\n        '7', ''),\n      '8', ''),\n    '9', ''), \n  '  ', ' ') AS gdescription,\nSUM(amount) as total,\nCOUNT(id) as count,\ntype,\ndeal\nFROM \ntransactions\nWHERE\ntype = \"funding\" OR type = \"payment\"\nGROUP BY\ngdescription, \ndeal;\n"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_SWWk")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_jN5q",
			"maxSelect": 1,
			"name": "type",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"revenue",
				"transfer",
				"funding",
				"none",
				"payment",
				"expense"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_612317808",
			"hidden": false,
			"id": "_clone_47Ls",
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
			"viewQuery": "SELECT \n(ROW_NUMBER() OVER()) as id,\n  REPLACE(\n    REPLACE(\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(description, '0', ''),\n                    '1', ''),\n                  '2', ''),\n                '3', ''),\n              '4', ''),\n            '5', ''),\n          '6', ''),\n        '7', ''),\n      '8', ''),\n    '9', ''), \n  '  ', ' ') AS gdescription,\nSUM(amount) as total,\nCOUNT(id) as count,\ndeal\nFROM \ntransactions\nWHERE\ntype = \"funding\" OR type = \"payment\"\nGROUP BY\ngdescription, \ndeal;\n"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_612317808",
			"hidden": false,
			"id": "_clone_SWWk",
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
		collection.Fields.RemoveById("_clone_jN5q")

		// remove field
		collection.Fields.RemoveById("_clone_47Ls")

		return app.Save(collection)
	})
}
