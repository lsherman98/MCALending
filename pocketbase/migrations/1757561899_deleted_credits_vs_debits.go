package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_78697642")
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
					"id": "_clone_heuL",
					"max": "",
					"min": "",
					"name": "date",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "date"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text3825123606",
					"max": 0,
					"min": 0,
					"name": "deal",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"cascadeDelete": true,
					"collectionId": "pbc_2222278443",
					"hidden": false,
					"id": "_clone_0COY",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "statement",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "relation"
				},
				{
					"hidden": false,
					"id": "_clone_CzX7",
					"max": null,
					"min": null,
					"name": "total_checks_debits",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json2929236259",
					"maxSize": 1,
					"name": "total_checks_credit",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_78697642",
			"indexes": [],
			"listRule": "",
			"name": "credits_vs_debits",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    sd.date,\n    CAST(t.deal as TEXT) as deal,\n    sd.statement,\n    sd.total_checks_debits,\n    IFNULL(cp.total_checks_amount, 0) as total_checks_credit\nFROM\n    statement_details sd\nJOIN\n    (SELECT DISTINCT deal, statement FROM transactions) t ON sd.statement = t.statement\nLEFT JOIN\n    (SELECT statement, SUM(amount) as total_checks_amount FROM checks_paid GROUP BY statement) cp ON sd.statement = cp.statement\nORDER BY\n    t.deal, sd.date;",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
