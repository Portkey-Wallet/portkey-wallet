import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import MarketType from './components/MarketType';
import MarketHeader from './components/MarketHeader';
import { FlatList, Platform, RefreshControl, View } from 'react-native';
import { pTd } from 'utils/unit';
import MarketItem from './components/MarketItem';
import { useMarket } from 'hooks/discover';
import { ICryptoCurrencyItem } from '@portkey-wallet/store/store-ca/discover/type';
import CommonToast from 'components/CommonToast';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import MarketItemSkeleton from './components/MarketItemSkeleton';
import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';

export default function MarketSection() {
  const { marketInfo, refreshing, refreshList, handleType, handleSort } = useMarket();
  const flatListRef = useRef<FlatList>(null);
  console.log('wfs marketInfo===', marketInfo);
  const renderItem = useCallback(({ item }: { item: ICryptoCurrencyItem; index: number }) => {
    return <MarketItem isLoading={false} item={item} />;
  }, []);
  const onRefresh = useCallback(async () => {
    try {
      await refreshList();
    } catch (e) {
      CommonToast.failError(`${e}`);
    }
  }, [refreshList]);
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [marketInfo?.dataList]);
  const isSkeleton = useMemo(() => {
    return refreshing && (marketInfo?.dataList?.length || 0) <= 0;
  }, [marketInfo?.dataList?.length, refreshing]);
  const isLoading = useMemo(() => {
    return refreshing && (marketInfo?.dataList?.length || 0) > 0;
  }, [marketInfo?.dataList?.length, refreshing]);
  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.empty}>
        <Svg icon="no-data" size={pTd(64)} iconStyle={{ marginBottom: pTd(8) }} />
        <TextM style={styles.message}>No Data</TextM>
        <CommonButton
          radius={pTd(4)}
          containerStyle={styles.retryButtonContainer}
          buttonStyle={styles.retryButton}
          titleStyle={styles.btnTitleStyle}
          type="primary"
          title="Retry"
          disabled={refreshing}
          onPress={() => {
            onRefresh();
          }}
        />
      </View>
    );
  }, [onRefresh, refreshing]);

  return (
    <View style={styles.container}>
      <MarketType marketInfo={marketInfo} handleType={handleType} />
      <MarketHeader style={{ marginTop: pTd(8) }} marketInfo={marketInfo} handleSort={handleSort} />
      {isSkeleton ? (
        Array.from({ length: 11 }).map((item, index) => {
          return <MarketItemSkeleton key={index} />;
        })
      ) : (
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{ paddingBottom: pTd(10) }}
          style={{ minHeight: pTd(512) }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          refreshing={false}
          data={marketInfo?.dataList || []}
          renderItem={renderItem}
          keyExtractor={(item: ICryptoCurrencyItem) => '' + item.id}
          refreshControl={
            marketInfo?.dataList ? <RefreshControl refreshing={isLoading} onRefresh={onRefresh} /> : undefined
          }
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.neutralDefaultBG,
    paddingTop: pTd(16),
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: pTd(120),
    paddingBottom: pTd(224),
  },
  retryButton: {
    height: pTd(32),
  },
  retryButtonContainer: {
    width: pTd(120),
    marginBottom: pTd(8),
  },
  message: {
    color: defaultColors.neutralTertiaryText,
    fontSize: pTd(14),
    fontWeight: '400',
    lineHeight: pTd(22),
    marginBottom: pTd(24),
    width: '100%',
    textAlign: 'center',
  },
  nextButtonText: {
    fontSize: pTd(12),
    lineHeight: pTd(20),
    color: defaultColors.white,
  },
  btnTitleStyle: {
    lineHeight: pTd(16),
  },
});
