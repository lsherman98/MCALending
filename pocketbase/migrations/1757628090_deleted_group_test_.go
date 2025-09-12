package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1060585696")
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
					"id": "json561820194",
					"maxSize": 1,
					"name": "gdescription",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
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
					"hidden": false,
					"id": "number2245608546",
					"max": null,
					"min": null,
					"name": "count",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "_clone_X9g5",
					"maxSelect": 1,
					"name": "type",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "select",
					"values": [
						"revenue",
						"transfer",
						"funding",
						"none",
						"payment",
						"expense"
					]
				},
				{
					"cascadeDelete": true,
					"collectionId": "pbc_612317808",
					"hidden": false,
					"id": "_clone_9oGp",
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
					"id": "json2876557598",
					"maxSize": 1,
					"name": "dates",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1060585696",
			"indexes": [],
			"listRule": null,
			"name": "group_test",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    REPLACE(\n        REPLACE(\n            REPLACE(\n                REPLACE(\n                    REPLACE(\n                        REPLACE(\n                            REPLACE(\n                                REPLACE(\n                                    REPLACE(\n                                        REPLACE(\n                                            REPLACE(\n                                                description, '0', ''),\n                                            '1', ''),\n                                        '2', ''),\n                                    '3', ''),\n                                '4', ''),\n                            '5', ''),\n                        '6', ''),\n                    '7', ''),\n                '8', ''),\n            '9', ''),\n        ' ', ' ') AS gdescription,\n    ROUND(SUM(amount), 2) as total,\n    COUNT(id) as count,\n    type,\n    deal,\n    STRING_AGG(date, ', ') AS dates\nFROM\n    transactions\nWHERE\n    type = \"funding\" OR type = \"payment\"\nGROUP BY\n    gdescription,\n    deal,\n    type;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
