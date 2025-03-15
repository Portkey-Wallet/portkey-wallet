import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { RefreshControl, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { getActivityListAsync } from '@portkey-wallet/store/store-eoa/activity/action';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useActivity } from '@portkey-wallet/hooks/hooks-eoa/activity';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-eoa/activity/type';
import { useCurrentAddressInfos, useUniqueIdentify } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { ActivityItemType } from '@portkey-wallet/types/types-eoa/activity';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-eoa/activity';
import ActivityItem from 'components/ActivityItem';
import { sleep } from '@portkey-wallet/utils';
import { FlatListFooterLoading } from 'components/FlatListFooterLoading';
import { ListLoadingEnum } from 'constants/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { FlashList } from '@shopify/flash-list';
import { showActivityDetail } from 'components/ActivityOverlay';
import { makeStyles, useTheme } from '@rneui/themed';
import { TextH1, TextL } from 'components/CommonText';
import SafeAreaBox from 'components/SafeAreaBox';
import LottieLoading from 'components/LottieLoading';
import GStyles from 'assets/theme/GStyles';
import CustomPullToRefreshHeader from 'pages/DashBoard/PullToRefresh';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

interface RouterParams {
  chainId?: string;
  symbol?: string;
}

const ActivityListPage = () => {
  const { chainId, symbol } = useRouterParams<RouterParams>();
  const { t } = useLanguage();
  const identify = useUniqueIdentify();
  const dispatch = useAppCommonDispatch();
  const addressInfos = useCurrentAddressInfos();
  const activity = useActivity();
  const currentActivity = useMemo(
    () => activity?.activityMap?.[identify]?.[getCurrentActivityMapKey(chainId, symbol)],
    [activity?.activityMap, chainId, symbol, identify],
  );
  const currentActivityRef = useRef(currentActivity);
  currentActivityRef.current = currentActivity;
  const styles = getStyles();
  const [isLoading, setIsLoading] = useState(ListLoadingEnum.header);
  const { theme } = useTheme();
  const getActivityList = useLockCallback(
    async (isInit: boolean) => {
      const { skipCount = 0, hasNextPage = true } = currentActivity || {};
      const maxResultCount = 30;
      if (!isInit && !hasNextPage) {
        return;
      }

      setIsLoading(isInit ? ListLoadingEnum.header : ListLoadingEnum.footer);
      const params: IActivitiesApiParams = {
        maxResultCount: maxResultCount,
        skipCount: isInit ? 0 : skipCount + maxResultCount,
        addressInfos,
        // managerAddresses: address,
        chainId: chainId,
        symbol: symbol,
        identify,
      };

      await dispatch(getActivityListAsync(params));
      setIsLoading(ListLoadingEnum.hide);
      if (!isInit) {
        await sleep(250);
      }
    },
    [addressInfos, chainId, currentActivity, dispatch, symbol, identify],
  );

  const isInitRef = useRef(false);
  const init = useCallback(async () => {
    await sleep(250);
    await getActivityList(true);
    isInitRef.current = true;
  }, [getActivityList]);
  useEffect(() => {
    init();
  }, [identify]);
  const renderItem = useCallback(({ item, index }: { item: ActivityItemType; index: number }) => {
    const preItem = currentActivityRef.current?.data[index - 1];
    return <ActivityItem preItem={preItem} item={item} index={index} onPress={() => showActivityDetail(item)} />;
  }, []);

  const isEmpty = useMemo(() => (currentActivity?.data || []).length === 0, [currentActivity?.data]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={styles.pageWrap}>
      <FlashList
        ListHeaderComponent={
          <>
            {isIOS ? (
              <></>
            ) : (
              isLoading === ListLoadingEnum.header && (
                <View style={{ marginBottom: pTd(24) }}>
                  <LottieLoading style={{ width: pTd(32) }} />
                </View>
              )
            )}
            <View style={styles.title}>
              <TextH1>{t('Activity')}</TextH1>
            </View>
          </>
        }
        refreshControl={
          isIOS ? (
            <CustomPullToRefreshHeader
              refreshing={isLoading === ListLoadingEnum.header}
              onRefresh={() => getActivityList(true)}
            />
          ) : (
            <RefreshControl
              progressBackgroundColor={'transparent'}
              refreshing={isLoading === ListLoadingEnum.header}
              onRefresh={() => getActivityList(true)}
            />
          )
        }
        data={currentActivity?.data || []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={
          <>
            {isLoading === ListLoadingEnum.hide && (
              <View style={[GStyles.flexRow, GStyles.alignCenter, { marginTop: pTd(96) }]}>
                <TextL style={{ color: theme.colors.textBase2 }}>{t('No activity')}</TextL>
              </View>
            )}
          </>
        }
        renderItem={renderItem}
        onEndReached={() => {
          if (!isInitRef.current) {
            return;
          }
          getActivityList(false);
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListFooterComponent={
          <>{!isEmpty && <FlatListFooterLoading refreshing={isLoading === ListLoadingEnum.footer} />}</>
        }
        onLoad={() => {
          if (isInitRef.current) {
            return;
          }
          init();
        }}
      />
    </SafeAreaBox>
  );
};

export default ActivityListPage;

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    backgroundColor: theme.colors.bgBase1,
  },
  title: {
    height: pTd(40),
    textAlign: 'center',
    paddingLeft: pTd(16),
    marginTop: pTd(8),
  },
}));
