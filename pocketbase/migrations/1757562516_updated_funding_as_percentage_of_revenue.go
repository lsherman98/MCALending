package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_889803432")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "funding_vs_revenue",
			"viewQuery": "SELECT\n    t.deal as id,\n    t.financing,\n    t.revenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN type = 'funding' THEN amount ELSE 0 END) as financing,\n        SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as revenue\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json3255964669")

		// remove field
		collection.Fields.RemoveById("json487443959")

		// remove field
		collection.Fields.RemoveById("json2979527789")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "json2127196139",
			"maxSize": 1,
			"name": "financing",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "json3910233221",
			"maxSize": 1,
			"name": "revenue",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_889803432")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "funding_as_percentage_of_revenue",
			"viewQuery": "SELECT\n    t.deal as id,\n    t.total_financing,\n    t.total_revenue,\n    COALESCE(\n        (t.total_financing * 100.0 / NULLIF(t.total_revenue, 0)),\n        0\n    ) as funding_as_percentage_of_revenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN type = 'funding' THEN ABS(amount) ELSE 0 END) as total_financing,\n        SUM(CASE WHEN amount > 0 AND (type = 'revenue') THEN amount ELSE 0 END) as total_revenue\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "json3255964669",
			"maxSize": 1,
			"name": "total_financing",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "json487443959",
			"maxSize": 1,
			"name": "total_revenue",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "json2979527789",
			"maxSize": 1,
			"name": "funding_as_percentage_of_revenue",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json2127196139")

		// remove field
		collection.Fields.RemoveById("json3910233221")

		return app.Save(collection)
	})
}
