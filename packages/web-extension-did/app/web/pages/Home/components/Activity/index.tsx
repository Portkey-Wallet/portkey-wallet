import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import ActivityList from 'pages/components/ActivityList';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLoading, useUserInfo } from 'store/Provider/hooks';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { ChainId } from '@portkey-wallet/types';

export interface ActivityProps {
  appendData?: Function;
  clearData?: Function;
  chainId?: ChainId;
  symbol?: string;
}

export enum EmptyTipMessage {
  NO_TRANSACTIONS = 'You have no transactions',
  NETWORK_NO_TRANSACTIONS = 'No transaction records accessible from the current custom network',
}

const MAX_RESULT_COUNT = 20;
const SKIP_COUNT = 0;

export default function Activity({ chainId, symbol }: ActivityProps) {
  const { t } = useTranslation();
  const activity = useAppCASelector((state) => state.activity);
  const caAddressInfos = useCaAddressInfoList();
  const currentActivity = useMemo(() => {
    return (
      activity.activityMap[getCurrentActivityMapKey(chainId, symbol)] || {
        data: [],
        maxResultCount: 0,
        skipCount: 0,
        totalRecordCount: 0,
      }
    );
  }, [activity.activityMap, chainId, symbol]);

  const dispatch = useAppCommonDispatch();
  const { passwordSeed } = useUserInfo();

  const { setLoading } = useLoading();
  const setL = useCallback(() => {
    // When there is no transaction and fetching, show loading.
    if (
      typeof activity.isLoading === 'boolean' &&
      activity.isLoading &&
      (!currentActivity?.data?.length || currentActivity?.data?.length === 0)
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [activity.isLoading, currentActivity?.data?.length, setLoading]);

  useEffect(() => {
    setL();
  }, [setL]);

  useEffect(() => {
    if (passwordSeed) {
      const params: IActivitiesApiParams = {
        maxResultCount: MAX_RESULT_COUNT,
        skipCount: SKIP_COUNT,
        caAddressInfos: chainId ? caAddressInfos.filter((item) => item.chainId === chainId) : caAddressInfos,
        chainId: chainId,
        symbol: symbol,
      };
      dispatch(getActivityListAsync(params));
    }
  }, [caAddressInfos, chainId, dispatch, passwordSeed, symbol]);

  const loadMoreActivities = useCallback(() => {
    const { data, maxResultCount, skipCount, totalRecordCount } = currentActivity;
    if (data.length < totalRecordCount) {
      const params = {
        maxResultCount: MAX_RESULT_COUNT,
        skipCount: skipCount + maxResultCount,
        caAddressInfos: chainId ? caAddressInfos.filter((item) => item.chainId === chainId) : caAddressInfos,
        chainId: chainId,
        symbol: symbol,
      };
      return dispatch(getActivityListAsync(params));
    }
  }, [currentActivity, chainId, caAddressInfos, symbol, dispatch]);

  return (
    <div className="activity-wrapper">
      {currentActivity?.totalRecordCount ? (
        <ActivityList
          data={currentActivity.data}
          chainId={chainId}
          hasMore={currentActivity.data.length < currentActivity?.totalRecordCount}
          loadMore={loadMoreActivities}
        />
      ) : (
        <p className="empty">{t(EmptyTipMessage.NO_TRANSACTIONS)}</p>
      )}
    </div>
  );
}
