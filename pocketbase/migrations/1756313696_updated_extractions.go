package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2222278443")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(12, []byte(`{
			"hidden": false,
			"id": "date3099473750",
			"max": "",
			"min": "",
			"name": "statement_date",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(13, []byte(`{
			"hidden": false,
			"id": "number2194105460",
			"max": null,
			"min": null,
			"name": "beginning_balance",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(14, []byte(`{
			"hidden": false,
			"id": "number1005429446",
			"max": null,
			"min": null,
			"name": "total_deposits_credits",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(15, []byte(`{
			"hidden": false,
			"id": "number2505748572",
			"max": null,
			"min": null,
			"name": "total_checks_debits",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(16, []byte(`{
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
		if err := collection.Fields.AddMarshaledJSONAt(17, []byte(`{
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
		if err := collection.Fields.AddMarshaledJSONAt(18, []byte(`{
			"hidden": false,
			"id": "number1739540707",
			"max": null,
			"min": null,
			"name": "ending_balance",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(19, []byte(`{
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
		if err := collection.Fields.AddMarshaledJSONAt(20, []byte(`{
			"hidden": false,
			"id": "number2008163050",
			"max": null,
			"min": null,
			"name": "total_overdraft_fee",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(21, []byte(`{
			"hidden": false,
			"id": "number2856067821",
			"max": null,
			"min": null,
			"name": "total_returned_item_fees",
			"onlyInt": false,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2222278443")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("date3099473750")

		// remove field
		collection.Fields.RemoveById("number2194105460")

		// remove field
		collection.Fields.RemoveById("number1005429446")

		// remove field
		collection.Fields.RemoveById("number2505748572")

		// remove field
		collection.Fields.RemoveById("number1806475522")

		// remove field
		collection.Fields.RemoveById("number1403005876")

		// remove field
		collection.Fields.RemoveById("number1739540707")

		// remove field
		collection.Fields.RemoveById("number2513799993")

		// remove field
		collection.Fields.RemoveById("number2008163050")

		// remove field
		collection.Fields.RemoveById("number2856067821")

		return app.Save(collection)
	})
}
