#!/bin/bash

# Change root user SSH password
echo "root:$SSH_PASSWORD" | chpasswd

# Remove all other config files besides the one for the current environment
# find dist/config/ -maxdepth 1 ! -name $NODE_ENV.json -name '*.json' -delete

cd /usr/app/server
# Start process with pm2
pm2 start app-start.config.js

# Start nginx
nginx -g 'daemon off;'
