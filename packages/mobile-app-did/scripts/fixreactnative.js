/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Fix react native Long text in inverted Flatlist causes huge performance drop on Android.
 * This is a temporary solution in react-native 0.72.4+ will solve this problem.
 */
const fs = require('fs');
var path = require('path');
const VirtualizedListPath = path.resolve(__dirname, '../node_modules/react-native/Libraries/Lists/VirtualizedList.js');
const ExpoDevicesPath = path.resolve(
  __dirname,
  '../node_modules/expo-device/android/src/main/java/expo/modules/device/DeviceModule.kt',
);

const BoostPath = path.resolve(__dirname, '../node_modules/react-native/third-party-podspecs/boost.podspec');
const ExpoBoostPath = path.resolve(__dirname, '../node_modules/expo-modules-core/android/build.gradle');

function fixStr(str, from, to) {
  if (!str.includes(from)) return str;
  return str.replace(from, to);
}

function fixScaleY(str) {
  return str.replace(
    /verticallyInverted:[^{}]*{[^{}]*transform:[^{}]*{scaleY:\s-1}[^{}]*}/,
    "verticallyInverted: Platform.OS === 'android' ? { scaleY: -1 } : { transform: [{scaleY: -1}] }",
  );
}

function fixImport(str) {
  if (str.includes("const Platform = require('../Utilities/Platform');")) return str;
  return str.replace(
    /const Batchinator = require\('..\/Interaction\/Batchinator'\);/,
    "const Batchinator = require('../Interaction/Batchinator');\nconst Platform = require('../Utilities/Platform');",
  );
}

function fixDeviceName(str) {
  const to = `"deviceName" to run {
      if (Build.VERSION.SDK_INT <= 31)
        Settings.Secure.getString(mContext.contentResolver, "bluetooth_name")
      else
        Settings.Global.getString(mContext.contentResolver, Settings.Global.DEVICE_NAME)
      },`;
  const from = `"deviceName" to Settings.Secure.getString(mContext.contentResolver, "bluetooth_name")`;
  return fixStr(str, from, to);
}
function fixReactNativeBoost(str) {
  const to = `spec.source = { :http => 'https://sourceforge.net/projects/boost/files/boost/1.76.0/boost_1_76_0.tar.bz2',`;
  const from = `spec.source = { :http => 'https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2',`;
  return fixStr(str, from, to);
}

function fixExpoBoost(str) {
  return fixStr(
    fixStr(
      str,
      'https://boostorg.jfrog.io/artifactory/main/release/',
      'https://sourceforge.net/projects/boost/files/boost/',
    ),
    '/source/boost_',
    '/boost_',
  );
}

const FIX_LIST = [
  { filePath: VirtualizedListPath, fun: data => fixScaleY(fixImport(data)) },
  { filePath: ExpoDevicesPath, fun: data => fixDeviceName(data) },
  { filePath: BoostPath, fun: data => fixReactNativeBoost(data) },
  { filePath: ExpoBoostPath, fun: data => fixExpoBoost(data) },
];

FIX_LIST.forEach(({ filePath, fun }) => {
  fs.readFile(filePath, 'utf8', function (_err, data) {
    fs.writeFile(filePath, fun(data), function (err) {
      if (err) throw err;
    });
  });
});
