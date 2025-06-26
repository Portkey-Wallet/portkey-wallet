export enum AddressError {
  SAME_ADDRESS = 'The sender and recipient address are identical',
  INVALID_ADDRESS = 'Recipient address is invalid',
  OTHER_CHAIN_ADDRESS = 'The To address is not on the aelf network. If you intend to send assets cross-chain, please try using $ETransfer$.',
}

export enum TransactionError {
  TOKEN_NOT_ENOUGH = 'Exceeds available balance',
  NFT_NOT_ENOUGH = 'Insufficient quantity',
  FEE_NOT_ENOUGH = 'Insufficient funds for transaction fee',
  CROSS_NOT_ENOUGH = 'Insufficient funds for cross chain transaction fee',
  SYNCHRONIZING = 'Synchronizing on-chain account information...',
  TRANSFER_AMOUNT_EXCEEDED = 'Transfer amount exceeded',
}

export const AddressErrorArray = Object.values(AddressError);
export const TransactionErrorArray = Object.values(TransactionError);

export const SEND_SIDE_CHAIN_TOKEN_TIP_TITLE = `Send to exchange account?`;
export const SEND_SIDE_CHAIN_TOKEN_TIP_CONTENT = [
  `Please note that assets on the dAppChain can't be sent directly to exchanges. You can transfer your dAppChain assets to the MainChain before sending them to your exchange account.`,
];

export const RECEIVE_MAIN_CHAIN_TOKEN_TIP_TITLE = `Receive from exchange account?`;
export const RECEIVE_MAIN_CHAIN_TOKEN_TIP_CONTENT = [
  `Please note that your Portkey account can only receive assets from certain exchanges, like Binance, Upbit, OKX, and gate.io, and you need to ensure that "AELF" is selected as the withdrawal network.`,
];

export const RECEIVE_SIDE_CHAIN_TOKEN_TIP_TITLE = `Receive from exchange account?`;
export const RECEIVE_SIDE_CHAIN_TOKEN_TIP_CONTENT = [
  `If you wish to receive assets from exchanges, please note that they will not be credited to your dAppChain address, and you cannot make the transfer through QR code scanning.`,
  `To receive, please follow these steps:`,
  ` · Copy your wallet address.`,
  ` · Remove the "ELF_" prefix and "CHAIN_SUFFIX" suffix.`,
  ` · Use only the middle part of the address.`,
  `Upon completing the transaction, the assets will be sent to your MainChain address.`,
];
export const RECEIVE_SIDE_CHAIN_TOKEN_TIP_MODAL_REMEMBER_TEXT = `Don't show this again`;
export const RECEIVE_SIDE_CHAIN_TOKEN_TIP_MODAL_BUTTON_TEXT = `I Know`;

export const RECEIVE_MAIN_CHAIN_ELF_TIP = `If you wish to receive assets from exchanges, please switch to the "Exchanges" tab on the right.`;
export const CROSS_CHAIN_INTERCEPTED_CONTENT = `The asset does not exist on the target chain, so the transfer cannot be completed.`;
export enum ReceiveTabEnum {
  QRCode = 'QRCode',
  Exchanges = 'Exchanges',
  Buy = 'Buy',
  Deposit = 'Deposit',
}

export const ALL_RECEIVE_TAB: {
  value: ReceiveTabEnum;
  label: string;
}[] = [
  {
    value: ReceiveTabEnum.QRCode,
    label: 'QR Code',
  },
  {
    value: ReceiveTabEnum.Exchanges,
    label: 'Exchanges',
  },
  {
    value: ReceiveTabEnum.Buy,
    label: 'Buy',
  },
  {
    value: ReceiveTabEnum.Deposit,
    label: 'Deposit',
  },
];

export enum WarningKey {
  INVALID_ADDRESS = 'invalid_address',
  STRANGE_ADDRESS = 'strange_address',
  CROSS_CHAIN = 'cross_chain',
  DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF = 'dapp_chain_to_no_affix_address_elf',
  MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF = 'main_chain_to_no_affix_address_elf',
  SAME_ADDRESS = 'same_address',
  MAKE_SURE_SUPPORT_PLATFORM = 'make_sure_support_platform',
}

export const WarningTips = {
  [WarningKey.INVALID_ADDRESS]:
    "You can't send assets to this address because it's not a valid address, or is not supported at the moment.",
  [WarningKey.STRANGE_ADDRESS]:
    'You have not used this address recently. Ensure it is the correct address before proceeding.',
  [WarningKey.CROSS_CHAIN]: 'This is a cross-chain transfer. Sending will incur transfer fees.',
  [WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]:
    "The address you've entered appears to be for an exchange. Please confirm before proceeding. Sending tokens to the wrong address may result in the loss of your assets.",
  [WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]:
    "The address entered seems to be for an exchange. Please confirm if it's one of the supported ones before continuing to avoid losing your asset.",
  [WarningKey.SAME_ADDRESS]: "You can't send to this address because it's the same as the sending address.",
  [WarningKey.MAKE_SURE_SUPPORT_PLATFORM]: 'Make sure that your receiving platform supports the token and network.',
};

// error style
export const Warning1Arr: WarningKey[] = [WarningKey.INVALID_ADDRESS, WarningKey.SAME_ADDRESS];

// warning style
export const Warning2Arr: WarningKey[] = [
  WarningKey.STRANGE_ADDRESS,
  WarningKey.CROSS_CHAIN,
  WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF,
  WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF,
];
// info style
export const Warning3Arr: WarningKey[] = [WarningKey.MAKE_SURE_SUPPORT_PLATFORM];

export const TransferErrorMessage = {
  BALANCE_NOT_ENOUGH: 'Exceeds available balance',
  FEE_NOT_ENOUGH: 'Not enough ELF balance for transaction fee',
};

export const HELP_URL = 'https://doc.portkey.finance/docs/How-to-trade-assets';
export const SEND_HELP_URL = 'https://doc.portkey.finance/docs/How-to-send-assets';
