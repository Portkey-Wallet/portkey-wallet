# build index.android.bundle
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/../"
if [ ! -d "android/app/src/main/assets" ]; then
  mkdir -p android/app/src/main/assets
fi
if [ ! -f "android/app/src/main/assets/index.android.bundle" ]; then
  touch android/app/src/main/assets/index.android.bundle
fi
react-native bundle --platform android --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res  --dev true