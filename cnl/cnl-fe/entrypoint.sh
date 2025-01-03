#!/bin/bash

KEYS=(
  "REACT_APP_ENV"
  "REACT_APP_BACKEND_CNL_URL"
)

# Replace all __KEY__ with the value of the variable KEY at beginning of the container
for KEY in "${KEYS[@]}"; do
  VALUE=${!KEY}

  sed -i "s#__${KEY}__#${VALUE}#g" /usr/share/nginx/html/env.js
done

exec "$@"