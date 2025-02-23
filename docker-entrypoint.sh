#!/bin/sh

chown -R node:node $DATA_DIR

su -p node -c "cd /app && $*"