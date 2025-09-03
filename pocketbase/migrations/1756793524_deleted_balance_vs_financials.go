package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2716337022")
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
					"id": "json3317178062",
					"maxSize": 1,
					"name": "period",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json4275954815",
					"maxSize": 1,
					"name": "avg_beginning_balance",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json79670270",
					"maxSize": 1,
					"name": "avg_ending_balance",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1951448223",
					"maxSize": 1,
					"name": "total_checks_and_debits",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json4027515507",
					"maxSize": 1,
					"name": "total_interest_paid",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_2716337022",
			"indexes": [],
			"listRule": null,
			"name": "balance_vs_financials",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n    t.deal,\n    strftime('%Y-%m', sd.date) as period,\n    AVG(sd.beginning_balance) as avg_beginning_balance,\n    AVG(sd.ending_balance) as avg_ending_balance,\n    SUM(sd.total_checks_debits) as total_checks_and_debits,\n    SUM(sd.interest_paid) as total_interest_paid\nFROM\n    statement_details as sd\n-- Assuming a join is needed to get the 'deal'\nJOIN (SELECT DISTINCT id, deal FROM transactions) AS t ON sd.statement = t.id\nWHERE\n    sd.date IS NOT NULL\nGROUP BY\n    t.deal,\n    period\nORDER BY\n    t.deal,\n    period;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
