package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3841896202")
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
					"id": "json4080900610",
					"maxSize": 1,
					"name": "totalServiceCharges",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json4120019470",
					"maxSize": 1,
					"name": "totalOverdraftFees",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json4146609977",
					"maxSize": 1,
					"name": "totalReturnedItemFees",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1593214111",
					"maxSize": 1,
					"name": "totalBankFees",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_3841896202",
			"indexes": [],
			"listRule": null,
			"name": "total_bank_fees",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    t.deal as id,\n    t.deal,\n    SUM(sd.service_charge) as totalServiceCharges,\n    SUM(sd.total_overdraft_fee) as totalOverdraftFees,\n    SUM(sd.total_returned_item_fees) as totalReturnedItemFees,\n    (SUM(sd.service_charge) + SUM(sd.total_overdraft_fee) + SUM(sd.total_returned_item_fees)) as totalBankFees\nFROM\n    statement_details sd\nJOIN (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nGROUP BY\n    t.deal;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
