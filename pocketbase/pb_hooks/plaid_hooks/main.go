package plaid_hooks

import (
	"context"
	"fmt"
	"net/http"
	"time"

	plaid "github.com/plaid/plaid-go/v31/plaid"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func Init(app *pocketbase.PocketBase, plaid_client *plaid.APIClient) error {
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.POST("/api/plaid/create-link-token", func(e *core.RequestEvent) error {
			var body CreateLinkTokenRequest
			err := e.BindBody(&body)
			if err != nil {
				e.App.Logger().Error("Failed to read body: " + err.Error())
				return err
			}

			if body.UserID == "" {
				e.App.Logger().Error("User is required")
				return nil
			}

			user := plaid.LinkTokenCreateRequestUser{
				ClientUserId: body.UserID,
			}

			request := plaid.NewLinkTokenCreateRequest("Plaid Test App", "en", []plaid.CountryCode{plaid.COUNTRYCODE_US}, user)
			request.SetWebhook("https://mca.levisherman.xyz/api/plaid/webhook")
			request.SetProducts([]plaid.Products{plaid.PRODUCTS_TRANSACTIONS})

			resp, _, err := plaid_client.PlaidApi.LinkTokenCreate(context.Background()).LinkTokenCreateRequest(*request).Execute()
			if err != nil {
				e.App.Logger().Error("Failed to create link token: " + err.Error())
				e.App.Logger().Error(fmt.Sprintf("%+v", resp))
				return err
			}

			return e.JSON(http.StatusOK, map[string]any{
				"link_token": resp.GetLinkToken(),
			})
		})

		se.Router.POST("/api/plaid/set-access-token", func(e *core.RequestEvent) error {
			var body SetAccessTokenRequest
			err := e.BindBody(&body)
			if err != nil {
				e.App.Logger().Error("Failed to read body: " + err.Error())
				return err
			}

			exchangePublicTokenReq := plaid.NewItemPublicTokenExchangeRequest(body.PublicToken)
			exchangePublicTokenResp, _, err := plaid_client.PlaidApi.ItemPublicTokenExchange(e.Request.Context()).ItemPublicTokenExchangeRequest(
				*exchangePublicTokenReq,
			).Execute()
			if err != nil {
				e.App.Logger().Error("Failed to exchange public token: " + err.Error())
				return err
			}

			accessToken := exchangePublicTokenResp.GetAccessToken()
			itemID := exchangePublicTokenResp.GetItemId()
			userId := body.UserID

			plaidTokensCollection, err := e.App.FindCollectionByNameOrId("plaid_tokens")
			if err != nil {
				e.App.Logger().Error("Failed to find plaid_tokens collection: " + err.Error())
				return err
			}

			record := core.NewRecord(plaidTokensCollection)
			record.Set("user", userId)
			record.Set("access_token", accessToken)
			record.Set("item_id", itemID)

			if err := e.App.Save(record); err != nil {
				e.App.Logger().Error("Failed to save plaid token record: " + err.Error())
				return err
			}

			return e.JSON(http.StatusOK, map[string]any{
				"access_token": accessToken,
				"item_id":      itemID,
			})
		})

		se.Router.POST("/api/plaid/webhook", func(e *core.RequestEvent) error {
			var body WebhookRequest
			err := e.BindBody(&body)
			if err != nil {
				e.App.Logger().Error("Failed to read body: " + err.Error())
				return err
			}

			accessTokenRecord, err := e.App.FindFirstRecordByData("plaid_tokens", "item_id", body.ItemID)
			if err != nil {
				e.App.Logger().Error("Failed to find access token record: " + err.Error())
				return err
			}

			accessToken := accessTokenRecord.GetString("access_token")
			userId := accessTokenRecord.GetString("user")

			switch body.WebhookCode {
			case "HISTORICAL_UPDATE":
				const iso8601TimeFormat = "2006-01-02"
				startDate := time.Now().Add(-730 * 24 * time.Hour).Format(iso8601TimeFormat)
				endDate := time.Now().Format(iso8601TimeFormat)

				request := plaid.NewTransactionsGetRequest(
					accessToken,
					startDate,
					endDate,
				)

				options := plaid.TransactionsGetRequestOptions{
					Count:                          plaid.PtrInt32(500),
					Offset:                         plaid.PtrInt32(0),
					IncludePersonalFinanceCategory: plaid.PtrBool(true),
					IncludeOriginalDescription:     *plaid.NewNullableBool(plaid.PtrBool(true)),
				}

				request.SetOptions(options)

				transactionsResp, _, err := plaid_client.PlaidApi.TransactionsGet(e.Request.Context()).TransactionsGetRequest(*request).Execute()
				if err != nil {
					e.App.Logger().Error("Failed to get transactions: " + err.Error())
					return err
				}

				plaidTransactionsCollection, err := e.App.FindCollectionByNameOrId("plaid_transactions")
				if err != nil {
					e.App.Logger().Error("Failed to find plaid_transactions collection: " + err.Error())
					return err
				}

				transactions := transactionsResp.GetTransactions()
				for _, transaction := range transactions {
					record := core.NewRecord(plaidTransactionsCollection)
					record.Set("account_id", transaction.AccountId)
					record.Set("amount", transaction.Amount)
					record.Set("date", transaction.Date)
					record.Set("name", transaction.Name)
					record.Set("merchant_name", transaction.MerchantName.Get())
					record.Set("website", transaction.Website.Get())
					record.Set("user", userId)
					record.Set("description", transaction.OriginalDescription.Get())

					if err := e.App.Save(record); err != nil {
						e.App.Logger().Error("Failed to save plaid transaction record: " + err.Error())
						return err
					}
				}
			}

			return e.JSON(http.StatusOK, map[string]any{"status": "ok"})
		})

		return se.Next()
	})

	return nil
}
