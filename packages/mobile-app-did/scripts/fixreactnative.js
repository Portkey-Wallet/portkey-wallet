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
  if (!str.includes(from)) return str;
  return str.replace(from, to);
}

const FIX_LIST = [
  { filePath: VirtualizedListPath, fun: data => fixScaleY(fixImport(data)) },
  { filePath: ExpoDevicesPath, fun: data => fixDeviceName(data) },
];

FIX_LIST.forEach(({ filePath, fun }) => {
  fs.readFile(filePath, 'utf8', function (_err, data) {
    fs.writeFile(filePath, fun(data), function (err) {
      if (err) throw err;
    });
  });
});
