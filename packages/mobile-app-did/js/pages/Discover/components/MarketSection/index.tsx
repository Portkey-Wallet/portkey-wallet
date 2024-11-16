import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import MarketHeader from './components/MarketHeader';
import { FlatList, View } from 'react-native';
import { pTd } from 'utils/unit';
import MarketItem from './components/MarketItem';
import { useMarket } from 'hooks/discover';
import { ICryptoCurrencyItem } from '@portkey-wallet/store/store-ca/discover/type';
import CommonToast from 'components/CommonToast';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';
import { StyleSheet } from 'react-native';
import { darkColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import MarketItemSkeleton from './components/MarketItemSkeleton';
import Loading from 'components/Loading';

export default forwardRef(function MarketSection(_, _ref) {
  const { marketInfo, refreshing, refreshList, handleSort } = useMarket();
  const flatListRef = useRef<FlatList>(null);
  const itemRefs = useRef(new Map());
  const renderItem = useCallback(({ item }: { item: ICryptoCurrencyItem; index: number }) => {
    return (
      <MarketItem ref={ref => itemRefs.current.set(item.id, ref)} isLoading={false} item={item} itemRefs={itemRefs} />
    );
  }, []);
  const onRefresh = useCallback(async () => {
    try {
      Loading.show();
      await refreshList();
      Loading.hide();
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

  useImperativeHandle(_ref, () => ({
    closeTips: () => {
      [...itemRefs.current.entries()].forEach(([id, ref]) => {
        id && ref && ref.hideTips();
      });
    },
  }));

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
          data={Array.isArray(marketInfo?.dataList) ? marketInfo?.dataList : []}
          renderItem={renderItem}
          keyExtractor={(item: ICryptoCurrencyItem, index: number) => '' + (item.id || index)}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.bgBase1,
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
    paddingVertical: 0,
  },
  retryButtonContainer: {
    width: pTd(120),
    marginBottom: pTd(8),
  },
  message: {
    color: darkColors.textBase2,
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
    color: darkColors.textBase1,
  },
  btnTitleStyle: {
    lineHeight: pTd(16),
  },
});
