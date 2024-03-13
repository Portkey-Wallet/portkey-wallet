import { TokenItemShowType } from 'packages/types/types-eoa/token';

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
