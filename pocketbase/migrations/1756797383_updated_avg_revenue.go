package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_948207165")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "avg_daily_revenue",
			"viewQuery": "SELECT\n    strftime('%Y-%m-%d', date) as id, -- Unique ID based on the day\n    strftime('%Y-%m-%d', date) as day,\n    deal,\n    SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END) as dailyRevenue\nFROM\n    transactions\nGROUP BY\n    strftime('%Y-%m-%d', date), deal;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json1532651968")

		// remove field
		collection.Fields.RemoveById("json3825123606")

		// remove field
		collection.Fields.RemoveById("json728836091")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "json3852478864",
			"maxSize": 1,
			"name": "day",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_612317808",
			"hidden": false,
			"id": "_clone_zmP1",
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "json1587643702",
			"maxSize": 1,
			"name": "dailyRevenue",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_948207165")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "avg_revenue",
			"viewQuery": "SELECT\n    deal as id,\n    strftime('%Y-%W', date) as week,\n    deal,\n    AVG(dailyRevenue) as averageWeeklyRevenue\nFROM (\n    SELECT\n        date,\n        deal,\n        SUM(CASE WHEN amount > 0 AND (type = 'revenue' OR type = '') THEN amount ELSE 0 END) as dailyRevenue\n    FROM\n        transactions\n    GROUP BY\n        strftime('%Y-%m-%d', date), deal\n)\nGROUP BY\n    week, deal;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "json1532651968",
			"maxSize": 1,
			"name": "week",
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "json728836091",
			"maxSize": 1,
			"name": "averageWeeklyRevenue",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "json"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("json3852478864")

		// remove field
		collection.Fields.RemoveById("_clone_zmP1")

		// remove field
		collection.Fields.RemoveById("json1587643702")

		return app.Save(collection)
	})
}
