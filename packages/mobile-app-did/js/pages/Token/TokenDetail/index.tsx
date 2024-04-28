import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import PageContainer from 'components/PageContainer';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import { useLanguage } from 'i18n/hooks';
import { FlashList } from '@shopify/flash-list';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextL, TextS } from 'components/CommonText';
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
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import CommonToolButton from 'components/CommonToolButton';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { useTokenInfoFromStore } from '@portkey-wallet/hooks/hooks-ca/assets';
import ActivityItem from 'components/ActivityItem';
import { FlatListFooterLoading } from 'components/FlatListFooterLoading';
import { ListLoadingEnum } from 'constants/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useBalance } from '@portkey-wallet/hooks/hooks-ca/balances';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import { pTd } from 'utils/unit';
import { useAppRampEntryShow } from 'hooks/ramp';
import { SHOW_RAMP_SYMBOL_LIST } from '@portkey-wallet/constants/constants-ca/ramp';
import { ETransTokenList } from '@portkey-wallet/constants/constants-ca/dapp';
import { useAppETransShow } from 'hooks/cms';
import { DepositModalMap, useOnDisclaimerModalPress } from 'hooks/deposit';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import CommonAvatar from 'components/CommonAvatar';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import FaucetButton from 'components/FaucetButton';

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
  const currentTokenInfo = useTokenInfoFromStore(tokenInfo.symbol, tokenInfo.chainId) || tokenInfo;
  const isMainnet = useIsMainnet();
  const caAddressInfos = useCaAddressInfoList();
  const navigation = useNavigation();
  const dispatch = useAppCommonDispatch();
  const activity = useAppCASelector(state => state.activity);
  const defaultToken = useDefaultToken();
  const { eTransferUrl = '', awakenUrl = 'https://awaken.finance/' } = useCurrentNetworkInfo();
  const { isETransDepositShow } = useAppETransShow();
  const onDisclaimerModalPress = useOnDisclaimerModalPress();
  const { buy, swap, deposit } = checkEnabledFunctionalTypes(tokenInfo.symbol, tokenInfo.chainId === 'AELF');
  const { isRampShow } = useAppRampEntryShow();
  const isBuyButtonShow = useMemo(
    () => SHOW_RAMP_SYMBOL_LIST.includes(tokenInfo.symbol) && tokenInfo.chainId === 'AELF' && isRampShow && buy,
    [buy, isRampShow, tokenInfo.chainId, tokenInfo.symbol],
  );
  const isETransToken = useMemo(() => ETransTokenList.includes(tokenInfo.symbol), [tokenInfo.symbol]);
  const isDepositShow = useMemo(
    () => isETransToken && isETransDepositShow && deposit,
    [isETransToken, isETransDepositShow, deposit],
  );
  const isFaucetButtonShow = useMemo(
    () => !isMainnet && tokenInfo.symbol === defaultToken.symbol && tokenInfo.chainId === 'AELF',
    [defaultToken.symbol, isMainnet, tokenInfo.chainId, tokenInfo.symbol],
  );

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
  const symbolImages = useSymbolImages();

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

  const iconImg = useMemo(() => {
    return tokenInfo?.imageUrl ?? symbolImages[tokenInfo?.symbol] ?? '';
  }, [symbolImages, tokenInfo?.imageUrl, tokenInfo?.symbol]);

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

  const isInitRef = useRef(false);
  const init = useCallback(async () => {
    await sleep(250);
    await getActivityList(true);
    isInitRef.current = true;
  }, [getActivityList]);

  const buttonCount = useMemo(() => {
    let count = 3;
    if (isBuyButtonShow) count++;
    if (isDepositShow) count++;
    if (swap) count++;
    // FaucetButton
    if (isFaucetButtonShow) count++;
    return count;
  }, [isBuyButtonShow, isDepositShow, isFaucetButtonShow, swap]);

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

  const amountTextOverflow = useMemo(() => {
    return balanceShow?.length > 18;
  }, [balanceShow]);

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('')}
      titleDom={
        <View>
          <View style={styles.mainTitleLine}>
            <CommonAvatar
              hasBorder
              style={styles.mainTitleIcon}
              title={tokenInfo.symbol}
              avatarSize={pTd(18)}
              svgName={tokenInfo?.symbol === defaultToken.symbol ? 'testnet' : undefined}
              imageUrl={iconImg}
              titleStyle={Object.assign({}, FontStyles.font11, { fontSize: pTd(12) })}
              borderStyle={GStyles.hairlineBorder}
            />
            <TextL style={[GStyles.textAlignCenter, FontStyles.font16, fonts.mediumFont]}>{tokenInfo.symbol}</TextL>
          </View>
          <TextS style={[GStyles.textAlignCenter, FontStyles.font11, styles.subTitle]}>
            {formatChainInfoToShow(tokenInfo.chainId)}
          </TextS>
        </View>
      }
      safeAreaColor={['white']}
      leftCallback={() => navigation.goBack()}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.card}>
        <Text style={[styles.tokenBalance, amountTextOverflow ? styles.textOverflow : {}]}>{`${balanceShow}`}</Text>
        {isMainnet && (
          <TextS style={[styles.dollarBalance]}>{formatAmountUSDShow(currentTokenInfo?.balanceInUsd)}</TextS>
        )}
        <View style={[styles.buttonGroupWrap, buttonGroupWrapStyle]}>
          <SendButton themeType="innerPage" sentToken={currentTokenInfo} wrapStyle={buttonWrapStyle} />
          <ReceiveButton currentTokenInfo={currentTokenInfo} themeType="innerPage" wrapStyle={buttonWrapStyle} />
          {buy && isMainnet && <BuyButton themeType="innerPage" wrapStyle={buttonWrapStyle} tokenInfo={tokenInfo} />}
          {isFaucetButtonShow && <FaucetButton themeType="innerPage" wrapStyle={buttonWrapStyle} />}
          {swap && (
            <CommonToolButton
              title="Swap"
              icon="swap"
              onPress={() => {
                onDisclaimerModalPress(
                  DepositModalMap.aWakenSwap,
                  stringifyETrans({
                    url: `${awakenUrl}/trading/ELF_USDT_0.05` || '',
                  }),
                );
              }}
              themeType="innerPage"
              wrapStyle={buttonWrapStyle}
            />
          )}
          {deposit && (
            <CommonToolButton
              title="Deposit"
              icon="deposit"
              onPress={() =>
                onDisclaimerModalPress(
                  DepositModalMap.eTransfer,
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
        </View>
      </View>

      <FlashList
        refreshing={isLoading === ListLoadingEnum.header}
        data={currentActivity?.data || []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={
          <NoData
            icon={'no-data-detail'}
            message={t('You have no transactions')}
            topDistance={pTd(40)}
            oblongSize={[pTd(64), pTd(64)]}
          />
        }
        renderItem={renderItem}
        onRefresh={onRefreshList}
        onEndReached={() => {
          if (!isInitRef.current) return;
          getActivityList();
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListHeaderComponent={
          <View style={styles.divide}>
            <TextL style={[FontStyles.font16, styles.listFront]}>{'Activity'}</TextL>
          </View>
        }
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

export default TokenDetail;
