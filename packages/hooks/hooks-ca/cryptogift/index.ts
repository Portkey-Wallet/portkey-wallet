import { useCallback, useState, useRef } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { RedPackageDetail, RedPackageGrabInfoItem, RedPackageTypeEnum } from '@portkey-wallet/im';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { useEffectOnce } from '@portkey-wallet/hooks';
import useLockCallback from '../../useLockCallback';
import { generateRedPackageRawTransaction } from '@portkey-wallet/utils/chat';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { RedPackageCreationStatusEnum } from '@portkey-wallet/im/types';
import { useCurrentWalletInfo, useCurrentUserInfo } from '../wallet';

export const useGetFirstCryptoGift = () => {
  const [firstCryptoGift, setFirstCryptoGift] = useState<RedPackageDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFirstCryptoGift = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await request.redPackage.getFirstCryptoGift();
      setFirstCryptoGift(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffectOnce(() => {
    getFirstCryptoGift();
  });

  return {
    firstCryptoGift,
    loading,
    error,
  };
};

export const useGetCryptoGiftHistories = () => {
  const [cryptoGiftHistories, setCryptoGiftHistories] = useState<RedPackageDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFirstCryptoGift = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await request.redPackage.getCryptoGiftHistories();
      setCryptoGiftHistories(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffectOnce(() => {
    getFirstCryptoGift();
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

export const useGetRedPackageDetail = (id?: string) => {
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

      const {
        data: { items, ...detail },
      } = await request.redPackage.getCryptoGiftDetail({ params: fetchParams });

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
      return await next(params);
    },
    [next],
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
}

export const useSendCryptoGift = () => {
  const userInfo = useCurrentUserInfo();
  const wallet = useCurrentWalletInfo();
  const redPackageDisplayType: RedPackageDisplayType = 'CryptoGift';

  return useCallback(
    async (params: ISendCryptoGiftHookParams) => {
      const { totalAmount, memo, type, count, caContract, token } = params;
      const { chainId, symbol, assetType = AssetType.ft } = token;

      const caHash = wallet.caHash;
      const caAddress = wallet[chainId]?.caAddress;
      if (!userInfo || !caHash || !caAddress) {
        throw new Error('No user info');
      }

      const generateCryptoGiftParams = { chainId, symbol, redPackageDisplayType };
      const redPackageInfo = await request.redPackage.generateCryptoGift({ params: generateCryptoGiftParams });
      const { id, publicKey, minAmount, redPackageContractAddress, expireTime } = redPackageInfo.data;

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
      };
      const {
        data: { sessionId },
      } = await request.redPackage.sendCryptoGift({
        params: sendCryptoGiftParams,
      });

      const { data: creationStatus } = await handleLoopFetch({
        fetch: () => {
          const getCreationStatusParams = { sessionId };
          return request.redPackage.getCreationStatus({
            params: getCreationStatusParams,
          });
        },
        times: 10,
        interval: 2000,
        checkIsContinue: _creationStatusResult => {
          return _creationStatusResult?.data?.status === RedPackageCreationStatusEnum.PENDING;
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
