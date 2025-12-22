#!/bin/bash

# filepath: packages/mobile-aelf/scripts/postinstall.sh

set -e

SOURCE_FILE="js/utils/InpageBridgeWeb3.js"
TARGET_DIR="android/app/src/main/assets"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Creating assets directory..."
  mkdir -p "$TARGET_DIR"
fi

echo "Copying $SOURCE_FILE to $TARGET_DIR..."
# cp -rf node_modules/@portkey/mobile-provider/dist/index.js "$SOURCE_FILE"
cp -rf node_modules/@portkey/mobile-provider/dist/mini-fairyVault-.js "$SOURCE_FILE"
cp -rf "$SOURCE_FILE" "$TARGET_DIR/."
echo "cp InpageBridgeWeb3 success"

node scripts/fixreactnative.js
echo "fix react-native success"

# # Import provider
# cp -rf node_modules/@portkey/mobile-provider/dist/index.js js/utils/InpageBridgeWeb3.js
# cp -rf js/utils/InpageBridgeWeb3.js android/app/src/main/assets/.
# echo "cp InpageBridgeWeb3 success"

# node scripts/fixreactnative.js
# echo "fix react-native success"

