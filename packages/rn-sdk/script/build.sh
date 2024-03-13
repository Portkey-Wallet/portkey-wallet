if [ ! -d "output" ]; then
  mkdir output
  echo "\033[32mSuccessfully created output directory\033[0m"
else
  echo "\033[33mWarning: The output directory already exists, Skip~\033[0m"
fi
react-native bundle --platform android --entry-file index.js --bundle-output output/index.android.bundle --dev false
react-native bundle --platform ios --entry-file index.js --bundle-output output/index.ios.bundle  --dev false
