package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2409499253")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(11, []byte(`{
			"cascadeDelete": true,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "relation3235598710",
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
		collection, err := app.FindCollectionByNameOrId("pbc_2409499253")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(11, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "relation3235598710",
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
