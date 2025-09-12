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
			"viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  gdescription,\n  CAST(deal as TEXT) as deal,\n  amount,\n  type,\n  COUNT(id) as count,\n  STRFTIME('%Y-%m-%d', date) AS date\n\nFROM (\n  SELECT\n    t.id,\n    t.date,\n    t.amount,\n    t.type,\n    t.deal,\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(\n                        REPLACE(\n                          REPLACE(description, '0', ''),\n                        '1', ''),\n                      '2', ''),\n                    '3', ''),\n                  '4', ''),\n                '5', ''),\n              '6', ''),\n            '7', ''),\n          '8', ''),\n        '9', ''),\n      '  ', ' ') AS gdescription\n  FROM\n    transactions t\n  WHERE\n    type IN ('funding', 'payment')\n)\nORDER BY\n  gdescription, deal;"
		}`), &collection); err != nil {
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
			"viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  gdescription,\n  CAST(deal as TEXT) as deal,\n  amount,\n  type,\n  COUNT(id) as count,\n  STRFTIME('%Y-%m-%d', date) AS date\n\nFROM (\n  SELECT\n    t.id,\n    t.date,\n    t.amount,\n    t.type,\n    t.deal,\n      REPLACE(\n        REPLACE(\n          REPLACE(\n            REPLACE(\n              REPLACE(\n                REPLACE(\n                  REPLACE(\n                    REPLACE(\n                      REPLACE(\n                        REPLACE(\n                          REPLACE(description, '0', ''),\n                        '1', ''),\n                      '2', ''),\n                    '3', ''),\n                  '4', ''),\n                '5', ''),\n              '6', ''),\n            '7', ''),\n          '8', ''),\n        '9', ''),\n      '  ', ' ') AS gdescription\n  FROM\n    transactions t\n  WHERE\n    type IN ('funding', 'payment')\n)\nORDER BY\n  gdescription, deal, date;"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
