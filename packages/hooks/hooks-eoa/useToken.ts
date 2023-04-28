import { useAppEOASelector, useAppCommonDispatch } from '../index';
import { addTokenInCurrentAccount, deleteTokenInCurrentAccount } from '@portkey-wallet/store/token/action';
import { fetchTokenListAsync } from '@portkey-wallet/store/token/slice';
import {
  TokenItemType,
  TokenState,
  AddedTokenData,
  TokenListShowInMarketType,
} from '@portkey-wallet/types/types-eoa/token';
import { useMemo } from 'react';

export interface TokenFuncsType {
  addToken: (tokenItem: TokenItemType) => void;
  deleteToken: (tokenItem: TokenItemType) => void;
  fetchTokenList: (params: { pageSize: number; pageNo: number }) => void;
}

export const useToken = (): [TokenState, TokenFuncsType] => {
  const dispatch = useAppCommonDispatch();
  const { currentChain } = useAppEOASelector(state => state.chain);
  const { currentAccount } = useAppEOASelector(state => state.wallet);

  const tokenState = useAppEOASelector(state => state.token);

  const addToken = (tokenItem: TokenItemType) => {
    if (!currentAccount) return;
    dispatch(addTokenInCurrentAccount({ tokenItem, currentChain, currentAccount }));
  };

  const deleteToken = (tokenItem: TokenItemType) => {
    if (!currentAccount) return;
    dispatch(deleteTokenInCurrentAccount({ tokenItem, currentChain, currentAccount }));
  };

  const fetchTokenList = (params: { pageSize: number; pageNo: number }) => {
    dispatch(fetchTokenListAsync({ ...params, currentChain, currentAccount }));
  };

  const tokenStoreFuncs = {
    addToken,
    deleteToken,
    fetchTokenList,
  };

  return [tokenState, tokenStoreFuncs];
};

export const useCurrentAccountTokenList = (): TokenItemType[] => {
  const dispatch = useAppCommonDispatch();
  const { currentChain } = useAppEOASelector(state => state.chain);
  const { currentAccount } = useAppEOASelector(state => state.wallet);
  const { addedTokenData, isFetchingTokenList } = useAppEOASelector(state => state.token);

  return useMemo(() => {
    if (
      currentChain?.rpcUrl in addedTokenData &&
      currentAccount &&
      currentAccount?.address in addedTokenData[currentChain?.rpcUrl]
    ) {
      return addedTokenData[currentChain?.rpcUrl][currentAccount?.address];
    }

    if (!isFetchingTokenList) {
      // fetch default list
      dispatch(fetchTokenListAsync({ pageNo: 1, pageSize: 10000, currentChain, currentAccount }));
    }

    return [];
  }, [addedTokenData, currentChain, currentAccount]);
};

export const useAllAccountTokenList = (): AddedTokenData => {
  const { addedTokenData } = useAppEOASelector(state => state.token);

  return useMemo(() => addedTokenData, [addedTokenData]);
};

export const useMarketTokenListInCurrentChain = (): TokenListShowInMarketType => {
  const { tokenDataShowInMarket } = useAppEOASelector(state => state.token);

  return useMemo(() => tokenDataShowInMarket, [tokenDataShowInMarket]);
};

export const useIsFetchingTokenList = (): Boolean => {
  const { isFetchingTokenList } = useAppEOASelector(state => state.token);

  return useMemo(() => isFetchingTokenList, [isFetchingTokenList]);
};

export default useToken;
