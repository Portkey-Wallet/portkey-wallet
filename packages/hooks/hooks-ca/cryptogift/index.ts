import { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { RedPackageDetail, RedPackageGrabInfoItem, RedPackageTypeEnum } from '@portkey-wallet/im';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { CryptoGiftItem } from '@portkey-wallet/types/types-ca/cryptogift';
import { useAppCASelector, useAppCommonDispatch, useEffectOnce } from '@portkey-wallet/hooks';
import useLockCallback from '../../useLockCallback';
import { generateRedPackageRawTransaction } from '@portkey-wallet/utils/chat';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { handleErrorMessage, handleLoopFetch } from '@portkey-wallet/utils';
import { RedPackageCreationStatusEnum } from '@portkey-wallet/im/types';
import { useCurrentWalletInfo, useCurrentUserInfo } from '../wallet';
import { ChainId } from '@portkey-wallet/types';
import { useCurrentNetworkInfo } from '../network';
import { setRedPackageConfig } from '@portkey-wallet/store/store-ca/cryptoGift/actions';
import { DeviceEventEmitter } from 'react-native';
export const useCryptoGiftConfigMapState = () => useAppCASelector(state => state.cryptoGift.redPackageConfigMap);
export const CryptoGiftCreateSuccess = 'CryptoGiftCreateSuccess';
export const useGetFirstCryptoGift = () => {
  const [firstCryptoGift, setFirstCryptoGift] = useState<CryptoGiftItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFirstCryptoGift = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await request.redPackage.getFirstCryptoGift();
      setFirstCryptoGift(res);
    } catch (e) {
      setError(handleErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffectOnce(() => {
    getFirstCryptoGift();
  });
  useEffect(() => {
    const eventListener = DeviceEventEmitter.addListener(CryptoGiftCreateSuccess, () => {
      getFirstCryptoGift();
    });
    return () => {
      eventListener.remove();
    };
  }, [getFirstCryptoGift]);
  return {
    firstCryptoGift,
    loading,
    error,
  };
};

export const useGetCryptoGiftHistories = () => {
  const [cryptoGiftHistories, setCryptoGiftHistories] = useState<CryptoGiftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCryptoGiftHistories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await request.redPackage.getCryptoGiftHistories();
      setCryptoGiftHistories(res);
    } catch (e) {
      setError(handleErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffectOnce(() => {
    getCryptoGiftHistories();
  });

  return {
    cryptoGiftHistories,
    loading,
    error,
  };
};

type RedPackageDisplayType = 'Common' | 'CryptoGift';

type NextCryptoGiftDetailParams = {
  id?: string;
  skipCount?: number;
  maxResultCount?: number;
  redPackageDisplayType?: RedPackageDisplayType;
};
export type NextCryptoGiftDetailResult = { info: RedPackageDetail; list: RedPackageGrabInfoItem[] };

export const useGetCryptoGiftDetail = (id: string) => {
  const [info, setInfo] = useState<RedPackageDetail>();
  const infoRef = useRef(info);
  infoRef.current = info;
  const [list, setList] = useState<RedPackageGrabInfoItem[]>([]);
  const pagerRef = useRef({
    skipCount: 0,
    maxResultCount: 20,
    totalCount: 0,
  });

  const next: (params?: NextCryptoGiftDetailParams) => Promise<NextCryptoGiftDetailResult> = useLockCallback(
    async (params?: NextCryptoGiftDetailParams) => {
      const { skipCount, maxResultCount, totalCount } = pagerRef.current;

      const fetchParams = {
        id: params?.id ?? id ?? '',
        skipCount: params?.skipCount ?? skipCount ?? 0,
        maxResultCount: params?.maxResultCount ?? maxResultCount ?? 20,
        redPackageDisplayType: 'CryptoGift',
      };

      const _skipCount = fetchParams.skipCount;
      if (_skipCount !== 0 && _skipCount >= totalCount) {
        return {
          info: infoRef.current,
          list: [],
        };
      }
      const { items, ...detail } = await request.redPackage.getCryptoGiftDetail({ params: fetchParams });
      console.log('wfs items===', items);
      console.log('wfs detail===', detail);
      setInfo(detail);
      if (fetchParams.skipCount === 0) {
        setList(items);
        pagerRef.current = {
          skipCount: items.length,
          maxResultCount: fetchParams.maxResultCount,
          totalCount: detail.totalCount,
        };
      } else {
        setList(pre => [...pre, ...items]);
        pagerRef.current = {
          skipCount: fetchParams.skipCount + items.length,
          maxResultCount: fetchParams.maxResultCount,
          totalCount: detail.totalCount,
        };
      }
      return {
        info: detail,
        list: items,
      };
    },
    [id],
  );
  const init = useCallback(
    async (params?: { id: string }) => {
      return await next({ id: params?.id ?? id ?? '' });
    },
    [id, next],
  );

  return {
    info,
    list,
    next,
    init,
  };
};

export interface ISendCryptoGiftHookParams {
  totalAmount: string;
  type: RedPackageTypeEnum;
  count: number;
  memo: string;
  caContract: ContractBasic;
  token: ICryptoBoxAssetItemType;
  isNewUsersOnly?: boolean;
}

export const useSendCryptoGift = () => {
  const userInfo = useCurrentUserInfo();
  const wallet = useCurrentWalletInfo();
  const redPackageDisplayType: RedPackageDisplayType = 'CryptoGift';

  return useCallback(
    async (params: ISendCryptoGiftHookParams) => {
      const { totalAmount, memo, type, count, caContract, token, isNewUsersOnly = false } = params;
      const { chainId, symbol, assetType = AssetType.ft } = token;

      const caHash = wallet.caHash;
      const caAddress = wallet[chainId]?.caAddress;
      if (!userInfo || !caHash || !caAddress) {
        throw new Error('No user info');
      }

      const generateCryptoGiftParams = { chainId, symbol, redPackageDisplayType };
      const redPackageInfo = await request.redPackage.generateCryptoGift({ params: generateCryptoGiftParams });
      console.log('wfs===generateCryptoGift', redPackageInfo);
      const { id, publicKey, minAmount, redPackageContractAddress, expireTime } = redPackageInfo;

      const rawTransaction = await generateRedPackageRawTransaction({
        caContract,
        caHash,
        caAddress,
        contractAddress: redPackageContractAddress,
        id,
        symbol,
        totalAmount,
        minAmount,
        expirationTime: Date.now() + expireTime,
        totalCount: count,
        type,
        publicKey,
      });

      const sendCryptoGiftParams = {
        id,
        totalAmount,
        type,
        count,
        chainId,
        symbol,
        memo,
        rawTransaction,
        assetType,
        redPackageDisplayType,
        isNewUsersOnly,
      };
      const { sessionId } = await request.redPackage.sendCryptoGift({
        params: sendCryptoGiftParams,
      });

      const creationStatus = await handleLoopFetch({
        fetch: () => {
          const getCreationStatusParams = { sessionId };
          return request.redPackage.getCreationStatus({
            params: getCreationStatusParams,
          });
        },
        times: 10,
        interval: 2000,
        checkIsContinue: _creationStatusResult => {
          return _creationStatusResult?.status === RedPackageCreationStatusEnum.PENDING;
        },
      });
      if (creationStatus.status !== RedPackageCreationStatusEnum.SUCCESS) {
        throw new Error('Creation FAIL');
      }
      return id;
    },
    [userInfo, wallet],
  );
};

export const useGetCryptoGiftConfig = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const cryptoGiftConfigMap = useCryptoGiftConfigMapState();
  const cryptoGiftConfig = useMemo(() => cryptoGiftConfigMap?.[networkType], [networkType, cryptoGiftConfigMap]);
  const init = useCallback(async () => {
    const result = await request.redPackage.getRedPackageConfig();
    console.log('wfs result===', result);
    const tokenInfo = result?.tokenInfo || [];
    const redPackageContractAddress = result?.redPackageContractAddress || [];
    const redPackageConfig = {
      tokenInfo,
      redPackageContractAddress,
    };
    console.log(
      'wfs=== useGetCryptoGiftConfig init',
      JSON.stringify({
        network: networkType,
        value: redPackageConfig,
      }),
    );
    dispatch(
      setRedPackageConfig({
        network: networkType,
        value: redPackageConfig,
      }),
    );
  }, [dispatch, networkType]);
  const getCryptoGiftContractAddress = useCallback(
    (chainId: ChainId) => {
      return cryptoGiftConfig?.redPackageContractAddress.find(item => item.chainId === chainId)?.contractAddress;
    },
    [cryptoGiftConfig?.redPackageContractAddress],
  );
  return {
    init,
    getCryptoGiftContractAddress,
  };
};
