import { useAppCommonDispatch, useEffectOnce } from '@portkey-wallet/hooks';
import ActivityList from 'pages/components/ActivityList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivityListAsync } from '@portkey-wallet/store/store-eoa/activity/action';
import { useCommonState, useLoading, useUserInfo } from 'store/Provider/hooks';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-eoa/activity/type';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { ChainId } from '@portkey-wallet/types';
import './index.less';
import useGAReport from 'hooks/useGAReport';
import BottomBar from 'pages/components/BottomBar';
import clsx from 'clsx';
import { useActivity } from '@portkey-wallet/hooks/hooks-eoa/activity';
import { useCurrentAddressInfos, useUniqueIdentify } from '@portkey-wallet/hooks/hooks-eoa/wallet';

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
  const { isPrompt } = useCommonState();
  const { t } = useTranslation();
  const activity = useActivity();
  const addressInfos = useCurrentAddressInfos();
  const identify = useUniqueIdentify();

  const currentActivity = useMemo(
    () => activity?.activityMap?.[identify]?.[getCurrentActivityMapKey(chainId, symbol)],
    [activity?.activityMap, chainId, symbol, identify],
  );
  const [hasMore, setHasMore] = useState(!!currentActivity?.hasNextPage);

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
        chainId: chainId,
        symbol: symbol,
        identify,
        addressInfos: chainId ? addressInfos.filter((ele) => ele.chainId === chainId) : addressInfos,
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
  }, [addressInfos, chainId, dispatch, endReport, identify, pageKey, passwordSeed, symbol]);

  const loadMoreActivities = useCallback(async () => {
    const { data, maxResultCount, skipCount, totalRecordCount } = currentActivity || {};
    if (data && totalRecordCount && data.length < totalRecordCount) {
      const params = {
        maxResultCount: MAX_RESULT_COUNT,
        skipCount: (skipCount ?? 0) + (maxResultCount ?? 0),
        caAddressInfos: chainId ? addressInfos.filter((item) => item.chainId === chainId) : addressInfos,
        chainId: chainId,
        symbol: symbol,
        identify,
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
  }, [currentActivity, chainId, addressInfos, symbol, identify, dispatch]);

  return (
    <div className={clsx(['portkey-home', 'flex-column', isPrompt && 'portkey-prompt'])}>
      <div className="activity-wrapper">
        <div className="activity-title">Activity</div>
        {currentActivity?.totalRecordCount ? (
          <ActivityList data={currentActivity.data} chainId={chainId} hasMore={hasMore} loadMore={loadMoreActivities} />
        ) : (
          <div className="no-activity-data flex-column-center">{!initLoading && t('No activity')}</div>
        )}
      </div>
      {!isPrompt && <BottomBar />}
    </div>
  );
}
