package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_889803432")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	}, func(app core.App) error {
		jsonData := `{
			"createRule": null,
			"deleteRule": null,
			"fields": [
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text3208210256",
					"max": 0,
					"min": 0,
					"name": "id",
					"pattern": "^[a-z0-9]+$",
					"presentable": false,
					"primaryKey": true,
					"required": true,
					"system": true,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "json2127196139",
					"maxSize": 1,
					"name": "financing",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json3910233221",
					"maxSize": 1,
					"name": "revenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_889803432",
			"indexes": [],
			"listRule": "",
			"name": "funding_vs_revenue",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    t.deal as id,\n    t.financing,\n    t.revenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN type = 'funding' THEN amount ELSE 0 END) as financing,\n        SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as revenue\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
