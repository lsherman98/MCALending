package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2941801414")
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
					"cascadeDelete": false,
					"collectionId": "pbc_612317808",
					"hidden": false,
					"id": "_clone_iBww",
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
					"id": "json204221306",
					"maxSize": 1,
					"name": "first_financing_date",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json3255964669",
					"maxSize": 1,
					"name": "total_financing",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "number1879724404",
					"max": null,
					"min": null,
					"name": "financing_frequency",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				}
			],
			"id": "pbc_2941801414",
			"indexes": [],
			"listRule": null,
			"name": "financing_details",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n    t.deal,\n    MIN(t.date) as first_financing_date,\n    SUM(t.amount) as total_financing,\n    COUNT(t.id) as financing_frequency\nFROM\n    transactions AS t\nWHERE\n    t.type = 'financing'\nGROUP BY\n    t.deal;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
