package main

import (
	"context"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	"github.com/lsherman98/mca-platform/pocketbase/llama_client"
	_ "github.com/lsherman98/mca-platform/pocketbase/migrations"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/current_deal_hooks"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/extraction_hooks"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/full_text_search"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/job_hooks"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/plaid_hooks"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/statement_hooks"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/webhooks"
	"github.com/lsherman98/mca-platform/pocketbase/plaid_client"
	"google.golang.org/genai"
)

func main() {
	app := pocketbase.New()

	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	llama, err := llama_client.New(app)
	if err != nil {
		log.Fatal(err)
	}

	plaid, err := plaid_client.New(app)
	if err != nil {
		log.Fatal(err)
	}

	gemini, err := genai.NewClient(context.Background(), &genai.ClientConfig{
		APIKey:  os.Getenv("GEMINI_API_KEY"),
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatal(err)
	}

	err = statement_hooks.Init(app, llama)
	if err != nil {
		log.Fatal(err)
	}

	err = job_hooks.Init(app, llama)
	if err != nil {
		log.Fatal(err)
	}

	err = extraction_hooks.Init(app, gemini)
	if err != nil {
		log.Fatal(err)
	}

	err = current_deal_hooks.Init(app)
	if err != nil {
		log.Fatal(err)
	}

	if err := full_text_search.Init(app, "transactions", "deals"); err != nil {
		log.Fatal(err)
	}

	if err := plaid_hooks.Init(app, plaid); err != nil {
		log.Fatal(err)
	}

	if err := webhooks.Init(app); err != nil {
		log.Fatal(err)
	}

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), true))
		return se.Next()
	})

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
