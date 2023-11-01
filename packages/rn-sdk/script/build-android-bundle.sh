# build index.android.bundle
cd ../
react-native bundle --platform android --entry-file index.js --bundle-output android/library/src/main/assets/index.android.bundle --assets-dest android/library/src/main/res/  --dev true
