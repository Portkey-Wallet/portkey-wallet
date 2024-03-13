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
