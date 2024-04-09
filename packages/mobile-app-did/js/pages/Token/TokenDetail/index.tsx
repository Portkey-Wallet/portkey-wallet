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
import { FlashList } from '@shopify/flash-list';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextXL } from 'components/CommonText';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import fonts from 'assets/theme/fonts';
import { formatChainInfoToShow, sleep } from '@portkey-wallet/utils';
import BuyButton from 'components/BuyButton';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import FaucetButton from 'components/FaucetButton';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useAppETransShow } from 'hooks/cms';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import { ETransTokenList } from '@portkey-wallet/constants/constants-ca/dapp';
import CommonToolButton from 'components/CommonToolButton';
import { DepositModalMap, useOnDisclaimerModalPress } from 'hooks/deposit';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import { useAppRampEntryShow } from 'hooks/ramp';
import { SHOW_RAMP_SYMBOL_LIST } from '@portkey-wallet/constants/constants-ca/ramp';
import { useTokenInfoFromStore } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { PAGE_SIZE_IN_ACCOUNT_TOKEN } from '@portkey-wallet/constants/constants-ca/assets';
import ActivityItem from 'components/ActivityItem';
import { FlatListFooterLoading } from 'components/FlatListFooterLoading';
import { ListLoadingEnum } from 'constants/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useBalance } from '@portkey-wallet/hooks/hooks-ca/balances';

interface RouterParams {
  tokenInfo: TokenItemShowType;
}

const INIT_PAGE_INFO = {
  curPage: 0,
  total: 0,
};

const TokenDetail: React.FC = () => {
  const { t } = useLanguage();
  const { tokenInfo } = useRouterParams<RouterParams>();
  const { getAndUpdateTargetBalance } = useBalance();
  const { isETransDepositShow, isETransWithdrawShow } = useAppETransShow();
  const defaultToken = useDefaultToken();
  const currentTokenInfo = useTokenInfoFromStore(tokenInfo.symbol, tokenInfo.chainId);
  const isMainnet = useIsMainnet();
  const caAddressInfos = useCaAddressInfoList();
  const navigation = useNavigation();
  const dispatch = useAppCommonDispatch();
  const activity = useAppCASelector(state => state.activity);
  const { isRampShow } = useAppRampEntryShow();
  const { fetchAccountTokenInfoList } = useAccountTokenInfo();

  const balanceShow = useMemo(
    () => `${formatTokenAmountShowWithDecimals(currentTokenInfo?.balance || '0', currentTokenInfo?.decimals)}`,
    [currentTokenInfo?.balance, currentTokenInfo?.decimals],
  );

  const currentActivity = useMemo(
    () => activity?.activityMap?.[getCurrentActivityMapKey(tokenInfo.chainId, tokenInfo.symbol)],
    [activity?.activityMap, tokenInfo.chainId, tokenInfo.symbol],
  );
  const currentActivityRef = useRef(currentActivity);
  currentActivityRef.current = currentActivity;

  const fixedParamObj = useMemo(
    () => ({
      caAddressInfos: caAddressInfos.filter(ele => ele.chainId === tokenInfo.chainId),
      symbol: tokenInfo.symbol,
      chainId: tokenInfo.chainId,
    }),
    [caAddressInfos, tokenInfo.chainId, tokenInfo.symbol],
  );
  const pageInfoRef = useRef({
    ...INIT_PAGE_INFO,
  });

  const [isLoading, setIsLoading] = useState(ListLoadingEnum.hide);
  const getActivityList = useLockCallback(
    async (isInit = false) => {
      const maxResultCount = 20;
      const { data = [], skipCount = 0, totalRecordCount = 0 } = currentActivity || {};
      if (!isInit && data?.length >= totalRecordCount) return;

      setIsLoading(isInit ? ListLoadingEnum.header : ListLoadingEnum.footer);
      const params: IActivitiesApiParams = {
        ...fixedParamObj,
        skipCount: isInit ? 0 : skipCount + maxResultCount,
        maxResultCount,
      };
      await dispatch(getActivityListAsync(params));
      setIsLoading(ListLoadingEnum.hide);
      if (!isInit) await sleep(250);
    },
    [currentActivity, dispatch, fixedParamObj],
  );

  const onRefreshList = useCallback(async () => {
    pageInfoRef.current = {
      ...INIT_PAGE_INFO,
    };
    getAndUpdateTargetBalance(tokenInfo.chainId, tokenInfo.symbol);
    await getActivityList(true);
  }, [getActivityList, getAndUpdateTargetBalance, tokenInfo.chainId, tokenInfo.symbol]);

  const init = useCallback(async () => {
    await sleep(100);
    getActivityList(true);
  }, [getActivityList]);

  useEffectOnce(() => {
    init();
  });

  // refresh token List
  useEffectOnce(() => {
    fetchAccountTokenInfoList({
      caAddressInfos,
      skipCount: 0,
      maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
    });
  });

  const isBuyButtonShow = useMemo(
    () => SHOW_RAMP_SYMBOL_LIST.includes(tokenInfo.symbol) && tokenInfo.chainId === 'AELF' && isRampShow,
    [isRampShow, tokenInfo.chainId, tokenInfo.symbol],
  );

  const isFaucetButtonShow = useMemo(
    () => !isMainnet && tokenInfo.symbol === defaultToken.symbol && tokenInfo.chainId === 'AELF',
    [defaultToken.symbol, isMainnet, tokenInfo.chainId, tokenInfo.symbol],
  );

  const isETransToken = useMemo(() => ETransTokenList.includes(tokenInfo.symbol), [tokenInfo.symbol]);

  const isDepositShow = useMemo(() => isETransToken && isETransDepositShow, [isETransToken, isETransDepositShow]);
  const isWithdrawShow = useMemo(() => isETransToken && isETransWithdrawShow, [isETransToken, isETransWithdrawShow]);
  const { eTransferUrl } = useCurrentNetworkInfo();
  const onDisclaimerModalPress = useOnDisclaimerModalPress();
  const buttonCount = useMemo(() => {
    let count = 3;
    if (isBuyButtonShow) count++;
    if (isDepositShow) count++;
    if (isWithdrawShow) count++;
    // FaucetButton
    if (isFaucetButtonShow) count++;
    return count;
  }, [isBuyButtonShow, isDepositShow, isFaucetButtonShow, isWithdrawShow]);
  console.log(buttonCount, '====buttonCount');

  const buttonGroupWrapStyle = useMemo(() => {
    if (buttonCount >= 5) {
      // styles
      return styles.buttonRow;
    } else {
      return GStyles.flexCenter;
    }
  }, [buttonCount]);

  const buttonWrapStyle = useMemo(() => {
    if (buttonCount >= 5) {
      return {};
    } else {
      return styles.buttonWrapStyle1;
    }
  }, [buttonCount]);

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
        <Text style={styles.tokenBalance}>{`${balanceShow} ${currentTokenInfo?.symbol}`}</Text>
        {isMainnet && <Text style={styles.dollarBalance}>{formatAmountUSDShow(currentTokenInfo?.balanceInUsd)}</Text>}
        <View style={[styles.buttonGroupWrap, buttonGroupWrapStyle]}>
          {isBuyButtonShow && <BuyButton themeType="innerPage" wrapStyle={buttonWrapStyle} tokenInfo={tokenInfo} />}
          <SendButton themeType="innerPage" sentToken={currentTokenInfo} wrapStyle={buttonWrapStyle} />
          <ReceiveButton currentTokenInfo={currentTokenInfo} themeType="innerPage" wrapStyle={buttonWrapStyle} />
          {isFaucetButtonShow && <FaucetButton themeType="innerPage" wrapStyle={buttonWrapStyle} />}
          {isDepositShow && (
            <CommonToolButton
              title="Deposit"
              icon="deposit"
              onPress={() =>
                onDisclaimerModalPress(
                  DepositModalMap.depositUSDT,
                  stringifyETrans({
                    url: eTransferUrl || '',
                    query: {
                      tokenSymbol: tokenInfo?.symbol,
                      type: 'Deposit',
                      chainId: tokenInfo?.chainId,
                    },
                  }),
                )
              }
              themeType="innerPage"
              wrapStyle={buttonWrapStyle}
            />
          )}
          {isWithdrawShow && (
            <CommonToolButton
              title="Withdraw"
              icon="withdraw"
              onPress={() =>
                onDisclaimerModalPress(
                  DepositModalMap.withdrawUSDT,
                  stringifyETrans({
                    url: eTransferUrl || '',
                    query: {
                      tokenSymbol: tokenInfo?.symbol,
                      type: 'Withdraw',
                      chainId: tokenInfo?.chainId,
                    },
                  }),
                )
              }
              themeType="innerPage"
              wrapStyle={buttonWrapStyle}
            />
          )}
        </View>
      </View>

      <FlashList
        refreshing={isLoading === ListLoadingEnum.header}
        data={currentActivity?.data || []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={<NoData noPic message="You have no transactions." />}
        renderItem={renderItem}
        onRefresh={onRefreshList}
        onEndReached={() => {
          getActivityList();
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListFooterComponent={
          <>{!isEmpty && <FlatListFooterLoading refreshing={isLoading === ListLoadingEnum.footer} />}</>
        }
      />
    </PageContainer>
  );
};

export default TokenDetail;
