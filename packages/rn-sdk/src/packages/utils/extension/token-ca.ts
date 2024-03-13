import { TokenItemShowType, UserTokenItemType } from 'packages/types/types-ca/token';

export const filterTokenList = (tokenList: UserTokenItemType[], keyword: string): UserTokenItemType[] => {
  return tokenList.filter(ele => {
    if (ele.token.chainId === 'AELF') {
      return ele.token.symbol.toLowerCase().includes(keyword.trim().toLowerCase());
    } else {
      return (
        ele.token.address.toLowerCase().includes(keyword.trim().toLowerCase()) ||
        ele.token.symbol.toLowerCase().includes(keyword.trim().toLowerCase())
      );
    }
  });
};

export const isSameTypeToken = (tokenItem1: TokenItemShowType, tokenItem2: TokenItemShowType): boolean => {
  return tokenItem1.symbol === tokenItem2.symbol && tokenItem1.address === tokenItem2.address;
};
