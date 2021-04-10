#!/usr/bin/env bash

cd ./ui/
    yarn lint-fix
    yarn unit
    yarn build-prod

cd ../

cd ./api/

    ./gradlew clean build

cd ../