import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import AElf from 'aelf-sdk';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import {
  TDepositTokenItem,
  TQueryTransferAuthTokenRequest,
  TRecordsListItem,
} from '@portkey-wallet/types/types-ca/deposit';
import { TTokenItem, TNetworkItem } from '@portkey-wallet/types/types-ca/deposit';
import { ChainId } from '@portkey-wallet/types';
import depositService from '@portkey-wallet/utils/deposit';

const MAX_REFRESH_TIME = 15;

export const useDeposit = (initToToken: TTokenItem, initChainId: ChainId, manager?: AElfWallet) => {
  const { caHash, address, originChainId } = useCurrentWalletInfo();
  const { apiUrl } = useCurrentNetworkInfo();

  const [loading, setLoading] = useState<boolean>(true);

  const [allNetworkList, setAllNetworkList] = useState<TNetworkItem[]>([]);

  const [depoistTokenList, setDepositTokenList] = useState<TDepositTokenItem[]>([]);

  const [fromNetwork, setFromNetwork] = useState<TNetworkItem>();
  const [fromToken, setFromToken] = useState<TTokenItem>();

  const [toChainIdList, setToChainIdList] = useState<ChainId[]>([]);
  const [toChainId, setToChainId] = useState<ChainId>();
  const [toToken, setToToken] = useState<TTokenItem>();

  const [unitReceiveAmount, seteUnitReceiveAmount] = useState<number>(0);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [receiveAmount, setReceiveAmount] = useState<{ toAmount: number; minimumReceiveAmount: number }>({
    toAmount: 0,
    minimumReceiveAmount: 0,
  });

  const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);
  const [rateRefreshTime, setRateRefreshTime] = useState<number>(MAX_REFRESH_TIME);
  const refreshReceiveRef = useRef<() => void>();
  const refreshReceiveTimerRef = useRef<NodeJS.Timer>();

  const clearRefreshReceive = useCallback(() => {
    refreshReceiveTimerRef.current && clearInterval(refreshReceiveTimerRef.current);
    refreshReceiveTimerRef.current = undefined;
  }, []);

  const calculateAmount = useCallback(
    async (fromAmount: number) => {
      if (!toChainId || !fromToken?.symbol || !toToken?.symbol || !fromAmount) {
        throw new Error('Invalid params: toChainId, fromToken, toToken, fromAmount');
      }
      const result = await depositService.depositCalculator({
        toChainId: toChainId,
        fromSymbol: fromToken?.symbol,
        toSymbol: toToken?.symbol,
        fromAmount: fromAmount.toString(),
      });
      return result;
    },
    [fromToken?.symbol, toChainId, toToken?.symbol],
  );

  const fetchRate = useCallback(async () => {
    if (!toChainId || !fromToken?.symbol || !toToken?.symbol) {
      return;
    }
    const res = await calculateAmount(1);
    if (res.toAmount) {
      seteUnitReceiveAmount(Number(res.toAmount));
    }

    if (payAmount <= 0) {
      setReceiveAmount({ toAmount: 0, minimumReceiveAmount: 0 });
      return;
    }
    const receiveAmountRes = await calculateAmount(payAmount);
    setReceiveAmount({
      toAmount: receiveAmountRes.toAmount,
      minimumReceiveAmount: receiveAmountRes.minimumReceiveAmount,
    });
  }, [calculateAmount, fromToken?.symbol, payAmount, toChainId, toToken?.symbol]);

  useEffect(() => {
    return () => {
      clearRefreshReceive();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerRefreshReceive = useCallback(() => {
    clearRefreshReceive();

    rateRefreshTimeRef.current = MAX_REFRESH_TIME;
    setRateRefreshTime(MAX_REFRESH_TIME);

    const timer = setInterval(() => {
      rateRefreshTimeRef.current = --rateRefreshTimeRef.current;
      if (rateRefreshTimeRef.current === 0) {
        refreshReceiveRef.current?.();
        rateRefreshTimeRef.current = MAX_REFRESH_TIME;
        fetchRate();
      }
      setRateRefreshTime(rateRefreshTimeRef.current);
    }, 1000);

    refreshReceiveTimerRef.current = timer;
  }, [clearRefreshReceive, fetchRate]);

  const clearFromAndTo = useCallback(() => {
    setFromNetwork(undefined);
    setFromToken(undefined);
    setToChainId(undefined);
    setToToken(undefined);
  }, []);

  const fetchTransferToken = useCallback(async () => {
    if (!manager) return;
    const plainTextOrigin = `Nonce:${Date.now()}`;
    const plainTextHex = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    const plainTextHexSignature = Buffer.from(plainTextHex).toString('hex');

    const signature = AElf.wallet.sign(plainTextHexSignature, manager.keyPair).toString('hex');
    const pubkey = (manager.keyPair as any).getPublic('hex');

    const params: TQueryTransferAuthTokenRequest = {
      pubkey: pubkey,
      signature: signature,
      plain_text: plainTextHex,
      ca_hash: caHash ?? '',
      chain_id: originChainId ?? 'AELF',
      managerAddress: address,
    };
    const res = await depositService.getTransferToken(params, apiUrl);
    console.log('etransfer token : ', res);
  }, [manager, caHash, originChainId, address, apiUrl]);

  const fetchDepositTokenList = useCallback(async () => {
    const tokenList = await depositService.getDepositTokenList();
    if (!tokenList || tokenList.length <= 0) return;

    setDepositTokenList(tokenList);

    let findTargetToken = false;
    tokenList.forEach(token => {
      if (token.toTokenList) {
        if (findTargetToken) return;
        const targetToken = token.toTokenList.find(
          toTokenItem => toTokenItem.symbol === initToToken.symbol && toTokenItem.chainIdList?.includes(initChainId),
        );
        if (targetToken) {
          findTargetToken = true;
          clearFromAndTo();
          setFromToken(token);
          setToToken(targetToken);
          setToChainId(initChainId);
        }
      }
    });

    const toChainIdSet = new Set<ChainId>();
    tokenList.forEach(token => {
      if (token.toTokenList) {
        token.toTokenList.forEach(toTokenItem => {
          if (toTokenItem.chainIdList) {
            toTokenItem.chainIdList.forEach(chainId => {
              toChainIdSet.add(chainId);
            });
          }
        });
      }
    });
    setToChainIdList(Array.from(toChainIdSet));
  }, [clearFromAndTo, initChainId, initToToken.symbol]);

  const fetchAllNetworkList = useCallback(async () => {
    const networkList = await depositService.getNetworkList({ chainId: initChainId });
    setAllNetworkList(networkList);
  }, [initChainId]);

  const fetchDepositInfo = useCallback(async () => {
    if (!toChainId || !fromNetwork?.network || !fromToken?.symbol || !toToken?.symbol) {
      throw new Error('Invalid params: toChainId, fromNetwork, fromToken, toToken');
    }
    const params = {
      chainId: toChainId,
      network: fromNetwork?.network,
      symbol: fromToken?.symbol,
      toSymbol: toToken?.symbol,
    };
    const info = await depositService.getDepositInfo(params);
    return info;
  }, [fromNetwork?.network, fromToken?.symbol, toChainId, toToken?.symbol]);

  useEffect(() => {
    (async () => {
      try {
        if (!manager) {
          return;
        }
        setLoading(true);
        await fetchTransferToken();
        await fetchDepositTokenList();
        await fetchAllNetworkList();
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchAllNetworkList, fetchDepositTokenList, fetchTransferToken, manager]);

  const isSameSymbol = useMemo(() => {
    if (!fromToken || !toToken) return true;
    return fromToken && toToken && fromToken.symbol === toToken.symbol;
  }, [fromToken, toToken]);

  useEffect(() => {
    (async () => {
      if (!toChainId || !fromToken?.symbol || !toToken?.symbol) {
        return;
      }
      clearRefreshReceive();
      if (!isSameSymbol) {
        fetchRate();
        registerRefreshReceive();
      }
    })();
  }, [
    calculateAmount,
    clearRefreshReceive,
    fetchRate,
    fromToken?.symbol,
    isSameSymbol,
    registerRefreshReceive,
    toChainId,
    toToken?.symbol,
  ]);

  useEffect(() => {
    (async () => {
      if (!toChainId || !fromToken?.symbol || !toToken?.symbol) {
        return;
      }
      if (payAmount <= 0) {
        setReceiveAmount({ toAmount: 0, minimumReceiveAmount: 0 });
        return;
      }
      const res = await calculateAmount(payAmount);
      setReceiveAmount({
        toAmount: res.toAmount,
        minimumReceiveAmount: res.minimumReceiveAmount,
      });
    })();
  }, [calculateAmount, fromToken?.symbol, payAmount, toChainId, toToken?.symbol]);

  useEffect(() => {
    (async () => {
      if (toChainId && fromToken?.symbol) {
        const networkList = await depositService.getNetworkList({
          chainId: toChainId,
          symbol: fromToken?.symbol,
        });
        if (networkList && networkList.length > 0) {
          setFromNetwork(networkList[0]);
        }
      }
    })();
  }, [fromToken, toChainId]);

  const setFrom = useCallback(
    ({ newFromNetwork, newFromToken }: { newFromNetwork: TNetworkItem; newFromToken: TTokenItem }) => {
      if (newFromNetwork.network === fromNetwork?.network && newFromToken.symbol === fromToken?.symbol) {
        return;
      }
      if (newFromNetwork.network !== fromNetwork?.network && newFromToken.symbol === fromToken?.symbol) {
        setFromNetwork(newFromNetwork);
        return;
      }

      let toTokenValid = false;
      depoistTokenList.forEach(token => {
        if (token.toTokenList) {
          if (toTokenValid) return;
          if (token.symbol === newFromToken.symbol) {
            const targetToken = token.toTokenList.find(
              toTokenItem =>
                toTokenItem.symbol === toToken?.symbol && toTokenItem.chainIdList?.includes(toChainId ?? 'AELF'),
            );
            if (targetToken) {
              toTokenValid = true;
            }
          }
        }
      });

      if (toTokenValid) {
        setFromNetwork(undefined);
        setFromToken(undefined);
        setFromNetwork(newFromNetwork);
        setFromToken(newFromToken);
      } else {
        let findTargetToken = false;
        depoistTokenList.forEach(token => {
          if (token.toTokenList) {
            if (findTargetToken) return;
            if (token.symbol === newFromToken.symbol) {
              findTargetToken = true;
              clearFromAndTo();
              setFromNetwork(newFromNetwork);
              setFromToken(newFromToken);
              setToToken(token.toTokenList?.[0]);
              setToChainId(token.toTokenList?.[0]?.chainIdList?.[0]);
            }
          }
        });
      }
    },
    [clearFromAndTo, depoistTokenList, fromNetwork, fromToken, toChainId, toToken?.symbol],
  );

  const setTo = useCallback(
    ({ newToChainId, newToToken }: { newToChainId: ChainId; newToToken: TTokenItem }) => {
      if (newToChainId === toChainId && newToToken.symbol === toToken?.symbol) {
        return;
      }

      let isFromTokenValid = false;
      depoistTokenList.forEach(token => {
        if (token.toTokenList) {
          if (isFromTokenValid) return;
          token.toTokenList.forEach(toTokenItem => {
            if (
              toTokenItem.symbol == newToToken.symbol &&
              toTokenItem.chainIdList?.includes(newToChainId) &&
              token.symbol === fromToken?.symbol
            ) {
              isFromTokenValid = true;
              return;
            }
          });
        }
      });

      if (isFromTokenValid) {
        // fromToken is valid, only set toChainId and toToken
        setToChainId(undefined);
        setToToken(undefined);
        setToChainId(newToChainId);
        setToToken(newToToken);
      } else {
        // fromToken is not valid, find the first valid fromToken and set both fromToken and toToken
        let findTargetToken = false;
        depoistTokenList.forEach(token => {
          if (token.toTokenList) {
            if (findTargetToken) return;
            token.toTokenList.forEach(toTokenItem => {
              if (toTokenItem.symbol == newToToken.symbol && toTokenItem.chainIdList?.includes(newToChainId)) {
                console.log('target token: ', JSON.stringify(token));
                findTargetToken = true;
                clearFromAndTo();
                // setFromNetwork(newFromNetwork); // todo_wade: request network list
                setFromToken(token);
                setToToken(newToToken);
                setToChainId(newToChainId);
              }
            });
          }
        });
      }
    },
    [clearFromAndTo, depoistTokenList, fromToken?.symbol, toChainId, toToken?.symbol],
  );

  return {
    loading,
    allNetworkList,
    fromNetwork,
    fromToken,
    toChainIdList,
    toChainId,
    toToken,
    unitReceiveAmount,
    payAmount,
    receiveAmount,
    rateRefreshTime,
    isSameSymbol,
    fetchDepositInfo,
    setPayAmount,
    setFrom,
    setTo,
  };
};

const FETCH_DEPOSIT_RECORD_DURATION = 20000;

export const useDepositRecord = () => {
  const [lastRecord, setLastRecord] = useState<TRecordsListItem>();

  const fetchRecentlyRecord = useCallback(async () => {
    const res = await depositService.getLastRecordsList();
    if (res) setLastRecord(res);
  }, []);

  useEffect(() => {
    fetchRecentlyRecord();
    const interval = setInterval(() => {
      fetchRecentlyRecord();
    }, FETCH_DEPOSIT_RECORD_DURATION);

    return () => clearInterval(interval);
  }, [fetchRecentlyRecord]);

  return { lastRecord };
};
