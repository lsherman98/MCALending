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
			"viewQuery": "SELECT\n  id,\n  gdescription,\n  deal,\n  amount,\n  type,\n  date,\n  (julianday(date) - julianday(LAG(date, 1, date) OVER (PARTITION BY gdescription, deal ORDER BY date))) AS days_since_last_payment\nFROM (\n  SELECT\n    t.id,\n    t.date,\n    t.amount,\n    t.type,\n    t.deal,\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(\n                        REPLACE(\n                          REPLACE(description, '0', ''),\n                        '1', ''),\n                      '2', ''),\n                    '3', ''),\n                  '4', ''),\n                '5', ''),\n              '6', ''),\n            '7', ''),\n          '8', ''),\n        '9', ''),\n      '  ', ' ') AS gdescription\n  FROM\n    transactions t\n  WHERE\n    type IN ('funding', 'payment')\n)\nORDER BY\n  gdescription, deal, date;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json3257917790")

		// remove field
		collection.Fields.RemoveById("number2245608546")

		// remove field
		collection.Fields.RemoveById("_clone_F4as")

		// remove field
		collection.Fields.RemoveById("_clone_bOHw")

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
			"hidden": false,
			"id": "json2392944706",
			"maxSize": 1,
			"name": "amount",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "json2363381545",
			"maxSize": 1,
			"name": "type",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "json2862495610",
			"maxSize": 1,
			"name": "date",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "json3803795949",
			"maxSize": 1,
			"name": "days_since_last_payment",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
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
			"viewQuery": "SELECT \n(ROW_NUMBER() OVER()) as id,\n  REPLACE(\n    REPLACE(\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(description, '0', ''),\n                    '1', ''),\n                  '2', ''),\n                '3', ''),\n              '4', ''),\n            '5', ''),\n          '6', ''),\n        '7', ''),\n      '8', ''),\n    '9', ''), \n  '  ', ' ') AS gdescription,\nROUND(SUM(amount), 2) as total,\nCOUNT(id) as count,\ntype,\ndeal\nFROM \ntransactions\nWHERE\ntype = \"funding\" OR type = \"payment\"\nGROUP BY\ngdescription, \ndeal;\n"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "json3257917790",
			"maxSize": 1,
			"name": "total",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
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
			"hidden": false,
			"id": "_clone_F4as",
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
			"id": "_clone_bOHw",
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
		collection.Fields.RemoveById("json3825123606")

		// remove field
		collection.Fields.RemoveById("json2392944706")

		// remove field
		collection.Fields.RemoveById("json2363381545")

		// remove field
		collection.Fields.RemoveById("json2862495610")

		// remove field
		collection.Fields.RemoveById("json3803795949")

		return app.Save(collection)
	})
}
