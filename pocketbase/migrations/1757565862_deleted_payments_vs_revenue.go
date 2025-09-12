package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1374578849")
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
					"id": "json1708301106",
					"maxSize": 1,
					"name": "payments",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json3910233221",
					"maxSize": 1,
					"name": "revenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1374578849",
			"indexes": [],
			"listRule": "",
			"name": "payments_vs_revenue",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n  deal as id,\n  SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END) AS payments,\n  SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) AS revenue\nFROM\n  transactions\nGROUP BY\n  deal;\n",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
