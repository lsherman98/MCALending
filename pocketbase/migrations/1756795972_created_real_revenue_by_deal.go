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
					"id": "json2375761822",
					"maxSize": 1,
					"name": "realRevenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1415484045",
			"indexes": [],
			"listRule": null,
			"name": "real_revenue_by_deal",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    t.deal as id,\n    t.deal,\n    (t.total_revenue - t.total_financing_transfers) as realRevenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END) as total_revenue,\n        SUM(CASE WHEN type = 'financing' OR type = 'transfer' THEN ABS(amount) ELSE 0 END) as total_financing_transfers\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1415484045")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
