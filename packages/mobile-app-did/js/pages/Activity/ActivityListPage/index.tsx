import React, { useState, useCallback, useRef, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';

import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import NoData from 'components/NoData';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import ActivityItem from 'components/ActivityItem';
import { sleep } from '@portkey-wallet/utils';
import { FlatListFooterLoading } from 'components/FlatListFooterLoading';
import { ListLoadingEnum } from 'constants/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { FlashList } from '@shopify/flash-list';

interface RouterParams {
  chainId?: string;
  symbol?: string;
}

const ActivityListPage = () => {
  const { chainId, symbol } = useRouterParams<RouterParams>();
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const caAddressInfos = useCaAddressInfoList();
  const activity = useAppCASelector(state => state.activity);
  const currentActivity = useMemo(
    () => activity?.activityMap?.[getCurrentActivityMapKey(chainId, symbol)],
    [activity?.activityMap, chainId, symbol],
  );
  const currentActivityRef = useRef(currentActivity);
  currentActivityRef.current = currentActivity;

  const [isLoading, setIsLoading] = useState(ListLoadingEnum.hide);
  const getActivityList = useLockCallback(
    async (isInit: boolean) => {
      const { skipCount = 0, hasNextPage = true } = currentActivity || {};
      const maxResultCount = 30;
      if (!isInit && !hasNextPage) return;

      setIsLoading(isInit ? ListLoadingEnum.header : ListLoadingEnum.footer);
      const params: IActivitiesApiParams = {
        maxResultCount: maxResultCount,
        skipCount: isInit ? 0 : skipCount + maxResultCount,
        caAddressInfos,
        // managerAddresses: address,
        chainId: chainId,
        symbol: symbol,
      };

      await dispatch(getActivityListAsync(params));
      setIsLoading(ListLoadingEnum.hide);
      if (!isInit) await sleep(250);
    },
    [caAddressInfos, chainId, currentActivity, dispatch, symbol],
  );

  const isInitRef = useRef(false);
  const init = useCallback(async () => {
    await sleep(250);
    await getActivityList(true);
    isInitRef.current = true;
  }, [getActivityList]);

  const renderItem = useCallback(({ item, index }: { item: ActivityItemType; index: number }) => {
    const preItem = currentActivityRef.current?.data[index - 1];
    return (
      <ActivityItem
        preItem={preItem}
        item={item}
        index={index}
        onPress={() => navigationService.navigate('ActivityDetail', item)}
      />
    );
  }, []);

  const isEmpty = useMemo(() => (currentActivity?.data || []).length === 0, [currentActivity?.data]);

  return (
    <PageContainer
      titleDom={t('Activity')}
      safeAreaColor={['white', 'white']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <FlashList
        refreshing={isLoading === ListLoadingEnum.header}
        data={currentActivity?.data || []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={
          <NoData message={'You have no transactions.'} topDistance={pTd(160)} oblongSize={[pTd(96), pTd(84)]} />
        }
        renderItem={renderItem}
        onRefresh={() => getActivityList(true)}
        onEndReached={() => {
          if (!isInitRef.current) return;
          getActivityList(false);
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListFooterComponent={
          <>{!isEmpty && <FlatListFooterLoading refreshing={isLoading === ListLoadingEnum.footer} />}</>
        }
        onLoad={() => {
          if (isInitRef.current) return;
          init();
        }}
      />
    </PageContainer>
  );
};

export default ActivityListPage;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  noResult: {},
});
