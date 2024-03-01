export enum AddressError {
  SAME_ADDRESS = 'The sender and recipient address are identical',
  INVALID_ADDRESS = 'Recipient address is invalid',
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

export const SideChainTipTitle = `Receive from exchange account?`;
export const SideChainTipContent = `Please note that your SideChain address may not be able to receive assets directly from exchanges. You can send your assets in exchanges to your MainChain address before transferring them to the SideChain.`;

export const MainChainTipTitle = `Receive from exchange account?`;
export const MainChainTipContent = `Please note that your Portkey account can only receive assets from certain exchanges, like Binance, Upbit, OKX, and gate.io, and you need to ensure that "AELF" is selected as the withdrawal network.`;
