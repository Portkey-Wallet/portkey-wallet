import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  TReceiveTokenMap,
  TReceiveFromNetworkItem,
  ReceiveType,
  ReceiveFromNetworkServiceType,
} from '@portkey-wallet/types/types-eoa/receive';
import { ChainId } from '@portkey-wallet/types';
import { request } from '@portkey-wallet/api/api-eoa';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-eoa/token';
import { TQueryTransferAuthTokenRequest } from '@portkey-wallet/types/types-eoa/deposit';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';
import AElf from 'aelf-sdk';
// import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import depositService from '@portkey-wallet/utils/deposit-eoa';
import { TDepositInfo } from '@portkey-wallet/types/types-eoa/deposit';
import { getETransferReCaptcha } from '@etransfer/ui-react';
import { useCurrentAccount } from './wallet';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { eTransferCore } from '@etransfer/core';

export const useReceive = (token: IUserTokenItemResponse, initToChainId?: ChainId) => {
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
    return destinationMap[destinationChain.chainId].filter(item => {
      return !(
        item.serviceList &&
        item.serviceList.length === 1 &&
        item.serviceList[0].serviceName === ReceiveFromNetworkServiceType.EBridge
      );
    });
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
    console.log('token.symbol===wfs', token.symbol);
    request.receive
      .fetchReceiveNetworkList({
        params: {
          symbol: token.symbol,
        },
      })
      .then(data => {
        console.log('data is===22', JSON.stringify(data.destinationMap));
        if (data && data.destinationMap) {
          setDestinationMap(data.destinationMap);
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
    if (destinationMap[toChainId]?.length) {
      setSourceChain(destinationMap[toChainId].find(item => item.network == toChainId) ?? destinationMap[toChainId][0]); // set same network as source chain
    }
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

export const useReceiveByETransfer = ({
  manager,
  toChainId,
  toSymbol,
  fromNetwork,
  fromSymbol,
}: {
  manager?: AElfWallet;
  toChainId: ChainId;
  toSymbol: string;
  fromNetwork: string;
  fromSymbol: string;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [depositInfo, setDepositInfo] = useState<TDepositInfo | undefined>();
  // const { caHash, address, originChainId } = useCurrentWalletInfo();
  // const { address } = useCurrentAccount() || { address: '' };
  const { apiUrl } = useCurrentNetworkInfo();
  const isMainnet = useIsMainnet();
  console.log('apiUrl====wfs', apiUrl);
  const fetchTransferToken = useCallback(async () => {
    /**
     * const aesPrivateKey = AElf.wallet.AESDecrypt(account.AESEncryptPrivateKey, pin);
    console.log(aesPrivateKey, 'aesPrivateKey==');
    const wallet = getWallet(aesPrivateKey) as IBlockchainWallet;
    const plainTextOrigin = `Nonce:${Date.now()}`;
    const plainTextHex = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    const plainTextHexSignature = Buffer.from(plainTextHex).toString('hex');

    const signature = AElf.wallet.sign(plainTextHexSignature, wallet.keyPair).toString('hex');
    const pubkey = wallet.keyPair.getPublic('hex');
    const managerAddress = wallet.address;
     */
    if (!manager) return;
    const plainTextOrigin = `Nonce:${Date.now()}`;
    const plainTextHex = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    const plainTextHexSignature = Buffer.from(plainTextHex).toString('hex');

    const signature = AElf.wallet.sign(plainTextHexSignature, manager.keyPair).toString('hex');
    const pubkey = (manager.keyPair as any).getPublic('hex');
    try {
      const isRegistered = await eTransferCore.services.checkEOARegistration({ address: manager.address });
      console.log('isRegistered=====is', isRegistered);
      let reCaptchaToken = undefined;
      if (!isRegistered.result) {
        reCaptchaToken = (await verifyHumanMachine('en', true, isMainnet)) as string;
      }
      // // // const recaptchaToken = undefined;
      console.log('recaptchaToken===', reCaptchaToken);
      setLoading(true);
      const params: TQueryTransferAuthTokenRequest = {
        pubkey: pubkey,
        signature: signature,
        plain_text: plainTextHex,
        // ca_hash: caHash ?? '',
        // chain_id: 'AELF',
        // scope: 'ETransferServer',
        managerAddress: manager.address,
        recaptchaToken: reCaptchaToken,
      };
      const res = await depositService.getTransferToken(params, apiUrl);
      console.log('etransfer token wfs: ', res);
    } catch (e) {
      console.log('exception===', JSON.stringify(e));
      console.log('exception===', e);
    }
  }, [manager, apiUrl]);

  const fetchDepositInfo = useCallback(async () => {
    if (!toChainId || !fromNetwork || !fromSymbol || !toSymbol) {
      throw new Error('Invalid params: toChainId, fromNetwork, fromToken, toToken');
    }
    const params = {
      chainId: toChainId,
      network: fromNetwork,
      symbol: fromSymbol,
      toSymbol: toSymbol,
    };
    const info = await depositService.getDepositInfo(params);
    return info;
  }, [fromNetwork, fromSymbol, toChainId, toSymbol]);

  useEffect(() => {
    (async () => {
      try {
        if (!manager) return;
        setLoading(false);
        setDepositInfo(undefined);
        await fetchTransferToken();
        const info = await fetchDepositInfo();
        console.log('depositInfo: ', info);
        setDepositInfo(info);
      } catch (e) {
        console.log('fetchDepositInfo error', JSON.stringify(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchDepositInfo, fetchTransferToken, manager]);

  return { loading, depositInfo };
};
