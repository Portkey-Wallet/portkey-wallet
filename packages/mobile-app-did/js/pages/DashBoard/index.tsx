import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NestedScrollView, NestedScrollViewHeader } from '@sdcx/nested-scroll';
import { PullToRefresh } from '@sdcx/pull-to-refresh';
import CustomPullToRefreshHeader from './PullToRefresh';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import { SetNewWalletNamePopup } from './SetNewWalletName/Popup';
import DashBoardHeader from './Header';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { RootStackName } from 'navigation';
import myEvents from 'utils/deviceEvent';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useReportingSignalR } from 'hooks/FCM';
import { useManagerExceedTipModal } from 'hooks/managerCheck';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useAccountTokenInfo, useAccountNFTCollectionInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import { useInitCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import {
  PAGE_SIZE_IN_ACCOUNT_TOKEN,
  PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
} from '@portkey-wallet/constants/constants-ca/assets';

const DashBoard: React.FC<any> = ({ navigation }) => {
  const isMainnet = useIsMainnet();
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  const { getViewReferralStatusStatus, getReferralLink } = useReferral();
  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const { fetchAccountTokenInfoList } = useAccountTokenInfo();
  const { fetchAccountNFTCollectionInfoList } = useAccountNFTCollectionInfo();
  const caAddressInfos = useCaAddressInfoList();
  const caAddressInfosList = useLatestRef(caAddressInfos);
  const managerExceedTipModalCheck = useManagerExceedTipModal();
  const accountBalanceUSD = useAccountBalanceUSD();
  const { fetchDiscoverTabAsync } = useDiscoverData();
  useInitCmsBanner();
  useReportingSignalR();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getTokenPrice();
    await Promise.all([
      fetchAccountTokenInfoList({
        caAddressInfos: caAddressInfosList.current || [],
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      }),
      fetchAccountNFTCollectionInfoList({
        caAddressInfos,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
      }),
    ]);
    setRefreshing(false);
  }, [caAddressInfos, caAddressInfosList, fetchAccountNFTCollectionInfoList, fetchAccountTokenInfoList, getTokenPrice]);

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
    managerExceedTipModalCheck();
    getViewReferralStatusStatus();
    getReferralLink();
    fetchDiscoverTabAsync();
  });

  // nav's to chat tab
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
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg43]}>
      <DashBoardHeader />
      <SetNewWalletNamePopup />
      <PullToRefresh header={<CustomPullToRefreshHeader refreshing={refreshing} onRefresh={onRefresh} />}>
        <NestedScrollView>
          {React.cloneElement(<NestedScrollViewHeader />, {
            children: <Card title={title} />,
          })}
          <DashBoardTab />
        </NestedScrollView>
      </PullToRefresh>
    </SafeAreaBox>
  );
};

export default DashBoard;
