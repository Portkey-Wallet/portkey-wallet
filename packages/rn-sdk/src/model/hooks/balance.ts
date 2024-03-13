import { NFTCollectionItemShowType } from 'packages/types/types-ca/assets';
import useEffectOnce from 'hooks/useEffectOnce';
import { getUnlockedWallet } from 'model/wallet';
import { NetworkController } from 'network/controller';
import {
  FetchAccountNftCollectionItemListResult,
  ITokenItemResponse,
  IUserTokenItem,
  SearchTokenListParams,
} from 'network/dto/query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckTransactionFeeResult } from 'network/dto/transaction';

// @deprecated - use useAccountTokenBalanceList instead
export const useTokenPrices = (tokenList: string[] = []) => {
  const [tokenPrices, setTokenPrices] = useState<Array<{ symbol: string; priceInUsd: number }>>([]);
  const updateTokenPrices = useCallback(async () => {
    if (tokenList.length === 0) return;
    const result = await NetworkController.fetchTokenPrices(tokenList);
    result && setTokenPrices(result.items);
  }, [tokenList]);
  useEffect(() => {
    updateTokenPrices();
  }, [updateTokenPrices]);
  return {
    tokenPrices,
    updateTokenPrices,
  };
};

export const useAccountTokenBalanceList = () => {
  const [balanceList, setBalanceList] = useState<Array<ITokenItemResponse>>([]);
  useEffectOnce(async () => {
    await updateBalanceList();
  });
  const updateBalanceList = async () => {
    const { multiCaAddresses } = await getUnlockedWallet({ getMultiCaAddresses: true });
    const result = await NetworkController.fetchUserTokenBalance({
      maxResultCount: 100,
      skipCount: 0,
      caAddressInfos: Object.entries(multiCaAddresses).map(([chainId, caAddress]) => ({
        chainId,
        caAddress,
      })),
    });
    result && setBalanceList(result.data);
  };
  return {
    balanceList,
    updateBalanceList,
  };
};

export const useNftCollections = () => {
  const [nftCollections, setNftCollections] = useState<Array<NFTCollectionItemShowType>>([]);
  useEffectOnce(async () => {
    await updateNftCollections();
  });
  const updateNftCollections = async (config?: { symbol?: string; skipCount?: number; maxResultCount?: number }) => {
    const { symbol, skipCount = 0, maxResultCount = 100 } = config || {};
    const { multiCaAddresses } = await getUnlockedWallet({ getMultiCaAddresses: true });

    const caAddressInfos = Object.entries(multiCaAddresses).map(([chainId, caAddress]) => ({
      chainId,
      caAddress,
    }));
    const { data } = await NetworkController.fetchNetCollections({
      maxResultCount,
      skipCount,
      caAddressInfos,
    });
    let item: FetchAccountNftCollectionItemListResult;
    if (symbol) {
      item = await NetworkController.fetchParticularNftItemList({
        maxResultCount,
        skipCount,
        caAddressInfos,
        symbol,
      });
    }
    setNftCollections(
      data.map(it => {
        return Object.assign({}, JSON.parse(JSON.stringify(it)), {
          children:
            symbol === it.symbol ? (item.data.filter(one => one.chainId === it?.chainId) as unknown as any) : [],
        } as Partial<NFTCollectionItemShowType>);
      }),
    );
  };
  return {
    nftCollections,
    updateNftCollections,
  };
};

export const useSearchTokenList = () => {
  const [tokenList, setTokenList] = useState<IUserTokenItem[]>([]);
  useEffectOnce(async () => {
    await updateTokensList();
  });
  const lastConfig = useRef<SearchTokenListParams>({});
  const updateTokensList = useCallback(async (config?: SearchTokenListParams) => {
    if (config && JSON.stringify(config) === JSON.stringify(lastConfig.current)) return;
    const result = await NetworkController.searchTokenList(config);
    result && setTokenList(result.items);
  }, []);
  return {
    tokenList,
    updateTokensList,
  };
};

export const useGetTxFee = (targetChainId?: string) => {
  const [txFee, setTxFee] = useState<CheckTransactionFeeResult>();
  useEffectOnce(async () => {
    await updateTxFee();
  });
  const updateTxFee = async () => {
    const {
      caInfo: { caHash },
      originChainId,
    } = await getUnlockedWallet();
    const chainId = targetChainId || originChainId;
    if (!caHash) return;
    const result = await NetworkController.getTransactionFee({
      chainIds: [chainId],
    });
    result && setTxFee(result);
  };
  return {
    txFee,
    updateTxFee,
  };
};
