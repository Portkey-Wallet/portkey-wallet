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

export const ACCOUNT_CANCELATION_TIP = `Deleting your account is a permanent action. Once deleted, your account cannot be recovered. Please consider this carefully before proceeding.`;
export const ACCOUNT_CANCELATION_NOTE = `To continue with deletion, ensure the following conditions are met:`;
export const ACCOUNT_CANCELATION_CONDITIONS = [
  {
    title: `Assets`,
    content: `Transfer all assets, including Tokens and NFTs, out of your account.`,
  },
  {
    title: `Guardians`,
    content: `Other users must have disassociated the Guardian from your current email.`,
  },
  {
    title: `Login Device`,
    content: `Ensure your account is only logged in on this device.`,
  },
];
export const ACCOUNT_CANCELATION_ALERT_MAP = {
  Asset: `You still have assets in your account. Please transfer them out to continue.`,
  Guardian: `Your LOGIN_ACCOUNT is set as a guardian by other accounts. To proceed, please first remove your LOGIN_ACCOUNT's linked guardian.`,
  LoginDevice: `Your account is logged in on other devices. Please log out of those devices or remove them to proceed.`,
};
export const ACCOUNT_CANCELATION_WARNING = `Are you sure you want to delete your account? This action is irreversible.`;
