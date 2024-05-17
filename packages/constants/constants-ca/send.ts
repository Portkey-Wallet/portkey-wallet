export enum AddressError {
  SAME_ADDRESS = 'The sender and recipient address are identical',
  INVALID_ADDRESS = 'Recipient address is invalid',
  OTHER_CHAIN_ADDRESS = "It's not aelf address. If you want to withdraw assets to other chains, you can use $ETransfer.$",
}

export enum TransactionError {
  TOKEN_NOT_ENOUGH = 'Insufficient funds',
  NFT_NOT_ENOUGH = 'Insufficient quantity',
  FEE_NOT_ENOUGH = 'Insufficient funds for transaction fee',
  CROSS_NOT_ENOUGH = 'Insufficient funds for cross chain transaction fee',
  SYNCHRONIZING = 'Synchronizing on-chain account information...',
}

export const AddressErrorArray = Object.values(AddressError);
export const TransactionErrorArray = Object.values(TransactionError);

export const SEND_SIDE_CHAIN_TOKEN_TIP_TITLE = `Send to exchange account?`;
export const SEND_SIDE_CHAIN_TOKEN_TIP_CONTENT = [
  `Please note that assets on the SideChain can't be sent directly to exchanges. You can transfer your SideChain assets to the MainChain before sending them to your exchange account.`,
];

export const RECEIVE_MAIN_CHAIN_TOKEN_TIP_TITLE = `Receive from exchange account?`;
export const RECEIVE_MAIN_CHAIN_TOKEN_TIP_CONTENT = [
  `Please note that your Portkey account can only receive assets from certain exchanges, like Binance, Upbit, OKX, and gate.io, and you need to ensure that "AELF" is selected as the withdrawal network.`,
];

export const RECEIVE_SIDE_CHAIN_TOKEN_TIP_TITLE = `Receive from exchange account?`;
export const RECEIVE_SIDE_CHAIN_TOKEN_TIP_CONTENT = [
  `If you wish to receive assets from exchanges, please note that they will not be credited to your SideChain address, and you cannot make the transfer through QR code scanning.`,
  `To receive, please follow these steps:`,
  ` · Copy your wallet address.`,
  ` · Remove the "ELF_" prefix and "CHAIN_SUFFIX" suffix.`,
  ` · Use only the middle part of the address.`,
  `Upon completing the transaction, the assets will be sent to your MainChain address.`,
];
export const RECEIVE_SIDE_CHAIN_TOKEN_TIP_MODAL_REMEMBER_TEXT = `Don't show this again`;
export const RECEIVE_SIDE_CHAIN_TOKEN_TIP_MODAL_BUTTON_TEXT = `I Know`;
