#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

cd "$SCRIPT_DIR/../app_android"

# todo build aar, not finished
./gradlew library:assembleDebug