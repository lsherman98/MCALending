package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2848304293")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    t.deal as id,\n    t.financing,\n    t.revenue\nFROM (\n    SELECT\n        deal,\n        statement,\n        SUM(CASE WHEN type = 'funding' THEN amount ELSE 0 END) as financing,\n        SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as revenue\n    FROM\n        transactions\n    GROUP BY\n        deal,\n  statement\n) t;"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2848304293")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n    t.deal as id,\n    t.financing,\n    t.revenue\nFROM (\n    SELECT\n        deal,\n        SUM(CASE WHEN type = 'funding' THEN amount ELSE 0 END) as financing,\n        SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as revenue\n    FROM\n        transactions\n    GROUP BY\n        deal\n) t;"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
