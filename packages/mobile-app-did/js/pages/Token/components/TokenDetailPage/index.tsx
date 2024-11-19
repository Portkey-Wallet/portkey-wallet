import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { styles } from './style';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';
import { FlashList } from '@shopify/flash-list';
import { TextL, TextS } from 'components/CommonText';
import { TokenItemShowType, ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getActivityListAsync } from '@portkey-wallet/store/store-ca/activity/action';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { IActivitiesApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import fonts from 'assets/theme/fonts';
import { sleep } from '@portkey-wallet/utils';
import BuyButton from 'components/BuyButton';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { useTokenInfoFromStore } from '@portkey-wallet/hooks/hooks-ca/assets';
import ActivityItem from 'components/ActivityItem';
import OutlinedButton from 'components/OutlinedButton';
import { FlatListFooterLoading } from 'components/FlatListFooterLoading';
import { ListLoadingEnum } from 'constants/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { pTd } from 'utils/unit';
import { useAppRampEntryShow } from 'hooks/ramp';
import { useGetAccountTokenList } from 'hooks/account';
import { SHOW_RAMP_SYMBOL_LIST } from '@portkey-wallet/constants/constants-ca/ramp';
import { useAppSwapButtonShow } from 'hooks/cms';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import FaucetButton from 'components/FaucetButton';
import { darkColors } from 'assets/theme';
import { showActivityDetail } from 'components/ActivityOverlay';

interface TokenDetailParams {
  tokenSection: ITokenSectionResponse;
  tokenInfo: TokenItemShowType;
}

const INIT_PAGE_INFO = {
  curPage: 0,
  total: 0,
};

const TokenDetailPage: React.FC<TokenDetailParams> = ({ tokenInfo, tokenSection }: TokenDetailParams) => {
  const { t } = useLanguage();
  const currentTokenInfo = useTokenInfoFromStore(tokenInfo.symbol, tokenInfo.chainId) || tokenInfo;
  const isMainnet = useIsMainnet();
  const caAddressInfos = useCaAddressInfoList();
  const dispatch = useAppCommonDispatch();
  const activity = useAppCASelector(state => state.activity);
  const defaultToken = useDefaultToken(tokenInfo.chainId);
  const { isSwapShow } = useAppSwapButtonShow();
  const { buy, swap } = checkEnabledFunctionalTypes(tokenInfo.symbol, tokenInfo.chainId === 'AELF');
  const { isRampShow } = useAppRampEntryShow();
  const getAccountTokenList = useGetAccountTokenList();
  const isBuyButtonShow = useMemo(
    () =>
      SHOW_RAMP_SYMBOL_LIST.includes(tokenInfo.symbol) &&
      tokenInfo.chainId === 'AELF' &&
      isRampShow &&
      isMainnet &&
      buy,
    [buy, isMainnet, isRampShow, tokenInfo.chainId, tokenInfo.symbol],
  );

  const isFaucetButtonShow = useMemo(
    () => !isMainnet && tokenInfo.symbol === defaultToken.symbol && tokenInfo.chainId === 'AELF',
    [defaultToken.symbol, isMainnet, tokenInfo.chainId, tokenInfo.symbol],
  );

  const balanceShow = useMemo(
    () =>
      `${formatTokenAmountShowWithDecimals(currentTokenInfo?.balance || '0', currentTokenInfo?.decimals)} ${
        currentTokenInfo.label || currentTokenInfo.symbol
      }`,
    [currentTokenInfo],
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
      if (!isInit && data?.length >= totalRecordCount) {
        return;
      }

      setIsLoading(isInit ? ListLoadingEnum.header : ListLoadingEnum.footer);
      const params: IActivitiesApiParams = {
        ...fixedParamObj,
        skipCount: isInit ? 0 : skipCount + maxResultCount,
        maxResultCount,
      };
      await dispatch(getActivityListAsync(params));
      setIsLoading(ListLoadingEnum.hide);
      if (!isInit) {
        await sleep(250);
      }
    },
    [currentActivity, dispatch, fixedParamObj],
  );

  const onRefreshList = useCallback(async () => {
    pageInfoRef.current = {
      ...INIT_PAGE_INFO,
    };
    getAccountTokenList(); // refresh all token list and balance
    await getActivityList(true);
  }, [getAccountTokenList, getActivityList]);

  const isInitRef = useRef(false);
  const init = useCallback(async () => {
    await sleep(250);
    await getActivityList(true);
    isInitRef.current = true;
  }, [getActivityList]);

  const buttonCount = useMemo(() => {
    let count = 3;
    if (isBuyButtonShow) {
      count++;
    }
    if (isSwapShow && swap) {
      count++;
    }
    // FaucetButton
    if (isFaucetButtonShow) {
      count++;
    }
    return count;
  }, [isBuyButtonShow, isFaucetButtonShow, isSwapShow, swap]);

  // const buttonGroupWrapStyle = useMemo(() => {
  //   if (buttonCount >= 5) {
  //     // styles
  //     return styles.buttonRow;
  //   } else {
  //     return GStyles.flexCenter;
  //   }
  // }, [buttonCount]);

  const buttonWrapStyle = useMemo(() => {
    if (buttonCount >= 5) {
      return {};
    } else {
      return styles.buttonWrapStyle1;
    }
  }, [buttonCount]);

  const renderItem = useCallback(({ item, index }: { item: ActivityItemType; index: number }) => {
    const preItem = currentActivityRef.current?.data[index - 1];
    return <ActivityItem preItem={preItem} item={item} index={index} onPress={() => showActivityDetail(item)} />;
  }, []);

  const isEmpty = useMemo(() => (currentActivity?.data || []).length === 0, [currentActivity?.data]);

  const amountTextOverflow = useMemo(() => {
    return balanceShow?.length > 18;
  }, [balanceShow]);

  const onReceivePress = useCallback(() => {
    console.log('tokenSection : ', tokenSection);
    navigationService.navigate('Receive', { tokenInfo: tokenSection, chainId: tokenInfo.chainId });
  }, []);

  const renderButtonItems = useCallback(() => {
    return (
      <View style={[styles.buttonGroupWrap]}>
        <SendButton themeType="innerPage" sentToken={currentTokenInfo} wrapStyle={buttonWrapStyle} />
        <ReceiveButton onPress={onReceivePress} />
        {isBuyButtonShow && <BuyButton wrapStyle={buttonWrapStyle} tokenInfo={tokenInfo} />}
        {isFaucetButtonShow && <FaucetButton themeType="innerPage" wrapStyle={buttonWrapStyle} />}
        {isSwapShow && swap && (
          <OutlinedButton
            title="Swap"
            iconName="swap"
            onPress={() => {
              navigationService.navigate('SwapHome');
            }}
          />
        )}
      </View>
    );
  }, [buttonWrapStyle, currentTokenInfo, isBuyButtonShow, isFaucetButtonShow, onReceivePress, tokenInfo]);

  const listHeader = useMemo(() => {
    return (
      <View style={styles.card}>
        <Text style={[styles.tokenBalance, amountTextOverflow ? styles.textOverflow : {}]}>{`${balanceShow}`}</Text>
        {isMainnet && currentTokenInfo?.balanceInUsd && (
          <TextS style={[styles.dollarBalance]}>{formatAmountUSDShow(currentTokenInfo?.balanceInUsd)}</TextS>
        )}
        {renderButtonItems()}
        {currentActivity?.data?.length && (
          <View>
            <TextL style={[{ color: darkColors.textBase1, fontSize: pTd(20) }, styles.listFront, fonts.BGMediumFont]}>
              {'Activity'}
            </TextL>
          </View>
        )}
      </View>
    );
  }, []);

  const renderActivityList = useCallback(() => {
    return (
      <FlashList
        style={styles.list}
        refreshing={isLoading === ListLoadingEnum.header}
        data={currentActivity?.data || []}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={
          <>
            {isLoading === ListLoadingEnum.hide && (
              <View style={styles.noData}>
                <TextL>{t('No activity')}</TextL>
              </View>
            )}
          </>
        }
        renderItem={renderItem}
        onRefresh={onRefreshList}
        onEndReached={() => {
          if (!isInitRef.current) {
            return;
          }
          getActivityList();
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListHeaderComponent={listHeader}
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
    );
  }, [currentActivity?.data, getActivityList, init, isEmpty, isLoading, onRefreshList, renderItem, t]);

  return <View style={styles.pageWrap}>{renderActivityList()}</View>;
};

export default TokenDetailPage;
