export interface Transaction {
  chainId: string;
  token: {
    symbol: string;
    address: string;
  };
  method: string;
  from: string;
  to: string;
  transactionId: string;
  amount: string;
  timestamp: string;
  priceInUsd: string;
}
