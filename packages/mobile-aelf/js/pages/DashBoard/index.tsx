import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NestedScrollView, NestedScrollViewHeader } from '@sdcx/nested-scroll';
import { PullToRefresh } from '@sdcx/pull-to-refresh';
import CustomPullToRefreshHeader from './PullToRefresh';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import DashBoardHeader from './Header';
import SafeAreaBox from 'components/SafeAreaBox';
import { RootStackName } from 'navigation';
import myEvents from 'utils/deviceEvent';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useReferral } from '@portkey-wallet/hooks/hooks-eoa/referral';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-eoa/assets';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import { useAccountTokenInfo, useAccountNFTCollectionInfo } from '@portkey-wallet/hooks/hooks-eoa/assets';
import { useLatestRef } from '@portkey-wallet/hooks';
import { formatAmountUSDShow } from '@portkey-wallet/utils/converter';
// import { useInitCmsBanner } from '@portkey-wallet/hooks/hooks-eoa/cms/banner';
// import { useDiscoverData } from '@portkey-wallet/hooks/hooks-eoa/cms/discover';
import { useTheme } from '@rneui/themed';
import {
  PAGE_SIZE_IN_ACCOUNT_TOKEN,
  PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
} from '@portkey-wallet/constants/constants-eoa/assets';
import { useCurrentAddressInfos } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useIsMainnet } from 'hooks/useNetwork';

const DashBoard: React.FC<any> = ({ navigation }) => {
  const { theme } = useTheme();
  const isMainnet = useIsMainnet();
  const addressInfos = useCurrentAddressInfos();
  console.log('addressInfos===', addressInfos);
  const addressInfosList = useLatestRef(addressInfos);
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  // const { getViewReferralStatusStatus, getReferralLink } = useReferral();
  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const { fetchAccountTokenInfoList } = useAccountTokenInfo();
  const { fetchAccountNFTCollectionInfoList } = useAccountNFTCollectionInfo();
  const accountBalanceUSD = useAccountBalanceUSD();
  // const { fetchDiscoverTabAsync } = useDiscoverData();
  // const { theme } = useTheme();
  // useInitCmsBanner();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('refresh====!!!');
    myEvents.refreshHomeListStart.emit();
    setRefreshing(true);
    getTokenPrice();
    console.log('wfs====fetchAccountNFTCollectionInfoList1');
    await Promise.all([
      fetchAccountTokenInfoList({
        addressInfos: addressInfosList.current || [],
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      }),
      fetchAccountNFTCollectionInfoList({
        addressInfos: addressInfosList.current || [],
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
      }),
    ]);
    myEvents.refreshHomeList.emit();
    setRefreshing(false);
  }, [addressInfosList, fetchAccountTokenInfoList, fetchAccountNFTCollectionInfoList, getTokenPrice]);

  const navToBottomTab = useCallback(
    (tabName: RootStackName, params: any) => {
      if (navigation && navigation.jumpTo) {
        navigation.jumpTo(tabName, params);
      }
    },
    [navigation],
  );

  useEffectOnce(() => {
    reportAnalyticsEvent({ message: 'DashBoard' });
    // getViewReferralStatusStatus();
    // getReferralLink();
    // fetchDiscoverTabAsync();
  });

  // nav's to target tab
  useEffect(() => {
    const listener = myEvents.navToBottomTab.addListener(({ tabName, params }) => navToBottomTab(tabName, params));
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = useMemo(
    () => (isMainnet ? formatAmountUSDShow(accountBalanceUSD) : 'Dev Mode'),
    [isMainnet, accountBalanceUSD],
  );

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: theme.colors.bgBase1 }}>
      <DashBoardHeader />
      {React.cloneElement(
        <PullToRefresh header={<CustomPullToRefreshHeader refreshing={refreshing} onRefresh={onRefresh} />} />,
        {
          children: (
            <NestedScrollView>
              {React.cloneElement(<NestedScrollViewHeader />, {
                children: <Card title={title} />,
              })}
              <DashBoardTab />
            </NestedScrollView>
          ),
        },
      )}
    </SafeAreaBox>
  );
};

export default DashBoard;
