package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3180628588")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json2918445923")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_2222278443",
			"hidden": false,
			"id": "relation3235598710",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "statement",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "file3086905853",
			"maxSelect": 1,
			"maxSize": 0,
			"mimeTypes": [
				"application/json"
			],
			"name": "data",
			"presentable": false,
			"protected": true,
			"required": true,
			"system": false,
			"thumbs": [],
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3180628588")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "json2918445923",
			"maxSize": 0,
			"name": "data",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation3235598710")

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "file3086905853",
			"maxSelect": 1,
			"maxSize": 0,
			"mimeTypes": [
				"application/json"
			],
			"name": "file",
			"presentable": false,
			"protected": true,
			"required": true,
			"system": false,
			"thumbs": [],
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
