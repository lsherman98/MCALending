package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2699979480")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "select2324736937",
			"maxSelect": 1,
			"name": "key",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"ascend",
				"bmo",
				"choice_one",
				"chase",
				"universal",
				"wells_fargo",
				"first_loyal"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2699979480")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "select2324736937",
			"maxSelect": 1,
			"name": "key",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"ascend",
				"bmo",
				"choice_one",
				"chase",
				"universal",
				"wells_fargo",
				"first_loyal"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
