#!/bin/bash
# filepath: /Users/levisherman/Documents/code/projects/mca-platform/pocketbase/deploy.sh

set -e

PASSWORD="8RWTJH1ezsQ^WzMw"

go mod download && go mod verify

GOOS=linux GOARCH=amd64 go build -o server .

# Rsync to remote server
rsync -avz -e "sshpass -p $PASSWORD ssh"  /Users/levisherman/Documents/code/projects/mca-platform/pocketbase/server root@162.243.186.51:/root/mca/

# Rsync pb_public folder to remote server
rsync -avz -e "sshpass -p $PASSWORD ssh" /Users/levisherman/Documents/code/projects/mca-platform/pocketbase/pb_public/ root@162.243.186.51:/root/mca/pb_public/

# # # Rsync .env file to remote server
# rsync -avz -e "sshpass -p $PASSWORD ssh" /Users/levisherman/Documents/code/projects/mca-platform/pocketbase/.env root@162.243.186.51:/root/mca/.env

# # Restart mca.service on remote server
sshpass -p $PASSWORD ssh root@162.243.186.51 'systemctl restart mca.service'