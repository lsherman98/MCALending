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
					"id": "json862091468",
					"maxSize": 1,
					"name": "total_service_charges",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1537635919",
					"maxSize": 1,
					"name": "total_overdraft_fees",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2856067821",
					"maxSize": 1,
					"name": "total_returned_item_fees",
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
			"id": "pbc_2037551253",
			"indexes": [],
			"listRule": null,
			"name": "bank_fees",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n    s.deal,\n    SUM(sd.service_charge) as total_service_charges,\n    SUM(sd.total_overdraft_fee) as total_overdraft_fees,\n    SUM(sd.total_returned_item_fees) as total_returned_item_fees,\n    SUM(sd.interest_paid) as total_interest_paid\nFROM\n    statement_details AS sd\n-- Assuming a join is needed to get the 'deal'\nJOIN (SELECT DISTINCT id, deal FROM transactions) AS s ON sd.statement = s.id\nGROUP BY\n    s.deal;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2037551253")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
