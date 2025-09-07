#!/bin/bash
# filepath: /Users/levisherman/Documents/code/projects/mca-platform/pocketbase/deploy.sh

set -e

go mod download && go mod verify

GOOS=linux GOARCH=amd64 go build -o server .

# Rsync to remote server
rsync -avz -e ssh /Users/levisherman/Documents/code/projects/mca-platform/pocketbase/server root@162.243.70.98:/root/pb-mca/

# Rsync pb_public folder to remote server
rsync -avz -e ssh /Users/levisherman/Documents/code/projects/mca-platform/pocketbase/pb_public/ root@162.243.70.98:/root/pb-mca/pb_public/

# Rsync .env file to remote server
rsync -avz -e ssh /Users/levisherman/Documents/code/projects/mca-platform/pocketbase/.env root@162.243.70.98:/root/pb-mca/.env

# # Restart pocketbase.service on remote server
ssh root@162.243.70.98 'systemctl restart mca.service'