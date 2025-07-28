#/bin/bash

# install dependencies (if not installed)
if [ ! -d "node_modules" ]; then
    sh scripts/install.sh
fi

# start app
npm run dev
