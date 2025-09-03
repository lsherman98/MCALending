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
					"cascadeDelete": false,
					"collectionId": "pbc_612317808",
					"hidden": false,
					"id": "_clone_356C",
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
					"id": "json4167872186",
					"maxSize": 1,
					"name": "totalFinancingAmount",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_102146027",
			"indexes": [],
			"listRule": null,
			"name": "total_financeing",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    deal as id,\n    deal,\n    SUM(ABS(amount)) as totalFinancingAmount\nFROM\n    transactions\nWHERE\n    type = 'financing'\nGROUP BY\n    deal;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_102146027")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
