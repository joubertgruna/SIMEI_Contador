#!/bin/sh
# entrypoint: write runtime envs into a JS file consumed by the SPA
# This file is run by the final nginx image to inject runtime environment variables
set -e

# Fallbacks
: ${REACT_APP_API_URL:=http://localhost:3001/api}

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  REACT_APP_API_URL: "$REACT_APP_API_URL"
};
EOF

# Start nginx in foreground
exec nginx -g "daemon off;"
