import React, { useCallback, useState, useEffect, useRef, useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, FlatList } from 'react-native';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import TokenListItem from 'components/TokenListItem';
import { REFRESH_TIME } from '@portkey-wallet/constants/constants-ca/assets';
import { useCommonNetworkInfo } from 'components/TokenOverlay/hooks';
import AssetsContext, { AssetsContextType } from 'global/context/assets/AssetsContext';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { useLanguage } from 'i18n/hooks';

export interface TokenSectionProps {
  getAccountBalance?: () => void;
}

const frontEndTokenSymbol = 'ELF';

export default function TokenSection() {
  const { t } = useLanguage();
  const commonInfo = useCommonNetworkInfo();
  const [isFetching] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { balanceList, updateBalanceList, allOfTokensList, updateTokensList } =
    useContext<AssetsContextType>(AssetsContext);

  const itemData: Array<TokenItemShowType> = useMemo(() => {
    return allOfTokensList
      .map<TokenItemShowType & { isDisplay: boolean }>(item => {
        const { symbol, decimals, chainId, address } = item.token;
        const balanceItem = balanceList.find(it => it.symbol === symbol && it.chainId === item.token.chainId);
        const balanceInfo = balanceList.find(it => it.symbol === symbol && it.chainId === item.token.chainId);
        const { balanceInUsd, price: priceInUsd } = balanceInfo || {};
        return {
          balance: balanceItem?.balance ?? '0',
          decimals,
          chainId,
          address,
          tokenContractAddress: address,
          symbol,
          priceInUsd,
          balanceInUsd,
          name: item.token.symbol,
          isDisplay: item.isDisplay,
          isDefault: item.isDefault,
          sortWeight: item.sortWeight,
        };
      })
      .filter(melted => melted.isDisplay || melted.isDefault)
      .sort((a, b) => {
        const { symbol: symbolA } = a;
        const { symbol: symbolB } = b;
        if (symbolA === symbolB) {
          return getWeightForTokenItems(b) - getWeightForTokenItems(a);
        } else {
          if (symbolA === frontEndTokenSymbol) return -1;
          if (symbolB === frontEndTokenSymbol) return 1;
          return symbolA.localeCompare(symbolB);
        }
      });
  }, [allOfTokensList, balanceList]);

  const { navigateTo } = useBaseContainer({});

  const onNavigateToTokenDetail = useCallback(
    (item: TokenItemShowType) => {
      navigateTo(PortkeyEntries.TOKEN_DETAIL_ENTRY, {
        params: {
          tokenInfo: item,
        },
      });
    },
    [navigateTo],
  );

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return <TokenListItem key={item.symbol} item={item} onPress={onNavigateToTokenDetail} commonInfo={commonInfo} />;
    },
    [commonInfo, onNavigateToTokenDetail],
  );

  const onRefresh = useCallback(async () => {
    try {
      await updateTokensList();
      await updateBalanceList();
    } catch (e) {
      console.warn('updateBalanceList or updateTokensList failed! ', e);
    }
  }, [updateBalanceList, updateTokensList]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      onRefresh();
    }, REFRESH_TIME);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onRefresh, updateBalanceList, updateTokensList]);

  return (
    <View style={styles.tokenListPageWrap}>
      <FlatList
        refreshing={isFetching}
        data={itemData || []}
        renderItem={renderItem}
        keyExtractor={(item: TokenItemShowType) => item.symbol + item.chainId}
        onRefresh={onRefresh}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addWrap}
            onPress={() => {
              navigateTo(PortkeyEntries.TOKEN_MANAGE_LIST_ENTRY);
            }}>
            <Svg icon="add-token" size={20} />
            <TextM style={styles.addTokenText}>{t('Add Tokens')}</TextM>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

// AELF > tDVW > tDVV > others
const getWeightForTokenItems = (item: TokenItemShowType): number => {
  if (item.chainId === 'AELF') {
    return 2;
  } else if (item.chainId === 'tDVW') {
    return 1;
  } else {
    return 0;
  }
};

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
