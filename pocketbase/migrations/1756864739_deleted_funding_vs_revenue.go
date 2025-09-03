package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3720193953")
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
					"cascadeDelete": false,
					"collectionId": "pbc_612317808",
					"hidden": false,
					"id": "_clone_rCk5",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "deal",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "relation"
				},
				{
					"hidden": false,
					"id": "json655454372",
					"maxSize": 1,
					"name": "total_funding",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json3996036113",
					"maxSize": 1,
					"name": "real_revenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1165338937",
					"maxSize": 1,
					"name": "funding_to_revenue_ratio",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_3720193953",
			"indexes": [],
			"listRule": null,
			"name": "funding_vs_revenue",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    t.deal,\n    SUM(CASE WHEN t.type = 'financing' THEN t.amount ELSE 0 END) as total_funding,\n    SUM(CASE WHEN t.type = 'revenue' THEN t.amount ELSE 0 END) as real_revenue,\n    -- Avoid division by zero by wrapping the expression in parentheses\n    (CASE\n        WHEN SUM(CASE WHEN t.type = 'revenue' THEN t.amount ELSE 0 END) > 0\n        THEN (SUM(CASE WHEN t.type = 'financing' THEN t.amount ELSE 0 END) * 1.0) / SUM(CASE WHEN t.type = 'revenue' THEN t.amount ELSE 0 END)\n        ELSE 0\n    END) as funding_to_revenue_ratio\nFROM\n    transactions AS t\nGROUP BY\n    t.deal;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
