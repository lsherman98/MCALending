package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1060585696")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    REPLACE(\n        REPLACE(\n            REPLACE(\n                REPLACE(\n                    REPLACE(\n                        REPLACE(\n                            REPLACE(\n                                REPLACE(\n                                    REPLACE(\n                                        REPLACE(\n                                            REPLACE(\n                                                description, '0', ''),\n                                            '1', ''),\n                                        '2', ''),\n                                    '3', ''),\n                                '4', ''),\n                            '5', ''),\n                        '6', ''),\n                    '7', ''),\n                '8', ''),\n            '9', ''),\n        ' ', ' ') AS gdescription,\n    ROUND(SUM(amount), 2) as total,\n    COUNT(id) as count,\n    type,\n    deal,\n    STRING_AGG(date, ', ') AS dates\nFROM\n    transactions\nWHERE\n    type = \"funding\" OR type = \"payment\"\nGROUP BY\n    gdescription,\n    deal,\n    type;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_nm8f")

		// remove field
		collection.Fields.RemoveById("_clone_Wrsn")

		// remove field
		collection.Fields.RemoveById("json172431710")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_X9g5",
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
			"id": "_clone_9oGp",
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "json2876557598",
			"maxSize": 1,
			"name": "dates",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1060585696")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    REPLACE(\n        REPLACE(\n            REPLACE(\n                REPLACE(\n                    REPLACE(\n                        REPLACE(\n                            REPLACE(\n                                REPLACE(\n                                    REPLACE(\n                                        REPLACE(\n                                            REPLACE(\n                                                description, '0', ''),\n                                            '1', ''),\n                                        '2', ''),\n                                    '3', ''),\n                                '4', ''),\n                            '5', ''),\n                        '6', ''),\n                    '7', ''),\n                '8', ''),\n            '9', ''),\n        ' ', ' ') AS gdescription,\n    ROUND(SUM(amount), 2) as total,\n    COUNT(id) as count,\n    type,\n    deal,\n    STRING_AGG(date, ', ') AS transaction_dates\nFROM\n    transactions\nWHERE\n    type = \"funding\" OR type = \"payment\"\nGROUP BY\n    gdescription,\n    deal,\n    type;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_nm8f",
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
			"id": "_clone_Wrsn",
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "json172431710",
			"maxSize": 1,
			"name": "transaction_dates",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_X9g5")

		// remove field
		collection.Fields.RemoveById("_clone_9oGp")

		// remove field
		collection.Fields.RemoveById("json2876557598")

		return app.Save(collection)
	})
}
