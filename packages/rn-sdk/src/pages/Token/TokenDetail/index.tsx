import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import BuyButton from 'components/BuyButton';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import FaucetButton from 'components/FaucetButton';
import NoData from '@portkey-wallet/rn-components/components/NoData';
import TransferItem from 'components/TransferList/components/TransferItem';
import SafeAreaBox from '@portkey-wallet/rn-components/components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { useLanguage } from 'i18n/hooks';
import { TextXL } from '@portkey-wallet/rn-components/components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { styles } from './style';
import fonts from 'assets/theme/fonts';
import useBaseContainer from 'model/container/UseBaseContainer';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import useEffectOnce from 'hooks/useEffectOnce';
import { NetworkController } from 'network/controller';
import { useCurrentNetworkType } from 'model/hooks/network';
import { useCommonNetworkInfo } from 'components/TokenOverlay/hooks';
import { TokenPriceItem } from 'network/dto/token';
import { useAccountTokenBalanceList } from 'model/hooks/balance';
import { ActivityItemType } from 'network/dto/query';
import { PortkeyEntries } from 'config/entries';
import { getUnlockedWallet, useUnlockedWallet } from 'model/wallet';
import { useSDKRampEntryShow } from 'pages/Ramp/RampPreview/hook';

interface TokenDetailPageProps {
  tokenInfo: TokenItemShowType;
}

const INIT_PAGE_INFO = {
  curPage: 0,
  total: 0,
  isLoading: false,
};

const TokenDetail = ({ tokenInfo }: TokenDetailPageProps) => {
  const { t } = useLanguage();
  const { onFinish, navigateTo } = useBaseContainer({});
  const isMainnet = useCurrentNetworkType() === 'MAINNET';
  const { defaultToken } = useCommonNetworkInfo();
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const { balanceList } = useAccountTokenBalanceList();
  const [reFreshing, setFreshing] = useState(false);
  const currentToken = useMemo(() => {
    return balanceList.find(ele => ele.symbol === tokenInfo.symbol && ele.chainId === tokenInfo.chainId);
  }, [balanceList, tokenInfo.chainId, tokenInfo.symbol]);
  const [currentActivity, setCurrentActivity] = useState<ActivityListEntity>({
    activityList: [],
    skipCount: 0,
    totalRecordCount: 0,
  });

  useEffectOnce(() => {
    getTokenPrice();
    getActivityList(true);
  });

  const getTokenPrice = useCallback(async () => {
    const tokenPrices = await NetworkController.fetchTokenPrices([tokenInfo.symbol]);
    if (tokenPrices.items) {
      const tokenPriceObject = tokenPrices.items.find((item: TokenPriceItem) => item.symbol === tokenInfo.symbol);
      if (tokenPriceObject) {
        setTokenPrice(tokenPriceObject.priceInUsd);
      }
    }
  }, [tokenInfo.symbol]);

  const getActivityList = useCallback(
    async (isInit = false) => {
      const instantWallet = await getUnlockedWallet({ getMultiCaAddresses: true });
      if (!instantWallet || !instantWallet.address) return;
      const { activityList = [], skipCount = 0, totalRecordCount: totalRecord = 0 } = currentActivity;
      if (!isInit && activityList?.length >= totalRecord) return;
      if (pageInfoRef.current.isLoading) return;
      pageInfoRef.current.isLoading = true;
      const maxResultCount = 10;
      const { multiCaAddresses, address } = instantWallet;
      const caAddressInfos = Object.entries(multiCaAddresses)
        .map(it => {
          return { chainId: it[0], caAddress: it[1] };
        })
        .filter(it => {
          return it.chainId === tokenInfo.chainId;
        });
      const { data, totalRecordCount } = await NetworkController.getRecentActivities({
        caAddressInfos: caAddressInfos,
        managerAddresses: [address],
        chainId: tokenInfo.chainId,
        symbol: tokenInfo.symbol,
        skipCount: isInit ? 0 : skipCount,
        maxResultCount,
      });
      setCurrentActivity({
        activityList: isInit ? data : activityList.concat(data),
        skipCount: (isInit ? 0 : skipCount) + maxResultCount,
        totalRecordCount,
      });
      pageInfoRef.current.isLoading = false;
    },
    [currentActivity, tokenInfo.chainId, tokenInfo.symbol],
  );

  const pageInfoRef = useRef({
    ...INIT_PAGE_INFO,
  });

  const onRefreshList = useCallback(async () => {
    pageInfoRef.current = {
      ...INIT_PAGE_INFO,
    };
    setFreshing(true);
    getTokenPrice();
    await getActivityList(true);
    setFreshing(false);
  }, [getActivityList, getTokenPrice]);

  const isTokenHasPrice = useMemo(() => {
    return tokenPrice > 0;
  }, [tokenPrice]);

  const balanceShow = useMemo(
    () => `${formatAmountShow(divDecimals(currentToken?.balance || '0', currentToken?.decimals))}`,
    [currentToken?.balance, currentToken?.decimals],
  );

  const { isBuySectionShow } = useSDKRampEntryShow();
  const isBuyButtonShow = useMemo(
    () => tokenInfo.symbol === defaultToken.symbol && tokenInfo.chainId === 'AELF' && isBuySectionShow,
    [defaultToken.symbol, isBuySectionShow, tokenInfo.chainId, tokenInfo.symbol],
  );

  const isFaucetButtonShow = useMemo(
    () => !isMainnet && tokenInfo.symbol === defaultToken.symbol && tokenInfo.chainId === 'AELF',
    [defaultToken.symbol, isMainnet, tokenInfo.chainId, tokenInfo.symbol],
  );

  const buttonCount = useMemo(() => {
    // SDK will only support send / receive / faucet(only for testnet)
    return isMainnet ? 3 : 2;
  }, [isMainnet]);

  const buttonGroupWrapStyle = useMemo(() => {
    if (buttonCount >= 5) {
      // styles
      return {};
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

  const goBack = useCallback(() => {
    onFinish({
      status: 'success',
    });
  }, [onFinish]);

  const { wallet } = useUnlockedWallet({ getMultiCaAddresses: true });
  const caAddressInfos = useMemo(() => {
    if (!wallet) return {};
    return Object.entries(wallet.multiCaAddresses ?? {}).map(it => {
      return { chainId: it[0], caAddress: it[1] };
    });
  }, [wallet]);
  const onNavigateActivityDetail = useCallback(
    (item: ActivityItemType) => {
      navigateTo(PortkeyEntries.ACTIVITY_DETAIL_ENTRY, {
        params: { item, caAddressInfos },
      });
    },
    [caAddressInfos, navigateTo],
  );

  return (
    <SafeAreaBox style={styles.pageWrap}>
      <StatusBar barStyle={'light-content'} />
      <CustomHeader
        themeType={'blue'}
        backTitle={t('')}
        leftCallback={goBack}
        titleDom={
          <View>
            <TextXL style={[GStyles.textAlignCenter, FontStyles.font2, fonts.mediumFont]}>{tokenInfo.symbol}</TextXL>
            <Text style={[GStyles.textAlignCenter, FontStyles.font2, styles.subTitle]}>
              {formatChainInfoToShow(tokenInfo.chainId)}
            </Text>
          </View>
        }
      />
      <View style={styles.pageContainer}>
        <View style={styles.card}>
          <Text style={styles.tokenBalance}>{currentToken ? `${balanceShow} ${currentToken?.symbol}` : ''}</Text>
          {isMainnet && isTokenHasPrice && (
            <Text style={styles.dollarBalance}>{`$ ${formatAmountShow(
              divDecimals(currentToken?.balance, currentToken?.decimals).multipliedBy(currentToken ? tokenPrice : 0),
              2,
            )}`}</Text>
          )}
          <View style={[styles.buttonGroupWrap, buttonGroupWrapStyle]}>
            {isBuyButtonShow && <BuyButton themeType="innerPage" wrapStyle={buttonWrapStyle} />}
            <SendButton themeType="tokenInnerPage" sentToken={tokenInfo} wrapStyle={buttonWrapStyle} />
            <ReceiveButton currentTokenInfo={tokenInfo} themeType="innerPage" wrapStyle={buttonWrapStyle} />
            {isFaucetButtonShow && <FaucetButton themeType="innerPage" wrapStyle={buttonWrapStyle} />}
          </View>
        </View>
        <FlatList
          refreshing={reFreshing}
          data={currentActivity?.activityList || []}
          keyExtractor={(_item, index) => `${index}`}
          ListEmptyComponent={<NoData noPic message="You have no transactions." />}
          renderItem={({ item }: { item: ActivityItemType }) => {
            return (
              <TransferItem
                item={item}
                onPress={() => {
                  onNavigateActivityDetail(item);
                }}
              />
            );
          }}
          onRefresh={() => {
            onRefreshList();
          }}
          onEndReached={() => {
            getActivityList();
          }}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        />
      </View>
    </SafeAreaBox>
  );
};

export default TokenDetail;

interface ActivityListEntity {
  activityList: ActivityItemType[];
  skipCount: number;
  totalRecordCount: number;
}
