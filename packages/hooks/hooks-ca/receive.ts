import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  TReceiveTokenMap,
  TReceiveFromNetworkItem,
  ReceiveType,
  ReceiveFromNetworkServiceType,
} from '@portkey-wallet/types/types-ca/receive';
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
    (chainId: ChainId) => {
      if (!currentChainList) return undefined;
      return currentChainList.find(chain => chain.chainId === chainId);
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

  const isAelfChain = useCallback((chainName?: string) => {
    if (!chainName) return false;
    const chainIdList: ChainId[] = ['AELF', 'tDVV', 'tDVW'];
    return chainIdList.find(item => {
      return item === chainName;
    });
  }, []);

  const receiveType = useMemo(() => {
    if (isAelfChain(sourceChain?.network)) {
      return ReceiveType.Portkey;
    } else if (sourceChain?.serviceList && sourceChain?.serviceList.length > 0) {
      const serviceName = sourceChain?.serviceList[0].serviceName;
      if (serviceName == ReceiveFromNetworkServiceType.ETransfer) {
        return ReceiveType.ETransfer;
      } else if (serviceName == ReceiveFromNetworkServiceType.EBridge) {
        return ReceiveType.EBridge;
      }
    }
    return ReceiveType.Portkey;
  }, [isAelfChain, sourceChain?.network, sourceChain?.serviceList]);

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
        console.log('destinationMap : ', JSON.stringify(data.data));
        if (data && data.data && data.data.destinationMap) {
          setDestinationMap(data.data.destinationMap);
        } else {
          setErrorMsg(data.error ?? 'Response data error');
        }
        setLoading(false);
      })
      .catch(e => {
        console.log('destinationMap error: ', e);
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

  const updateDestinationChain = useCallback(
    (targetChain?: IChainItemType) => {
      if (!targetChain) return;
      if (!destinationMap) return;
      if (targetChain.chainId === destinationChain?.chainId) return;
      setDestinationChain(targetChain);
      if (destinationMap[targetChain.chainId]?.length) {
        const isSourceChainExistInNewDestination = destinationMap[targetChain.chainId].find(item => {
          return item.network === sourceChain?.network;
        });
        !isSourceChainExistInNewDestination && setSourceChain(destinationMap[targetChain.chainId][0]);
      }
    },
    [destinationChain?.chainId, destinationMap, sourceChain?.network],
  );

  return {
    loading,
    errorMsg,
    destinationChain,
    updateDestinationChain,
    destinationChainList,
    sourceChain,
    setSourceChain,
    sourceChainList,
    destinationMap,
    receiveType,
  };
};
