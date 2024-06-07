import { useCallback, useState, useRef } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { RedPackageDetail, RedPackageGrabInfoItem } from '@portkey-wallet/im';
import { useEffectOnce } from '@portkey-wallet/hooks';
import useLockCallback from '../../useLockCallback';

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

type NextCryptoGiftDetailParams = {
  id?: string;
  skipCount?: number;
  maxResultCount?: number;
  redPackageDisplayType?: 'Common' | 'CryptoGift';
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
