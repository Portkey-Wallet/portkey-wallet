export const CROSS_FEE = '0.35';
export const DEFAULT_FEE = '0.39';

export const CreateAddressLoading = 'Creating a wallet address on the blockchain...';

export const CheckAccountLoading = 'Checking account info on the blockchain...';

export const AssignVerifierLoading = 'Assigning a verifier on the blockchain...';

export const InitLoginLoading = 'Initiating social recovery';

export const DEFAULT_TOKEN = {
  address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  decimals: '8',
  imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf_token_logo.png',
  name: 'AELF',
  symbol: 'ELF',
};

export const InitialTxFee = {
  ach: 0.0041,
  crossChain: 0.0041,
  max: 0.0041,
  redPackage: 0.009,
};

export const VERIFY_INVALID_TIME = 2 * 1000;

export const FAUCET_URL = 'https://testnet-faucet.aelf.io/';
export const MAX_TRANSACTION_FEE = '0.1';
export const PORTKEY_PROJECT_CODE = '10000';

export const ACCOUNT_CANCELATION_TIP = `Account cancellation is a highly risky operation, and once canceled, it cannot be retrieved permanently. Please carefully confirm this again.`;

export const ACCOUNT_CANCELATION_NOTE = `Please note that the cancellation of the account requires the following conditions.`;

export const ACCOUNT_CANCELATION_CONDITIONS = [
  {
    title: `Asset`,
    content: `Please transfer all of your assets out of your account, including Tokens and NFTs.`,
  },
  {
    title: `Guardians`,
    content: `Please ensure that other users have already disassociated the Guardian from your current Apple ID.`,
  },
  {
    title: `Login Devices`,
    content: `Please remove other login devices.`,
  },
];

export const ACCOUNT_CANCELATION_ALERT_MAP = {
  Asset: `There are still remaining assets in your account. Please transfer all assets out of your account.`,
  Guardian: `Your LOGIN_ACCOUNT has been used by other users to bind Guardian. Please release these binding relationships.`,
  'Login Device': `Your account has been logged in on another device. Please remove the other device.`,
};

export const ACCOUNT_CANCELATION_WARNING = `Please note that once you cancel your account, it cannot be recovered. Are you still want to proceed with the account cancellation?`;
