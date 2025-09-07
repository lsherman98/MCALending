package current_deal_hooks

import (
	"fmt"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func Init(app *pocketbase.PocketBase) error {
	app.OnRecordsListRequest("current_deal").BindFunc(func(e *core.RecordsListRequestEvent) error {
		currentDealCollection, err := e.App.FindCollectionByNameOrId("current_deal")
		if err != nil {
			return err
		}

		dealsCollection, err := e.App.FindCollectionByNameOrId("deals")
		if err != nil {
			return err
		}

		if len(e.Records) == 0 {
			filterQuery := e.Request.URL.Query()["filter"]
			if len(filterQuery) == 0 {
				return e.Next()
			}

			userFilter := filterQuery[0]
			filterParts := strings.Split(userFilter, "=")

			if len(filterParts) < 2 {
				return e.Next()
			}

			user := filterParts[1]
			user = strings.ReplaceAll(user, "\"", "")
			user = strings.ReplaceAll(user, " ", "")

			deal, err := e.App.FindFirstRecordByFilter(dealsCollection, fmt.Sprintf("user='%s'", user))
			if err != nil {
				return e.Next()
			}

			currentDealRecord := core.NewRecord(currentDealCollection)
			currentDealRecord.Set("user", user)
			currentDealRecord.Set("deal", deal.Id)

			if err := e.App.Save(currentDealRecord); err != nil {
				return e.Next()
			}
		}

		return e.Next()
	})

	return nil
}
