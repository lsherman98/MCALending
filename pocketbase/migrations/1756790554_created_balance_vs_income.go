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
					"id": "json712290569",
					"maxSize": 1,
					"name": "original_balance",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json4284147804",
					"maxSize": 1,
					"name": "estimated_annual_income",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1243097074",
					"maxSize": 1,
					"name": "balance_to_annual_income_percentage",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_724668132",
			"indexes": [],
			"listRule": null,
			"name": "balance_vs_income",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "WITH AnnualIncome AS (\n    SELECT\n        deal,\n        SUM(monthly_income) * 12 as estimated_annual_income\n    FROM (\n        SELECT\n            deal,\n            strftime('%Y-%m', date) as month,\n            SUM(amount) as monthly_income\n        FROM transactions\n        WHERE type = 'revenue'\n        GROUP BY deal, month\n    )\n    GROUP BY deal\n),\nOriginalBalance AS (\n    SELECT\n        deal,\n        balance as original_balance\n    FROM daily_balance\n    -- Find the first balance entry for each deal\n    WHERE date = (SELECT MIN(date) FROM daily_balance db2 WHERE db2.deal = daily_balance.deal)\n)\nSELECT\n    (ROW_NUMBER() OVER()) as id,\n    ai.deal,\n    ob.original_balance,\n    ai.estimated_annual_income,\n    (CASE\n        WHEN ai.estimated_annual_income > 0\n        THEN (ob.original_balance * 100.0) / ai.estimated_annual_income\n        ELSE 0\n    END) as balance_to_annual_income_percentage\nFROM\n    AnnualIncome ai\nJOIN\n    OriginalBalance ob ON ai.deal = ob.deal;\n",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_724668132")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
