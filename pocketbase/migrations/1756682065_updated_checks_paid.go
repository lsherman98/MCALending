package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3127774936")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "relation987542998",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "statement",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3127774936")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "relation987542998",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "statement",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
