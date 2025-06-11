// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import navigationService from 'utils/navigationService';
// import { View, FlatList, Image } from 'react-native';
import { View, FlatList } from 'react-native';
import { ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import TokenListUnionItem from 'components/TokenListUnionItem';
import { useLanguage } from 'i18n/hooks';
import { PAGE_SIZE_IN_ACCOUNT_TOKEN, REFRESH_TIME } from '@portkey-wallet/constants/constants-ca/assets';
// import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Touchable from 'components/Touchable';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
// import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { makeStyles } from '@rneui/themed';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';

export default function TokenSection() {
  const { t } = useLanguage();
  const userInfo = useCurrentUserInfo();
  const styles = getStyles();

  const { accountTokenList, totalRecordCount, fetchAccountTokenInfoList } = useAccountTokenInfo();
  // const accountBalanceUSD = useAccountBalanceUSD();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const caAddressInfos = useCaAddressInfoList();
  const caAddressInfosList = useLatestRef(caAddressInfos);
  const [extraIndex, setExtraIndex] = useState<number>(0);
  const [selectedItem] = useState(new Map<string, boolean>());

  const onNavigate = useCallback((tokenItem: ITokenSectionResponse, index: number) => {
    navigationService.navigate('TokenDetail', { tokenSection: tokenItem, index });
  }, []);

  const reload = useCallback(() => {
    setExtraIndex(extraIndex + 1);
  }, [extraIndex]);

  const onExpand = useCallback(
    (tokenItem: ITokenSectionResponse) => {
      if (tokenItem.tokens?.length === 1) {
        onNavigate(tokenItem, 0);
      } else {
        selectedItem.set(tokenItem.symbol, !selectedItem.get(tokenItem.symbol));
        reload();
      }
    },
    [onNavigate, reload, selectedItem],
  );

  const renderItem = useCallback(
    ({ item }: { item: ITokenSectionResponse }) => {
      return (
        <TokenListUnionItem
          key={item.symbol}
          item={item}
          onPress={onNavigate}
          onExpand={onExpand}
          hideBalance={userInfo.hideAssets}
          selected={selectedItem.get(item.symbol) ?? false}
        />
      );
    },
    [onExpand, onNavigate, selectedItem, userInfo.hideAssets],
  );

  const getAccountTokenList = useLockCallback(
    async (isInit: boolean) => {
      if (totalRecordCount && accountTokenList.length >= totalRecordCount && !isInit) {
        return;
      }

      try {
        await fetchAccountTokenInfoList({
          caAddressInfos: caAddressInfosList.current || [],
          skipCount: isInit ? 0 : accountTokenList.length,
          maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
        });
      } catch (error) {
        console.log(error, '===error');
      }
    },
    [accountTokenList.length, caAddressInfosList, fetchAccountTokenInfoList, totalRecordCount],
  );

  useEffect(() => {
    getAccountTokenList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caAddressInfosList]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      getAccountTokenList(true);
    }, REFRESH_TIME);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [getAccountTokenList]);

  // const listHeader = useMemo(() => {
  //   const accountBalanceNumber = parseFloat(accountBalanceUSD || '0');
  //   if (accountBalanceNumber <= 0) {
  //     const bannerWidth = screenWidth - pTd(32);
  //     const bannerHeight = (bannerWidth * 152) / 361;
  //     return (
  //       <Touchable
  //         onPress={() => {
  //           navigationService.navigate('ReceiveSelectToken');
  //         }}>
  //         <Image
  //           style={[styles.banner, { width: bannerWidth, height: bannerHeight }]}
  //           source={require('assets/image/pngs/receive_token_banner.png')}
  //         />
  //       </Touchable>
  //     );
  //   } else {
  //     return <View />;
  //   }
  // }, [accountBalanceUSD, styles]);

  return (
    <View style={styles.tokenListPageWrap}>
      <FlatList
        // ListHeaderComponent={listHeader}
        nestedScrollEnabled
        refreshing={false}
        extraData={extraIndex}
        data={accountTokenList || []}
        renderItem={renderItem}
        keyExtractor={(item: ITokenSectionResponse) => item.symbol}
        onEndReached={() => getAccountTokenList()}
        ListFooterComponent={
          <Touchable
            style={styles.addWrap}
            onPress={() => {
              navigationService.navigate('ManageTokenList');
            }}>
            <Svg icon="tune" size={pTd(16)} />
            <TextL style={[styles.addTokenText, fonts.SGMediumFont]}>{t('Manage token list')}</TextL>
          </Touchable>
        }
      />
    </View>
  );
}

export const getStyles = makeStyles(theme => ({
  tokenListPageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase2,
  },
  addWrap: {
    shadowColor: 'red',
    marginTop: pTd(20),
    marginBottom: pTd(20),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTokenText: {
    marginLeft: pTd(8),
    color: theme.colors.textBrand1,
  },
  banner: {
    marginVertical: pTd(16),
    marginLeft: pTd(16),
  },
}));
