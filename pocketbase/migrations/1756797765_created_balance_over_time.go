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
					"id": "_clone_dilC",
					"max": "",
					"min": "",
					"name": "date",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "date"
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
					"id": "_clone_Am1G",
					"max": null,
					"min": null,
					"name": "beginning_balance",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				}
			],
			"id": "pbc_1404239436",
			"indexes": [],
			"listRule": null,
			"name": "balance_over_time",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    sd.id as id,\n    sd.date,\n    t.deal,\n    sd.beginning_balance\nFROM\n    statement_details sd\nJOIN (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nORDER BY\n    t.deal, sd.date;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1404239436")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
