# Import provider
cp -rf node_modules/@portkey/mobile-provider/dist/index.js js/utils/InpageBridgeWeb3.js
cp -rf js/utils/InpageBridgeWeb3.js android/app/src/main/assets/.
echo "cp InpageBridgeWeb3 success"

node scripts/fixreactnative.js
echo "fix react-native success"
