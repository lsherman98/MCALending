package plaid_client

import (
	"errors"
	"os"

	"github.com/plaid/plaid-go/v31/plaid"
	"github.com/pocketbase/pocketbase"
)

func New(app *pocketbase.PocketBase) (*plaid.APIClient, error) {
	PLAID_CLIENT_ID := os.Getenv("PLAID_CLIENT_ID")
	PLAID_SECRET := os.Getenv("PLAID_SECRET")

	if PLAID_CLIENT_ID == "" || PLAID_SECRET == "" {
		app.Logger().Error("PLAID_CLIENT_ID or PLAID_SECRET environment variable is not set")
		return nil, errors.New("PLAID_CLIENT_ID or PLAID_SECRET environment variable is not set")
	}

	environments := map[string]plaid.Environment{
		"sandbox":    plaid.Sandbox,
		"production": plaid.Production,
	}

	PLAID_ENV := os.Getenv("PLAID_ENV")
	if PLAID_ENV == "" {
		PLAID_ENV = "sandbox"
	}

	configuration := plaid.NewConfiguration()
	configuration.AddDefaultHeader("PLAID-CLIENT-ID", PLAID_CLIENT_ID)
	configuration.AddDefaultHeader("PLAID-SECRET", PLAID_SECRET)
	configuration.UseEnvironment(environments[PLAID_ENV])
	client := plaid.NewAPIClient(configuration)
	return client, nil
}
