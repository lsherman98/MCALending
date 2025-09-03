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
			"viewQuery": "SELECT\n    t.deal as id,\n    t.deal,\n    COALESCE(\n        (t.total_financing * 100.0 / NULLIF(t.total_revenue, 0)),\n        0\n    ) as fundingAsPercentageOfRevenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN transactions.type = 'financing' THEN ABS(transactions.amount) ELSE 0 END) as total_financing,\n        SUM(CASE WHEN transactions.amount > 0 AND (transactions.type = 'revenue' OR type = '') THEN transactions.amount ELSE 0 END) as total_revenue\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;"
		}`), &collection); err != nil {
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
			"viewQuery": "SELECT\n    t.deal as id,\n    t.deal,\n    COALESCE(\n        (t.total_financing * 100.0 / NULLIF(t.total_revenue, 0)),\n        0\n    ) as fundingAsPercentageOfRevenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN type = 'financing' THEN ABS(amount) ELSE 0 END) as total_financing,\n        SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END) as total_revenue\n    FROM\n        transactions as t\n    GROUP BY\n        deal\n) t;"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
