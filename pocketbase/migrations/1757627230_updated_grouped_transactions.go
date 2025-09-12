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
			"viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  gdescription,\n  CAST(deal as TEXT) as deal,\n  amount,\n  type,\n  COUNT(id) as count,\n  STRFTIME('%Y-%m-%d', date) AS date,\n  (julianday(date) - julianday(LAG(date, 1, date) OVER (PARTITION BY gdescription, deal ORDER BY date))) AS days_since_last_payment\nFROM (\n  SELECT\n    t.id,\n    t.date,\n    t.amount,\n    t.type,\n    t.deal,\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(\n                        REPLACE(\n                          REPLACE(description, '0', ''),\n                        '1', ''),\n                      '2', ''),\n                    '3', ''),\n                  '4', ''),\n                '5', ''),\n              '6', ''),\n            '7', ''),\n          '8', ''),\n        '9', ''),\n      '  ', ' ') AS gdescription\n  FROM\n    transactions t\n  WHERE\n    type IN ('funding', 'payment')\n)\nORDER BY\n  gdescription, deal, date;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
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

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2813799467")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  gdescription,\n  CAST(deal as TEXT) as deal,\n  amount,\n  type,\n  STRFTIME('%Y-%m-%d', date) AS date,\n  (julianday(date) - julianday(LAG(date, 1, date) OVER (PARTITION BY gdescription, deal ORDER BY date))) AS days_since_last_payment\nFROM (\n  SELECT\n    t.date,\n    t.amount,\n    t.type,\n    t.deal,\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(\n                        REPLACE(\n                          REPLACE(description, '0', ''),\n                        '1', ''),\n                      '2', ''),\n                    '3', ''),\n                  '4', ''),\n                '5', ''),\n              '6', ''),\n            '7', ''),\n          '8', ''),\n        '9', ''),\n      '  ', ' ') AS gdescription\n  FROM\n    transactions t\n  WHERE\n    type IN ('funding', 'payment')\n)\nORDER BY\n  gdescription, deal, date;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("number2245608546")

		return app.Save(collection)
	})
}
