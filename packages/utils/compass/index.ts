export interface FunctionalType {
  send: boolean;
  receive: boolean;
  buy: boolean;
  swap: boolean;
  deposit: boolean;
  withdraw: boolean;
  exchange: boolean;
}

export const checkEnabledFunctionalTypes = (symbol: string, isOnMainChain: boolean): FunctionalType => {
  const USDTSymbol = 'USDT';
  const ELFSymbol = 'ELF';
  const SGRSymbol = 'SGR-';
  return {
    send: true,
    receive: true,
    buy: (symbol === USDTSymbol || symbol === ELFSymbol) && isOnMainChain,
    swap: (symbol === USDTSymbol || symbol === ELFSymbol) && !isOnMainChain,
    deposit: symbol === USDTSymbol || symbol === ELFSymbol || (symbol.startsWith(SGRSymbol) && !isOnMainChain),
    withdraw: symbol === USDTSymbol || symbol.startsWith(SGRSymbol),
    exchange: symbol === ELFSymbol && isOnMainChain,
  };
};
