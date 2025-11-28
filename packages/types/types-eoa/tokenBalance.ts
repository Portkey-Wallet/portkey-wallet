export type RpcUrl = string;
export type Account = string;
export type Symbol = string;
export type AccountBalances = Record<Symbol, string>;
export type CurrentChainBalances = Record<Account, AccountBalances>;

export interface tokenBalanceState {
  balances?: Record<RpcUrl, CurrentChainBalances>;
}
