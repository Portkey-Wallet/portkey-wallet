import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import ActivityList from 'pages/components/ActivityList';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { useCaAddressInfoList, useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLoading, useUserInfo } from 'store/Provider/hooks';
import { transactionTypesForActivityList } from '@portkey-wallet/constants/constants-ca/activity';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';

export interface ActivityProps {
  appendData?: Function;
  clearData?: Function;
  chainId?: string;
  symbol?: string;
}

export enum EmptyTipMessage {
  NO_TRANSACTIONS = 'You have no transactions',
  NETWORK_NO_TRANSACTIONS = 'No transaction records accessible from the current custom network',
}

const AMX_RESULT_COUNT = 10;
const SKIP_COUNT = 0;

export default function Activity({ chainId, symbol }: ActivityProps) {
  const { t } = useTranslation();
  const activity = useAppCASelector((state) => state.activity);
  const caAddressInfos = useCaAddressInfoList();
  const currentActivity = useMemo(() => {
    return activity.activityMap[getCurrentActivityMapKey(chainId, symbol)] || {};
  }, [activity.activityMap, chainId, symbol]);

  const dispatch = useAppCommonDispatch();
  const { passwordSeed } = useUserInfo();
  const currentWallet = useCurrentWallet();
  const {
    walletInfo,
    walletInfo: { caAddressList },
  } = currentWallet;

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
        maxResultCount: AMX_RESULT_COUNT,
        skipCount: SKIP_COUNT,
        caAddresses: chainId ? [walletInfo?.[chainId]?.caAddress || ''] : caAddressList,
        caAddressInfos: chainId ? caAddressInfos.filter((item) => item.chainId === chainId) : caAddressInfos,
        chainId: chainId,
        symbol: symbol,
        transactionTypes: transactionTypesForActivityList,
      };
      dispatch(getActivityListAsync(params));
    }
  }, [caAddressInfos, caAddressList, chainId, dispatch, passwordSeed, symbol, walletInfo]);

  const loadMoreActivities = useCallback(() => {
    const { data, maxResultCount, skipCount, totalRecordCount } = currentActivity;
    if (data.length < totalRecordCount) {
      const params = {
        maxResultCount: AMX_RESULT_COUNT,
        skipCount: skipCount + maxResultCount,
        caAddresses: chainId ? [walletInfo?.[chainId]?.caAddress || ''] : caAddressList,
        caAddressInfos: chainId ? caAddressInfos.filter((item) => item.chainId === chainId) : caAddressInfos,
        chainId: chainId,
        symbol: symbol,
        transactionTypes: transactionTypesForActivityList,
      };
      return dispatch(getActivityListAsync(params));
    }
  }, [currentActivity, chainId, walletInfo, caAddressList, caAddressInfos, symbol, dispatch]);

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
