import React, { useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks/index';
import { View, TouchableOpacity, FlatList } from 'react-native';
import Svg from 'components/Svg';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import TokenListItem from 'components/TokenListItem';
import { useLanguage } from 'i18n/hooks';
import { useCaAddressInfoList, useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { REFRESH_TIME } from '@portkey-wallet/constants/constants-ca/assets';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';

export interface TokenSectionProps {
  getAccountBalance?: () => void;
}

export default function TokenSection({ getAccountBalance }: TokenSectionProps) {
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const {
    accountToken: { accountTokenList },
  } = useAppCASelector(state => state.assets);
  const caAddressInfoList = useCaAddressInfoList();
  const {
    walletInfo: { caAddressList },
  } = useCurrentWallet();
  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [isFetching] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onNavigate = useCallback((tokenItem: TokenItemShowType) => {
    navigationService.navigate('TokenDetail', { tokenInfo: tokenItem });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return <TokenListItem key={item.symbol} item={item} onPress={() => onNavigate(item)} />;
    },
    [onNavigate],
  );

  const getAccountTokenList = useCallback(() => {
    if (caAddressList?.length === 0) return;

    dispatch(fetchTokenListAsync({ caAddresses: caAddressList || [], caAddressInfos: caAddressInfoList || [] }));
  }, [caAddressInfoList, caAddressList, dispatch]);

  useEffect(() => {
    getAccountTokenList();
  }, [caAddressList, getAccountTokenList]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      getAccountTokenList();
    }, REFRESH_TIME);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [getAccountTokenList]);

  return (
    <View style={styles.tokenListPageWrap}>
      <FlatList
        refreshing={isFetching}
        data={accountTokenList || []}
        renderItem={renderItem}
        keyExtractor={(item: TokenItemShowType) => item.symbol + item.chainId}
        onRefresh={() => {
          getAccountBalance?.();
          getAccountTokenList();
          getTokenPrice();
        }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addWrap}
            onPress={() => {
              navigationService.navigate('ManageTokenList');
            }}>
            <Svg icon="add-token" size={20} />
            <TextM style={styles.addTokenText}>{t('Add Tokens')}</TextM>
          </TouchableOpacity>
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
