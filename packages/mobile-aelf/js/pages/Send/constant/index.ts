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
export const warning1Arr: WarningKey[] = [WarningKey.INVALID_ADDRESS, WarningKey.SAME_ADDRESS];

// warning style
export const warning2Arr: WarningKey[] = [
  WarningKey.STRANGE_ADDRESS,
  WarningKey.CROSS_CHAIN,
  WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF,
  WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF,
];
// info style
export const warning3Arr: WarningKey[] = [WarningKey.MAKE_SURE_SUPPORT_PLATFORM];

export const TransferErrorMessage = {
  BALANCE_NOT_ENOUGH: 'Exceeds available balance',
  FEE_NOT_ENOUGH: 'Not enough ELF balance for transaction fee',
};

export const HELP_URL = 'https://doc.portkey.finance/docs/How-to-trade-assets';
