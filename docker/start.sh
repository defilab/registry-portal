#! /bin/bash

find /usr/share/nginx/html -name "*.js" -print0 | xargs -0 sed -i "s@ENV_API_BASE_URL@$API_BASE_URL@g"
nginx -g 'daemon off;'