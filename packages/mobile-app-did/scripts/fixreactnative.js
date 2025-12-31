/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Post-install fixes for React Native dependencies
 *
 * Removed fixes (no longer needed):
 * - VirtualizedList scaleY: Fixed in RN 0.72.4+
 * - ExpoDevices deviceName: Fixed in expo-device 7.0+
 * - Boost URL (RN & Expo): RN 0.77+ uses git source
 */
const fs = require('fs');
const path = require('path');

// File paths
const RSAPath = path.resolve(__dirname, '../../../node_modules/@portkey/utils/dist/commonjs/rsa.js');
const RNNestedScrollViewPath = path.resolve(
  __dirname,
  '../../../node_modules/@sdcx/nested-scroll/ios/NestedScrollView/RNNestedScrollView.m',
);

// Helper function
function fixStr(str, from, to) {
  if (!str || !str.includes(from)) {
    return str;
  }
  return str.replace(from, to);
}

// Fix: Replace Node.js crypto with react-native-crypto
function fixRsaFile(str) {
  const from = 'const crypto_1 = __importDefault(require("crypto"));';
  const to = 'const crypto_1 = __importDefault(require("react-native-crypto"));';
  return fixStr(str, from, to);
}

// Fix: NestedScrollView gesture recognizer compatibility
function fixNestedScrollViewFile(str) {
  const from =
    'gestureRecognizer == self.panGestureRecognizer && otherGestureRecognizer == self.target.panGestureRecognizer';
  const to = 'gestureRecognizer == self.panGestureRecognizer';
  return fixStr(str, from, to);
}

const FIX_LIST = [
  { filePath: RSAPath, fun: fixRsaFile, name: 'RSA crypto' },
  { filePath: RNNestedScrollViewPath, fun: fixNestedScrollViewFile, name: 'NestedScrollView' },
];

FIX_LIST.forEach(({ filePath, fun, name }) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(`⚠️  Skip ${name}: file not found`);
      return;
    }
    const fixed = fun(data);
    if (fixed !== data) {
      fs.writeFile(filePath, fixed, writeErr => {
        if (writeErr) {
          console.error(`❌ Failed to fix ${name}:`, writeErr.message);
        } else {
          console.log(`✅ Fixed ${name}`);
        }
      });
    } else {
      console.log(`✓  ${name}: already fixed or not needed`);
    }
  });
});
