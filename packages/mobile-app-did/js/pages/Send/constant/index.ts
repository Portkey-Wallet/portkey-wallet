export enum WarningKey {
  INVALID_ADDRESS = 'invalid_address',
  STRANGE_ADDRESS = 'strange_address',
  CROSS_CHAIN = 'cross_chain',
  DAPP_CHAIN_TO_NO_AFFIX_ADDRESS = 'dapp_chain_to_no_affix_address',
  MAIN_CHAIN_TO_NO_AFFIX_ADDRESS = 'main_chain_to_no_affix_address',
  SAME_ADDRESS = 'same_address',
}

export const WarningTips = {
  [WarningKey.INVALID_ADDRESS]: `You can't send assets to this address because it's not a valid address, or is not supported at the moment.`,
  [WarningKey.STRANGE_ADDRESS]: `You have not used this address recently. Ensure it is the correct address before proceeding.`,
  [WarningKey.CROSS_CHAIN]: `This is a cross-chain transfer. Sending will incur transfer fees.`,
  [WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS]: `The address you've entered appears to be for an exchange. Please confirm before proceeding. Sending tokens to the wrong address may result in the loss of your assets.`,
  [WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS]: `The address entered seems to be for an exchange. Please confirm if it's one of the supported ones before continuing to avoid losing your asset.`,
  [WarningKey.SAME_ADDRESS]: ` You can't send to this address because it's the same as the sending address.`,
};

export const warning1Arr: WarningKey[] = [WarningKey.INVALID_ADDRESS, WarningKey.SAME_ADDRESS];
export const warning2Arr: WarningKey[] = [
  WarningKey.STRANGE_ADDRESS,
  WarningKey.CROSS_CHAIN,
  WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS,
  WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS,
];
