/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Fix react native Long text in inverted Flatlist causes huge performance drop on Android.
 * This is a temporary solution in react-native 0.72.4+ will solve this problem.
 */
const fs = require('fs');
var path = require('path');
const VirtualizedListPath = path.resolve(__dirname, '../node_modules/react-native/Libraries/Lists/VirtualizedList.js');
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

fs.readFile(VirtualizedListPath, 'utf8', function (_err, data) {
  fs.writeFile(VirtualizedListPath, fixScaleY(fixImport(data)), function (err) {
    if (err) throw err;
  });
});
