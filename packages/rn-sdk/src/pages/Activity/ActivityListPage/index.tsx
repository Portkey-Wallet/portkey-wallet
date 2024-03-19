import React, { useState, useCallback, useRef, useMemo } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import NoData from 'components/NoData';
import { ActivityItemType } from 'network/dto/query';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import TransferItem from 'components/TransferList/components/TransferItem';
import { getUnlockedWallet, useUnlockedWallet } from 'model/wallet';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { NetworkController } from 'network/controller';
import { ActivityDetailPropsType } from '../ActivityDetail';

const ActivityListPage = () => {
  const { t } = useLanguage();
  const { wallet } = useUnlockedWallet({ getMultiCaAddresses: true });
  const caAddressInfos = useMemo(() => {
    if (!wallet) return {};
    return Object.entries(wallet.multiCaAddresses ?? {}).map(it => {
      return { chainId: it[0], caAddress: it[1] };
    });
  }, [wallet]);
  const { navigateTo } = useBaseContainer({
    entryName: PortkeyEntries.ACTIVITY_LIST_ENTRY,
  });
  const [currentActivity, setCurrentActivity] = useState<ActivityListEntity>({
    activityList: [],
    skipCount: 0,
    totalRecordCount: 0,
  });

  const isLoadingRef = useRef(false);
  const getActivityList = async (isInit: boolean) => {
    const instantWallet = await getUnlockedWallet({ getMultiCaAddresses: true });
    if (!instantWallet || !instantWallet.address) return;
    const { activityList = [], skipCount = 0 } = currentActivity;
    const maxResultCount = 30;
    const { originChainId, multiCaAddresses, address } = instantWallet;
    if (!isInit && activityList?.length >= currentActivity.totalRecordCount) return;
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setRefreshing(true);
    const { data, totalRecordCount } = await NetworkController.getRecentActivities({
      caAddressInfos: Object.entries(multiCaAddresses).map(it => {
        return { chainId: it[0], caAddress: it[1] };
      }),
      managerAddresses: [address],
      chainId: originChainId,
      skipCount: isInit ? 0 : skipCount,
      maxResultCount,
    });
    setCurrentActivity({
      activityList: isInit ? data : activityList.concat(data),
      skipCount: (isInit ? 0 : skipCount) + data.length,
      totalRecordCount,
    });
    setRefreshing(false);
    isLoadingRef.current = false;
  };

  useEffectOnce(() => {
    getActivityList(true);
  });

  const renderItem = useCallback(
    ({ item }: { item: ActivityItemType }) => {
      return (
        <TransferItem
          item={item}
          onPress={() =>
            navigateTo(PortkeyEntries.ACTIVITY_DETAIL_ENTRY, {
              params: { item, caAddressInfos } as Partial<ActivityDetailPropsType>,
            })
          }
        />
      );
    },
    [caAddressInfos, navigateTo],
  );

  const [refreshing, setRefreshing] = useState(false);

  return (
    <PageContainer
      titleDom={t('Activity')}
      safeAreaColor={['blue', 'white']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <FlatList
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        refreshing={refreshing}
        data={currentActivity.activityList || []}
        keyExtractor={(_item: ActivityItemType, index: number) => `${index}`}
        renderItem={renderItem}
        onRefresh={() => getActivityList(true)}
        onEndReached={() => getActivityList(false)}
        windowSize={50}
        maxToRenderPerBatch={10}
        initialNumToRender={20}
        ListEmptyComponent={<NoData message={t('You have no transactions.')} topDistance={pTd(160)} />}
      />
    </PageContainer>
  );
};

export default ActivityListPage;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
  },
  noResult: {},
});

interface ActivityListEntity {
  activityList: ActivityItemType[];
  skipCount: number;
  totalRecordCount: number;
}
