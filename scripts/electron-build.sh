#!/bin/bash

# install dependencies (if not installed)
if [ ! -d "node_modules" ]; then
    sh scripts/install.sh
fi

# delete old build (if exists)
if [ -d "dist" ]; then
    sudo rm -rf dist
fi

# build electron app
docker-compose run --rm node npm run electron-dist
