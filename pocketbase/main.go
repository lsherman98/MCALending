package main

import (
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
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/extraction_hooks"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/job_hooks"
	"github.com/lsherman98/mca-platform/pocketbase/pb_hooks/statement_hooks"
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

	err = statement_hooks.Init(app, llama)
	if err != nil {
		log.Fatal(err)
	}

	err = job_hooks.Init(app, llama)
	if err != nil {
		log.Fatal(err)
	}

	err = extraction_hooks.Init(app)
	if err != nil {
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
