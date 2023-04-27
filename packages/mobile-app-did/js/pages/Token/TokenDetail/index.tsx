import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import PageContainer from 'components/PageContainer';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import useEffectOnce from 'hooks/useEffectOnce';

import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import { useLanguage } from 'i18n/hooks';
import TransferItem from 'components/TransferList/components/TransferItem';
import { FlashList } from '@shopify/flash-list';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextXL } from 'components/CommonText';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCaAddressInfoList, useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { transactionTypesForActivityList as transactionList } from '@portkey-wallet/constants/constants-ca/activity';
import fonts from 'assets/theme/fonts';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import BuyButton from 'components/BuyButton';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useGetCurrentAccountTokenPrice, useIsTokenHasPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useIsShowBuy } from 'hooks/useSwitchBuy';

interface RouterParams {
  tokenInfo: TokenItemShowType;
}

const INIT_PAGE_INFO = {
  curPage: 0,
  total: 0,
  isLoading: false,
};

const TokenDetail: React.FC = () => {
  const { t } = useLanguage();
  const { tokenInfo } = useRouterParams<RouterParams>();

  const isTestnet = useIsTestnet();
  const currentWallet = useCurrentWallet();
  const isShowBuy = useIsShowBuy();
  const caAddressInfos = useCaAddressInfoList();
  const navigation = useNavigation();
  const dispatch = useAppCommonDispatch();
  const activity = useAppCASelector(state => state.activity);
  const { accountToken } = useAppCASelector(state => state.assets);
  const isTokenHasPrice = useIsTokenHasPrice(tokenInfo.symbol);
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();

  const [reFreshing, setFreshing] = useState(false);

  const currentActivity = useMemo(
    () => activity?.activityMap?.[getCurrentActivityMapKey(tokenInfo.chainId, tokenInfo.symbol)] ?? {},
    [activity?.activityMap, tokenInfo.chainId, tokenInfo.symbol],
  );

  const currentToken = useMemo(() => {
    return accountToken.accountTokenList.find(
      ele => ele.symbol === tokenInfo.symbol && ele.chainId === tokenInfo.chainId,
    );
  }, [accountToken.accountTokenList, tokenInfo.chainId, tokenInfo.symbol]);

  const fixedParamObj = useMemo(
    () => ({
      caAddressInfos: caAddressInfos.filter(ele => ele.chainId === tokenInfo.chainId),
      caAddresses: [currentWallet.walletInfo[tokenInfo.chainId]?.caAddress || ''],
      transactionTypes: transactionList,
      symbol: tokenInfo.symbol,
      chainId: tokenInfo.chainId,
    }),
    [caAddressInfos, currentWallet.walletInfo, tokenInfo.chainId, tokenInfo.symbol],
  );
  const pageInfoRef = useRef({
    ...INIT_PAGE_INFO,
  });

  const getActivityList = useCallback(
    async (isInit = false) => {
      const { data, maxResultCount = 10, skipCount = 0, totalRecordCount = 0 } = currentActivity || {};
      if (!isInit && data?.length >= totalRecordCount) return;
      if (pageInfoRef.current.isLoading) return;
      pageInfoRef.current.isLoading = true;
      const params: IActivitiesApiParams = {
        ...fixedParamObj,
        skipCount: isInit ? 0 : skipCount + maxResultCount,
        maxResultCount,
      };
      await dispatch(getActivityListAsync(params));
      pageInfoRef.current.isLoading = false;
    },
    [currentActivity, dispatch, fixedParamObj],
  );

  const onRefreshList = useCallback(async () => {
    pageInfoRef.current = {
      ...INIT_PAGE_INFO,
    };
    setFreshing(true);
    getTokenPrice(tokenInfo?.symbol);
    await getActivityList(true);
    setFreshing(false);
  }, [getActivityList, getTokenPrice, tokenInfo?.symbol]);

  const balanceShow = useMemo(
    () => `${formatAmountShow(divDecimals(currentToken?.balance || '0', currentToken?.decimals))}`,
    [currentToken?.balance, currentToken?.decimals],
  );

  useEffectOnce(() => {
    getActivityList(true);
  });

  // refresh token List
  useEffectOnce(() => {
    dispatch(fetchTokenListAsync({ caAddresses: currentWallet.walletInfo.caAddressList || [], caAddressInfos }));
  });

  const isBuyButtonShow = useMemo(
    () => tokenInfo.symbol === ELF_SYMBOL && tokenInfo.chainId === 'AELF' && isShowBuy,
    [isShowBuy, tokenInfo.chainId, tokenInfo.symbol],
  );

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('')}
      titleDom={
        <View>
          <TextXL style={[GStyles.textAlignCenter, FontStyles.font2, fonts.mediumFont]}>{tokenInfo.symbol}</TextXL>
          <Text style={[GStyles.textAlignCenter, FontStyles.font2, styles.subTitle]}>
            {formatChainInfoToShow(tokenInfo.chainId)}
          </Text>
        </View>
      }
      safeAreaColor={['blue', 'white']}
      leftCallback={() => navigation.goBack()}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.card}>
        <Text style={styles.tokenBalance}>{`${balanceShow} ${currentToken?.symbol}`}</Text>
        {!isTestnet && isTokenHasPrice && (
          <Text style={styles.dollarBalance}>{`$ ${formatAmountShow(
            divDecimals(currentToken?.balance, currentToken?.decimals).multipliedBy(
              currentToken ? tokenPriceObject?.[currentToken?.symbol] : 0,
            ),
            2,
          )}`}</Text>
        )}
        <View style={[styles.buttonGroupWrap, !isBuyButtonShow && styles.buttonShortGroupWrap]}>
          {isBuyButtonShow && <BuyButton themeType="innerPage" />}
          <SendButton themeType="innerPage" sentToken={currentToken} />
          <ReceiveButton currentTokenInfo={currentToken} themeType="innerPage" receiveButton={currentToken} />
        </View>
      </View>

      <FlashList
        refreshing={reFreshing}
        data={currentActivity?.data || []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={<NoData noPic message="You have no transactions." />}
        renderItem={({ item }: { item: ActivityItemType }) => {
          return <TransferItem item={item} onPress={() => navigationService.navigate('ActivityDetail', item)} />;
        }}
        onRefresh={() => {
          onRefreshList();
        }}
        onEndReached={() => {
          getActivityList();
        }}
      />
    </PageContainer>
  );
};

export default TokenDetail;
