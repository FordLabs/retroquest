#!/usr/bin/env bash

cd ./ui/
    npm run unit
    npm run build-prod

cd ../

cd ./api/

    ./gradlew clean build

cd ../