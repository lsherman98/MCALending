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
					"id": "_clone_mSY2",
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
					"id": "number1750180128",
					"max": null,
					"min": null,
					"name": "financingPaymentsCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				}
			],
			"id": "pbc_416051302",
			"indexes": [],
			"listRule": null,
			"name": "finance_freq",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    deal as id,\n    strftime('%Y-%m', date) as month,\n    deal,\n    COUNT(id) as financingPaymentsCount\nFROM\n    transactions\nWHERE\n    type = 'financing'\nGROUP BY\n    month, deal;\n",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_416051302")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
