package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1374578849")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT\n  deal as id,\n  SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END) AS payments,\n  SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) AS revenue\nFROM\n  transactions\nGROUP BY\n  deal;\n"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json35144604")

		// remove field
		collection.Fields.RemoveById("json3206025734")

		// remove field
		collection.Fields.RemoveById("json797078559")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "json1708301106",
			"maxSize": 1,
			"name": "payments",
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
		collection, err := app.FindCollectionByNameOrId("pbc_1374578849")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "WITH MonthlyFinancing AS (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as month,\n        SUM(amount) as payments\n    FROM transactions\n    WHERE type = 'payment'\n    GROUP BY deal, month\n),\nMonthlyRevenue AS (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as month,\n        SUM(amount) as revenue\n    FROM transactions\n    WHERE type = 'revenue'\n    GROUP BY deal, month\n)\nSELECT\n    mf.deal as id,\n    AVG(ABS(mf.payments)) as avg_monthly_payment,\n    AVG(mr.revenue) as avg_monthly_income,\n    (CASE\n        WHEN AVG(mr.revenue) > 0\n        THEN (AVG(mf.payments) * 100.0) / AVG(mr.revenue)\n        ELSE 0\n    END) as payment_to_income_percentage\nFROM\n    MonthlyFinancing mf\nJOIN\n    MonthlyRevenue mr ON mf.deal = mr.deal AND mf.month = mr.month\nGROUP BY\n    mf.deal;\n"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "json35144604",
			"maxSize": 1,
			"name": "avg_monthly_payment",
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
			"id": "json3206025734",
			"maxSize": 1,
			"name": "avg_monthly_income",
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
			"id": "json797078559",
			"maxSize": 1,
			"name": "payment_to_income_percentage",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json1708301106")

		// remove field
		collection.Fields.RemoveById("json3910233221")

		return app.Save(collection)
	})
}
