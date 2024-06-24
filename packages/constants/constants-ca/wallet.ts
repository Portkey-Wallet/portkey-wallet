export const CROSS_FEE = '0.35';
export const DEFAULT_FEE = '0.39';

export const CreateAddressLoading = 'Creating a wallet address on the blockchain...';
export const CheckAccountLoading = 'Checking account info on the blockchain...';
export const AssignVerifierLoading = 'Assigning a verifier on the blockchain...';

export const InitLoginLoading = 'Initiating social recovery';

export const DEFAULT_TOKEN = {
  address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  decimals: '8',
  imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
  name: 'AELF',
  symbol: 'ELF',
};

export const InitialTxFee = {
  ach: 0.0041,
  crossChain: 0.0041,

  etransfer: 0.01,
  max: 0.0041,
  redPackage: 0.009,
};

export const VERIFY_INVALID_TIME = 2 * 1000;

export const FAUCET_URL = 'https://testnet-faucet.aelf.io/';
export const MAX_TRANSACTION_FEE = '0.1';
export const PORTKEY_PROJECT_CODE = '10000';

export const ACCOUNT_CANCELATION_TIP = `Account deletion is an irreversible operation. Once deleted, your account cannot be recovered. Please carefully consider this before continuing.`;
export const ACCOUNT_CANCELATION_NOTE = `Please note that your account can only be deleted if it meets the following conditions:`;
export const ACCOUNT_CANCELATION_CONDITIONS = [
  {
    title: `Asset`,
    content: `Please transfer all of your assets out of your account, including Tokens and NFTs.`,
  },
  {
    title: `Guardian`,
    content: `Please ensure that other users have already disassociated the Guardian from your current LOGIN_ACCOUNT.`,
  },
  {
    title: `Login Device`,
    content: `Your account is only logged in on this device.`,
  },
];
export const ACCOUNT_CANCELATION_ALERT_MAP = {
  Asset: `There are remaining assets in your account. To proceed, please first transfer all assets out of your account.`,
  Guardian: `Your LOGIN_ACCOUNT is set as a guardian by other accounts. To proceed, please first remove your LOGIN_ACCOUNT's linked guardian.`,
  LoginDevice: `Your account is logged in on other devices. To proceed, please first log out there or remove the login device.`,
};
export const ACCOUNT_CANCELATION_WARNING = `Are you sure you want to delete your account? Please note that you won't be able to recover your account once it's deleted.`;
