# build index.android.bundle
cd ../../ # this is used on /packages/rn-sdk/android/library, if you need to run this script, just run the next line on /packages/rn-sdk
react-native bundle --platform android --entry-file index.js --bundle-output android/library/src/main/assets/index.android.bundle --assets-dest android/library/src/main/res/  --dev false
