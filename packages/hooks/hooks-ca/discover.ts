import { request } from '@portkey-wallet/api/api-did';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { cleanBookmarkList, addBookmarkList } from '@portkey-wallet/store/store-ca/discover/slice';
import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import { DISCOVER_BOOKMARK_MAX_COUNT } from '@portkey-wallet/constants/constants-ca/discover';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetContractUpgradeTime } from '@portkey-wallet/graphql/dappSecurity/hooks';
import { ChainId } from '@portkey-wallet/types';
import { DAPP_SECURITY_SPENDER_INVALID } from '@portkey-wallet/constants/constants-ca/dapp';
import { checkTimeOver12 } from '@portkey-wallet/utils/check';
import { formatDateTime } from '@portkey-wallet/utils/format';

export const useBookmarkList = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { discoverMap } = useAppCASelector(state => state.discover);

  const clean = useCallback(() => {
    dispatch(cleanBookmarkList(networkType));
  }, [dispatch, networkType]);

  const refresh = useCallback(
    async (skipCount = 0, maxResultCount = DISCOVER_BOOKMARK_MAX_COUNT) => {
      const result = await request.discover.getBookmarks({
        params: {
          skipCount,
          maxResultCount,
        },
      });

      if (skipCount === 0) {
        clean();
      }
      dispatch(addBookmarkList({ networkType, list: result.items || [] }));
      return result as {
        items: IBookmarkItem[];
        totalCount: number;
      };
    },
    [clean, dispatch, networkType],
  );

  const bookmarkList = useMemo(() => discoverMap?.[networkType]?.bookmarkList || [], [discoverMap, networkType]);

  return {
    refresh,
    clean,
    bookmarkList,
  };
};

export function useDappInfo(website: string, logo: string) {
  const [isInWebSet, setIsInWebSet] = useState<boolean>(true);
  const checkDappIsLegal = useCallback(async (website: string, logo: string) => {
    const result = await request.discover.checkDappInfo({
      params: {
        website,
        logo,
      },
    });
    setIsInWebSet(result);
  }, []);
  useEffect(() => {
    (async () => {
      await checkDappIsLegal(website, logo);
    })();
  }, [checkDappIsLegal, logo, website]);
  return isInWebSet;
}
export type TResult = {
  show: boolean;
  text: string;
  type: 'warning' | 'info';
};
export function useDappSpenderCheck(website?: string, spender?: string, logo?: string, targetChainId?: ChainId) {
  const [result, setResult] = useState<TResult>({
    show: false,
    text: '',
    type: 'warning',
  });
  const getContractUpgradeTime = useGetContractUpgradeTime();
  const checkDappSpenderValid = useCallback(async (website?: string, spender?: string, logo?: string) => {
    const result = await request.discover.checkSpenderValid({
      params: {
        website,
        logo,
        spender,
      },
    });
    return result;
  }, []);
  useEffect(() => {
    (async () => {
      const spenderValidResult = await checkDappSpenderValid(website, spender, logo);
      const contractResult = await getContractUpgradeTime({
        input: {
          chainId: targetChainId || '',
          address: spender || '',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      const blockTime = contractResult.data.contractList.items[0].metadata.block.blockTime;
      const result: TResult = {
        show: false,
        text: '',
        type: 'warning',
      };
      result.show = !spenderValidResult || !!blockTime;
      if (!spenderValidResult && !blockTime) {
        result.text = DAPP_SECURITY_SPENDER_INVALID;
      } else if (!spenderValidResult && blockTime) {
        const upgradeTime = formatDateTime(blockTime);
        result.text = `The dApp's logo, domain, or address you're approving may not be authentic. Please proceed with caution.\nThe dApp's smart contract has been updated. Contract update time: ${upgradeTime}`;
      } else if (blockTime && spenderValidResult) {
        const isTimeOver12 = checkTimeOver12(blockTime);
        const upgradeTime = formatDateTime(blockTime);
        result.text = `Contract update time: ${upgradeTime} The dApp's smart contract has been updated. Please proceed with caution.`;
        result.type = isTimeOver12 ? 'info' : 'warning';
      }
      setResult(result);
    })();
  }, [checkDappSpenderValid, getContractUpgradeTime, logo, spender, targetChainId, website]);
  return result;
}
