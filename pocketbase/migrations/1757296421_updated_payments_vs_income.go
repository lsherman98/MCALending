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
			"viewQuery": "WITH MonthlyFinancing AS (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as month,\n        SUM(amount) as total_financing\n    FROM transactions\n    WHERE type = 'loan_payment'\n    GROUP BY deal, month\n),\nMonthlyIncome AS (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as month,\n        SUM(amount) as total_income\n    FROM transactions\n    WHERE type = 'revenue'\n    GROUP BY deal, month\n)\nSELECT\n    mf.deal as id,\n    mf.deal,\n    AVG(ABS(mf.total_financing)) as avg_monthly_payment,\n    AVG(mi.total_income) as avg_monthly_income,\n    (CASE\n        WHEN AVG(mi.total_income) > 0\n        THEN (AVG(mf.total_financing) * 100.0) / AVG(mi.total_income)\n        ELSE 0\n    END) as payment_to_income_percentage\nFROM\n    MonthlyFinancing mf\nJOIN\n    MonthlyIncome mi ON mf.deal = mi.deal AND mf.month = mi.month\nGROUP BY\n    mf.deal;\n"
		}`), &collection); err != nil {
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
			"viewQuery": "WITH MonthlyFinancing AS (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as month,\n        SUM(amount) as total_financing\n    FROM transactions\n    WHERE type = 'loan_payment'\n    GROUP BY deal, month\n),\nMonthlyIncome AS (\n    SELECT\n        deal,\n        strftime('%Y-%m', date) as month,\n        SUM(amount) as total_income\n    FROM transactions\n    WHERE type = 'revenue'\n    GROUP BY deal, month\n)\nSELECT\n    (ROW_NUMBER() OVER()) as id,\n    mf.deal,\n    AVG(ABS(mf.total_financing)) as avg_monthly_payment,\n    AVG(mi.total_income) as avg_monthly_income,\n    (CASE\n        WHEN AVG(mi.total_income) > 0\n        THEN (AVG(mf.total_financing) * 100.0) / AVG(mi.total_income)\n        ELSE 0\n    END) as payment_to_income_percentage\nFROM\n    MonthlyFinancing mf\nJOIN\n    MonthlyIncome mi ON mf.deal = mi.deal AND mf.month = mi.month\nGROUP BY\n    mf.deal;\n"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
