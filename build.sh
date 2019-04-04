#!/usr/bin/env bash

cd ./ui/
    npm run sass-lint
    npm run lint
    npm run unit
    npm run build-prod

cd ../

cd ./api/

    ./gradlew clean build

cd ../