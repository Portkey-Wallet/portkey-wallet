# Import provider
cp -rf node_modules/@portkey/mobile-provider/dist/index.js js/utils/InpageBridgeWeb3.js
cp -rf js/utils/InpageBridgeWeb3.js android/app/src/main/assets/.
echo "cp InpageBridgeWeb3 success"

node scripts/fixreactnative.js
echo "fix react-native success"

# Fix 16KB page alignment for Android (required for targetSdk 35+)
bash scripts/fix-16kb-alignment.sh
echo "fix 16KB alignment success"
