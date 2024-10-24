import { useCallback, useEffect, useState, useMemo } from 'react';
import { TReceiveTokenMap, TReceiveFromNetworkItem } from '@portkey-wallet/types/types-ca/receive';
import { ChainId } from '@portkey-wallet/types';
import { request } from '@portkey-wallet/api/api-did';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';

export const useReceive = (token: TokenItemShowType, initToChainId?: ChainId) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [destinationChain, setDestinationChain] = useState<IChainItemType | undefined>();
  const [destinationMap, setDestinationMap] = useState<TReceiveTokenMap | undefined>();
  const [sourceChain, setSourceChain] = useState<TReceiveFromNetworkItem | undefined>();
  const currentChainList = useCurrentChainList();

  const getChainInfoByChainId = useCallback(
    (chaidId: ChainId) => {
      if (!currentChainList) return undefined;
      return currentChainList.find(chain => chain.chainId === chaidId);
    },
    [currentChainList],
  );

  const destinationChainList = useMemo(() => {
    if (!destinationMap) return [];
    return Object.keys(destinationMap).map(chainId => getChainInfoByChainId(chainId as ChainId));
  }, [destinationMap, getChainInfoByChainId]);

  const sourceChainList = useMemo(() => {
    if (!destinationMap) return [];
    if (!destinationChain) return [];
    return destinationMap[destinationChain.chainId];
  }, [destinationChain, destinationMap]);

  // request date and set loading status
  useEffect(() => {
    setErrorMsg('');
    setLoading(true);
    request.receive
      .fetchReceiveNetworkList({
        params: {
          symbol: token.symbol,
        },
      })
      .then(data => {
        if (data && data.data && data.data.destinationMap) {
          setDestinationMap(data.data.destinationMap);
        } else {
          setErrorMsg(data.error ?? 'Response data error');
        }
        setLoading(false);
      })
      .catch(e => {
        setErrorMsg(e.message);
        setLoading(false);
      });
  }, [token.symbol]);

  useEffect(() => {
    if (!destinationMap) return;
    let toChainId = initToChainId;
    if (!toChainId) toChainId = Object.keys(destinationMap)[0] as ChainId;
    setDestinationChain(getChainInfoByChainId(toChainId));
    destinationMap[toChainId]?.length && setSourceChain(destinationMap[toChainId][0]); // set first network as source chain
  }, [destinationMap, getChainInfoByChainId, initToChainId]);

  return {
    loading,
    errorMsg,
    destinationChain,
    destinationChainList,
    sourceChain,
    sourceChainList,
    destinationMap,
  };
};
