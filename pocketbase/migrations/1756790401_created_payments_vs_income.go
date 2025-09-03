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
					"id": "json35144604",
					"maxSize": 1,
					"name": "avg_monthly_payment",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json3206025734",
					"maxSize": 1,
					"name": "avg_monthly_income",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json797078559",
					"maxSize": 1,
					"name": "payment_to_income_percentage",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1374578849",
			"indexes": [],
			"listRule": null,
			"name": "payments_vs_income",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "WITH MonthlyFinancing AS (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as month,\n        SUM(amount) as total_financing\n    FROM transactions\n    WHERE type = 'financing'\n    GROUP BY deal, month\n),\nMonthlyIncome AS (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as month,\n        SUM(amount) as total_income\n    FROM transactions\n    WHERE type = 'revenue'\n    GROUP BY deal, month\n)\nSELECT\n    (ROW_NUMBER() OVER()) as id,\n    mf.deal,\n    AVG(mf.total_financing) as avg_monthly_payment,\n    AVG(mi.total_income) as avg_monthly_income,\n    -- Avoid division by zero by wrapping the entire expression in parentheses\n    (CASE\n        WHEN AVG(mi.total_income) > 0\n        THEN (AVG(mf.total_financing) * 100.0) / AVG(mi.total_income)\n        ELSE 0\n    END) as payment_to_income_percentage\nFROM\n    MonthlyFinancing mf\nJOIN\n    MonthlyIncome mi ON mf.deal = mi.deal AND mf.month = mi.month\nGROUP BY\n    mf.deal;\n",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1374578849")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
