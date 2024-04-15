import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { View, FlatList } from 'react-native';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import TokenListItem from '@portkey-wallet/rn-components/components/TokenListItem';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { PAGE_SIZE_IN_ACCOUNT_TOKEN, REFRESH_TIME } from '@portkey-wallet/constants/constants-ca/assets';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

export interface TokenSectionProps {
  getAccountBalance?: () => void;
}

export default function TokenSection({ getAccountBalance }: TokenSectionProps) {
  const { t } = useLanguage();

  const { accountTokenList, totalRecordCount, fetchAccountTokenInfoList } = useAccountTokenInfo();
  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const caAddressInfos = useCaAddressInfoList();
  const caAddressInfosList = useLatestRef(caAddressInfos);

  const onNavigate = useCallback((tokenItem: TokenItemShowType) => {
    navigationService.navigate('TokenDetail', { tokenInfo: tokenItem });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return <TokenListItem key={item.symbol} item={item} onPress={() => onNavigate(item)} />;
    },
    [onNavigate],
  );

  const getAccountTokenList = useLockCallback(
    async (isInit: boolean) => {
      if (totalRecordCount && accountTokenList.length >= totalRecordCount && !isInit) return;
      console.log('fetchAccountTokenList start', caAddressInfosList.current);
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
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      getAccountTokenList(true);
    }, REFRESH_TIME);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [getAccountTokenList]);

  return (
    <View style={styles.tokenListPageWrap}>
      <FlatList
        refreshing={false}
        data={accountTokenList || []}
        renderItem={renderItem}
        keyExtractor={(item: TokenItemShowType) => item.symbol + item.chainId}
        onEndReached={() => getAccountTokenList()}
        onRefresh={() => {
          getAccountBalance?.();
          getTokenPrice();
          getAccountTokenList(true);
        }}
        ListFooterComponent={
          <Touchable
            style={styles.addWrap}
            onPress={() => {
              navigationService.navigate('ManageTokenList');
            }}>
            <Svg icon="add-token" size={20} />
            <TextM style={styles.addTokenText}>{t('Add Tokens')}</TextM>
          </Touchable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tokenListPageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  addWrap: {
    shadowColor: 'red',
    marginTop: pTd(24),
    marginBottom: pTd(24),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTokenText: {
    marginLeft: pTd(8),
    color: defaultColors.font4,
  },
});
