import React, { useState, useCallback, useRef, useMemo } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';

import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import NoData from 'components/NoData';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import ActivityItem from 'components/ActivityItem';
import { sleep } from '@portkey-wallet/utils';
import { FlatListFooterLoading } from 'components/FlatListFooterLoading';
import { ListLoadingEnum } from 'constants/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

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

  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();

  const [isLoading, setIsLoading] = useState(ListLoadingEnum.hide);
  const getActivityList = useLockCallback(
    async (isInit: boolean) => {
      const { data = [], skipCount = 0, totalRecordCount = 0 } = currentActivity || {};
      const maxResultCount = 30;
      if (!isInit && data?.length >= totalRecordCount) return;

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
      if (!isInit) await sleep(500);
    },
    [caAddressInfos, chainId, currentActivity, dispatch, symbol],
  );

  const init = useCallback(async () => {
    await sleep(100);
    getActivityList(true);
    getTokenPrice();
  }, [getActivityList, getTokenPrice]);

  useEffectOnce(() => {
    init();
  });

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

  return (
    <PageContainer
      titleDom={t('Activity')}
      safeAreaColor={['blue', 'white']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <FlatList
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        refreshing={isLoading === ListLoadingEnum.header}
        data={currentActivity?.data || []}
        keyExtractor={(_item: ActivityItemType, index: number) => `${index}`}
        renderItem={renderItem}
        onRefresh={() => getActivityList(true)}
        onEndReached={() => getActivityList(false)}
        windowSize={50}
        maxToRenderPerBatch={10}
        initialNumToRender={20}
        ListEmptyComponent={<NoData message={t('You have no transactions.')} topDistance={pTd(160)} />}
        ListFooterComponent={<FlatListFooterLoading refreshing={isLoading === ListLoadingEnum.footer} />}
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
