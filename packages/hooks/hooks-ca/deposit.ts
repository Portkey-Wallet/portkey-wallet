import { useCallback, useEffect, useState, useRef } from 'react';
import AElf from 'aelf-sdk';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { TQueryTransferAuthTokenRequest } from '@portkey-wallet/types/types-ca/deposit';
import { TTokenItem, TNetworkItem } from '@portkey-wallet/types/types-ca/deposit';
import { ChainId } from '@portkey-wallet/types';
import depositService from '@portkey-wallet/utils/deposit';

const MAX_REFRESH_TIME = 15;

export const useDeposit = (initToToken: TTokenItem, initChainId: ChainId, manager?: AElfWallet) => {
  const { caHash, address } = useCurrentWalletInfo();
  const { apiUrl } = useCurrentNetworkInfo();

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

  // const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);
  // const [rateRefreshTime, setRateRefreshTime] = useState<number>(MAX_REFRESH_TIME);
  // const refreshReceiveRef = useRef<() => void>();
  // const refreshReceiveTimerRef = useRef<NodeJS.Timer>();

  const clearFromAndTo = useCallback(() => {
    setFromNetwork(undefined);
    setFromToken(undefined);
    setToChainIdList([]);
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
      chain_id: 'AELF', // todo_wade: fix the chain_id
      managerAddress: address,
    };
    const res = await depositService.getTransferToken(params, apiUrl);
    console.log('aaaaa token : ', res);
  }, [address, caHash, apiUrl, manager]);

  const fetchDepositTokenList = useCallback(async () => {
    const tokenList = await depositService.getDepositTokenList();

    let findTartgetToken = false;
    tokenList.forEach(token => {
      if (token.toTokenList) {
        if (findTartgetToken) return;
        token.toTokenList.forEach(toTokenItem => {
          if (findTartgetToken) return;
          if (toTokenItem.symbol === initToToken.symbol) {
            findTartgetToken = true;
            clearFromAndTo();
            setToChainIdList(toTokenItem.chainIdList || []);
            setFromToken(token);
            setToToken(toTokenItem);
            setToChainId(initChainId);
          }
        });
      }
    });
  }, [clearFromAndTo, initChainId, initToToken.symbol]);

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

  //toChainId=tDVW&fromSymbol=USDT&toSymbol=SGR-1&fromAmount=100
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

  useEffect(() => {
    (async () => {
      await fetchTransferToken();
      await fetchDepositTokenList();
    })();
  }, [fetchDepositTokenList, fetchTransferToken]);

  useEffect(() => {
    (async () => {
      if (!toChainId || !fromToken?.symbol || !toToken?.symbol) {
        return;
      }
      const res = await calculateAmount(1);
      if (res.toAmount) {
        seteUnitReceiveAmount(Number(res.toAmount));
      }
    })();
  }, [calculateAmount, fromToken?.symbol, toChainId, toToken?.symbol]);

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

  return {
    fromNetwork,
    fromToken,
    toChainIdList,
    toChainId,
    toToken,
    unitReceiveAmount,
    payAmount,
    receiveAmount,
    fetchDepositInfo,
    setPayAmount,
  };
};
