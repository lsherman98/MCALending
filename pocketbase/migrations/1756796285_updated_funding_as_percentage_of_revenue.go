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
			"viewQuery": "SELECT\n    t.deal as id,\n    t.deal,\n    COALESCE(\n        (t.total_financing * 100.0 / NULLIF(t.total_revenue, 0)),\n        0\n    ) as fundingAsPercentageOfRevenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN type = 'financing' THEN ABS(amount) ELSE 0 END) as total_financing,\n        SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END) as total_revenue\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_LuVJ")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "json3825123606",
			"maxSize": 1,
			"name": "deal",
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
			"viewQuery": "SELECT\n    deal as id,\n    deal,\n    COALESCE(\n        (SUM(CASE WHEN type = 'financing' THEN ABS(amount) ELSE 0 END) * 100.0 /\n        NULLIF(SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END), 0)),\n        0\n    ) as fundingAsPercentageOfRevenue\nFROM\n    transactions\nGROUP BY\n    deal;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_612317808",
			"hidden": false,
			"id": "_clone_LuVJ",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "deal",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json3825123606")

		return app.Save(collection)
	})
}
