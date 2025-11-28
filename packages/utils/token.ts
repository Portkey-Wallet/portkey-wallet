import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import BigNumber from 'bignumber.js';

export const filterTokenList = (tokenList: TokenItemShowType[], keyword: string): TokenItemShowType[] => {
  return tokenList.filter((ele): void | boolean => {
    if (ele.chainId === 'AELF') {
      return ele.symbol.toLowerCase().includes(keyword.trim().toLowerCase());
    } else {
      ele.address.toLowerCase().includes(keyword.trim().toLowerCase()) ||
        ele.symbol.toLowerCase().includes(keyword.trim().toLowerCase());
    }
  });
};

export const isSameTypeToken = (tokenItem1: TokenItemShowType, tokenItem2: TokenItemShowType): boolean => {
  return tokenItem1.symbol === tokenItem2.symbol && tokenItem1.address === tokenItem2.address;
};

export const isNFT = (symbol: string) => {
  if (!symbol) return false;
  if (!symbol.includes('-')) return false;
  const lastStr = symbol.split('-').splice(-1)[0];
  return !BigNumber(lastStr).isNaN();
};

export const isNFTCollection = (symbol: string) => {
  if (!isNFT(symbol)) return false;
  const lastStr = symbol.split('-').splice(-1)[0];
  return BigNumber(lastStr).isZero();
};

export const getApproveSymbol = (symbol: string) => {
  if (!isNFT(symbol) || isNFTCollection(symbol)) return symbol;

  const collectionName = symbol.split('-')[0];
  return `${collectionName}-*`;
};

export const formatApproveSymbolShow = (symbol: string) => {
  if (!symbol.includes('-')) return symbol;

  const firstStr = symbol.split('-')[0];
  const lastStr = symbol.split('-').splice(-1)[0];
  if (lastStr === '*') return firstStr;

  return symbol;
};
