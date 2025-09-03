package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_128437708")
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
					"id": "json2394296326",
					"maxSize": 1,
					"name": "month",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_612317808",
					"hidden": false,
					"id": "_clone_QLpl",
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
					"id": "json3404389063",
					"maxSize": 1,
					"name": "monthlyFinancingAsPercentageOfIncome",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_128437708",
			"indexes": [],
			"listRule": null,
			"name": "financing_as_percent_income",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    deal as id,\n    strftime('%Y-%m', date) as month,\n    deal,\n    (SUM(CASE WHEN type = 'financing' THEN ABS(amount) ELSE 0 END) * 100.0 /\n    NULLIF(SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END), 0)\n    ) as monthlyFinancingAsPercentageOfIncome\nFROM\n    transactions\nGROUP BY\n    month, deal;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
