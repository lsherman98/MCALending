package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1415484045")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    t.deal as id,\n    t.deal,\n    (t.total_revenue - t.total_financing_transfers) as real_revenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END) as total_revenue,\n        SUM(CASE WHEN type = 'financing' OR type = 'transfer' THEN ABS(amount) ELSE 0 END) as total_financing_transfers\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json2375761822")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "json3996036113",
			"maxSize": 1,
			"name": "real_revenue",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1415484045")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    t.deal as id,\n    t.deal,\n    (t.total_revenue - t.total_financing_transfers) as realRevenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END) as total_revenue,\n        SUM(CASE WHEN type = 'financing' OR type = 'transfer' THEN ABS(amount) ELSE 0 END) as total_financing_transfers\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "json2375761822",
			"maxSize": 1,
			"name": "realRevenue",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json3996036113")

		return app.Save(collection)
	})
}
