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
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n        REPLACE(\n            REPLACE(\n                REPLACE(\n                    REPLACE(\n                        REPLACE(\n                            REPLACE(\n                                REPLACE(\n                                    REPLACE(\n                                        REPLACE(\n                                            REPLACE(\n                                                REPLACE(description, '0', ''),\n                                            '1', ''),\n                                        '2', ''),\n                                    '3', ''),\n                                '4', ''),\n                            '5', ''),\n                        '6', ''),\n                    '7', ''),\n                '8', ''),\n            '9', ''),\n        ' ', ' ') AS gdescription,\n    ROUND(SUM(amount), 2) as total,\n    COUNT(id) as count,\n    type,\n    deal\nFROM\n    transactions\nWHERE\n    type = \"funding\" OR type = \"payment\"\nGROUP BY\n    gdescription,\n    deal;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_UVp0")

		// remove field
		collection.Fields.RemoveById("_clone_9g19")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_elPe",
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
			"id": "_clone_358Y",
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
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n        REPLACE(\n            REPLACE(\n                REPLACE(\n                    REPLACE(\n                        REPLACE(\n                            REPLACE(\n                                REPLACE(\n                                    REPLACE(\n                                        REPLACE(\n                                            REPLACE(\n                                                REPLACE(description, '0', ''),\n                                            '1', ''),\n                                        '2', ''),\n                                    '3', ''),\n                                '4', ''),\n                            '5', ''),\n                        '6', ''),\n                    '7', ''),\n                '8', ''),\n            '9', ''),\n        ' ', ' ') AS gdescription,\n    ROUND(SUM(amount), 2) as total,\n    COUNT(id) as count,\n    type,\n    deal\nFROM\n    transactions\n\nGROUP BY\n    gdescription,\n    deal;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_UVp0",
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
			"id": "_clone_9g19",
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
		collection.Fields.RemoveById("_clone_elPe")

		// remove field
		collection.Fields.RemoveById("_clone_358Y")

		return app.Save(collection)
	})
}
