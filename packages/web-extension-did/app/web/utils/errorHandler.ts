/**
 * 1xxxxx try catch
 * 2xxxxx handle
 * 3xxxxx
 * 4xxxxx input error
 * 5xxxxx rpc error
 * 6xxxxx event error
 */
// About Error Code. Redundant design.

// Unified format: A-BB-CCC
// A: Error level, such as 1 for system-level errors, 2 for service-level errors;
// // B: Project or module name, generally the company will not have more than 99 projects;
// // C: The specific error number can be incremented automatically, and 999 errors in one project should be enough;
// B xxxx1x, encryption and decryption related errors; xxxx0x parameter problem.
// C 0, no Error
const errorMap = {
  0: 'success',
  // 1xxxx The error code is the error received by the catch
  100001: '',
  200001: 'Payload is false.',
  200002: 'Please set permission at first.',
  200003: 'Please set permission at first.',
  200004: 'No Wallet Info.',
  200005: 'Portkey is locked!',
  200006: 'Decrypt Failed. Please unlock your wallet.',
  200007: 'No Portkey in storage.',
  200008: 'Please connect first.',
  200009: 'No permission, can not set whitelist.',
  200010: 'You closed the prompt without any action.',
  200011: 'Decrypt failed, get Portkey failed!',
  200012: 'Wallet error or damaged',
  200013: 'Decrypt keystore failed',
  200014: 'Can not find this wallet.',
  200015: 'PortKet connection failed, please check if your network is secure',
  200016: 'The user is not connected to Portkey, please connect the user first',
  200017: "Please make sure your network is consistent with Portkey's current network",
  200018: 'Chrome extension serviceWorker is invalid',
  // 3xxxxx Temporarily only used for internal redirects
  300000: 'Unlocked your wallet, recall your function please.',
  // [40000, 41000) is a dynamic error
  // 400001 are dynamic errors
  // [41001, 42000) is fixed bug
  400001: '',
  410001: 'Forbidden',
  410002: 'Missing param account.',
  410003: 'Missing param contractAddress.',
  410004: 'Missing param sendResponse(function).',
  410005: 'Expected a single, non-array, object argument.',
  410006: `'args.method' must be a non-empty string.`,
  410007: `'args.params' must be an object or array if provided.`,
  // 5xxxxxx is generally related to the interface request, and the plug-in actively throws it out
  // Currently only 500001, serviceWorker.ts reports an error
  // 500002 NotificationService.js failed
  500001: '',
  500002: '',
  // 6xxxxx is Failed to establish connection registration
  600001: 'Invalid connection',
  600002: 'Chrome Extension update, please refresh the page',
  // 7xxxxx transaction failed
  700001: '',
  700002: 'The contract call failed, please check the contract address and contract name',
};

export interface PortKeyResultType {
  error: keyof typeof errorMap;
  name?: string;
  message?: string;
  Error?: any;
  stack?: any;
  data?: any;
}

export default function errorHandler(code: keyof typeof errorMap, error?: any | string): PortKeyResultType {
  const errorMessage = errorMap[code];
  let output: PortKeyResultType = {
    error: code,
    message: '',
  };
  if (code === 0) {
    // success
  } else if (error && typeof error !== 'string') {
    console.log(error, 'errorHandler');
    output = {
      ...output,
      name: error.name,
      message: error.message || error.Error?.Message || error.Error,
      stack: error.stack,
      data: error?.data,
    };
  } else if (typeof error === 'string') {
    output = {
      ...output,
      name: 'customError',
      message: error,
    };
  } else {
    output = {
      ...output,
      name: 'errorMap',
      message: errorMessage,
    };
  }
  return output;
}
