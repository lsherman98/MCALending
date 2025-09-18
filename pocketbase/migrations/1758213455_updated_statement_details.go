package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3855846597")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("number1806475522")

		// remove field
		collection.Fields.RemoveById("number1403005876")

		// remove field
		collection.Fields.RemoveById("number2513799993")

		// remove field
		collection.Fields.RemoveById("number2008163050")

		// remove field
		collection.Fields.RemoveById("number2856067821")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3855846597")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "number1806475522",
			"max": null,
			"min": null,
			"name": "service_charge",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "number1403005876",
			"max": null,
			"min": null,
			"name": "interest_paid",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"hidden": false,
			"id": "number2513799993",
			"max": null,
			"min": null,
			"name": "days_in_period",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(9, []byte(`{
			"hidden": false,
			"id": "number2008163050",
			"max": null,
			"min": null,
			"name": "overdraft_fee",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(10, []byte(`{
			"hidden": false,
			"id": "number2856067821",
			"max": null,
			"min": null,
			"name": "returned_item_fees",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
