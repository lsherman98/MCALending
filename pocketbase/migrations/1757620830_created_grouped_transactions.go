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
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_VJQD",
					"max": 0,
					"min": 0,
					"name": "description",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "json3257917790",
					"maxSize": 1,
					"name": "total",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"cascadeDelete": true,
					"collectionId": "pbc_612317808",
					"hidden": false,
					"id": "_clone_WIt0",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "deal",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "relation"
				}
			],
			"id": "pbc_2813799467",
			"indexes": [],
			"listRule": null,
			"name": "grouped_transactions",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n(ROW_NUMBER() OVER()) as id,\ndescription, \nSUM(amount) as total,\ndeal\nFROM \ntransactions\nGROUP BY\ndescription, \ndeal;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2813799467")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
