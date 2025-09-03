package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
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
					"id": "json3825123606",
					"maxSize": 1,
					"name": "deal",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json3586760704",
					"maxSize": 1,
					"name": "average_monthly_revenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_3911730882",
			"indexes": [],
			"listRule": null,
			"name": "avg_monthly_revenue",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n    deal,\n    AVG(monthly_revenue) as average_monthly_revenue\nFROM (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as revenue_month,\n        SUM(amount) as monthly_revenue\n    FROM\n        transactions\n    WHERE\n        type = 'revenue'\n    GROUP BY\n        deal,\n        revenue_month\n)\nGROUP BY\n    deal;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3911730882")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
