import { useAppCASelector, useAppCommonDispatch, useEffectOnce } from '@portkey-wallet/hooks';
import ActivityList from 'pages/components/ActivityList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLoading, useUserInfo } from 'store/Provider/hooks';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { ChainId } from '@portkey-wallet/types';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import useGAReport from 'hooks/useGAReport';

export interface ActivityProps {
  appendData?: Function;
  clearData?: Function;
  chainId?: ChainId;
  symbol?: string;
  pageKey?: 'Home-Activity' | 'Token-Activity';
}

export enum EmptyTipMessage {
  NO_TRANSACTIONS = 'You have no transactions',
  NETWORK_NO_TRANSACTIONS = 'No transaction records accessible from the current custom network',
}

const MAX_RESULT_COUNT = 20;
const SKIP_COUNT = 0;

export default function Activity({ chainId, symbol, pageKey = 'Home-Activity' }: ActivityProps) {
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
        hasNextPage: false,
      }
    );
  }, [activity.activityMap, chainId, symbol]);
  const [hasMore, setHasMore] = useState(!!currentActivity.hasNextPage);
  const dispatch = useAppCommonDispatch();
  const { passwordSeed } = useUserInfo();
  const [initLoading, setInitLoading] = useState(false);
  const { setLoading } = useLoading();
  const setNoDataLoading = useCallback(() => {
    // When there is no transaction and fetching, show loading.
    if (initLoading && (!currentActivity?.data?.length || currentActivity?.data?.length === 0)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [currentActivity?.data?.length, initLoading, setLoading]);

  useEffect(() => {
    setNoDataLoading();
  }, [setNoDataLoading]);

  const { startReport, endReport } = useGAReport();

  useEffectOnce(() => {
    startReport(pageKey);
  });

  useEffect(() => {
    if (passwordSeed) {
      const params: IActivitiesApiParams = {
        maxResultCount: MAX_RESULT_COUNT,
        skipCount: SKIP_COUNT,
        caAddressInfos: chainId ? caAddressInfos.filter((item) => item.chainId === chainId) : caAddressInfos,
        chainId: chainId,
        symbol: symbol,
      };
      setInitLoading(true);
      dispatch(getActivityListAsync(params))
        .then((res: any) => {
          endReport(pageKey);
          if (res.payload) {
            if (res.payload.hasNextPage) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          }
        })
        .finally(() => {
          setInitLoading(false);
        });
    }
  }, [caAddressInfos, chainId, dispatch, endReport, pageKey, passwordSeed, symbol]);

  const loadMoreActivities = useCallback(async () => {
    const { data, maxResultCount, skipCount, totalRecordCount } = currentActivity;
    if (data.length < totalRecordCount) {
      const params = {
        maxResultCount: MAX_RESULT_COUNT,
        skipCount: skipCount + maxResultCount,
        caAddressInfos: chainId ? caAddressInfos.filter((item) => item.chainId === chainId) : caAddressInfos,
        chainId: chainId,
        symbol: symbol,
      };
      const res = await dispatch(getActivityListAsync(params));
      if (res.payload) {
        if (!res.payload.hasNextPage) {
          setHasMore(false);
        }
      } else {
        if (res.error?.message === 'No data') {
          setHasMore(false);
        }
      }
    }
  }, [currentActivity, chainId, caAddressInfos, symbol, dispatch]);

  return (
    <div className="activity-wrapper">
      {currentActivity?.totalRecordCount ? (
        <ActivityList data={currentActivity.data} chainId={chainId} hasMore={hasMore} loadMore={loadMoreActivities} />
      ) : (
        <div className="no-activity-data flex-column-center">
          <CustomSvg type="NoActivity" />
          {t(EmptyTipMessage.NO_TRANSACTIONS)}
        </div>
      )}
    </div>
  );
}
