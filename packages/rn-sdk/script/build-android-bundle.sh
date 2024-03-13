# build index.android.bundle
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/../"
if [ ! -d "android/src/main/assets" ]; then
  mkdir -p android/src/main/assets
fi
if [ ! -f "android/src/main/assets/index.android.bundle" ]; then
  touch android/src/main/assets/index.android.bundle
fi
react-native bundle --platform android --entry-file index.js --bundle-output android/src/main/assets/index.android.bundle --assets-dest android/src/main/res  --dev true
