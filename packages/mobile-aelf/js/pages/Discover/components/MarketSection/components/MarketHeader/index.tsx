import { IMarketInfo, IMarketSort, IMarketSortDir } from '@portkey-wallet/store/store-eoa/discover/type';
import { darkColors } from 'assets/theme';
import { TextS } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import Svg from 'components/Svg';
import React, { useCallback } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, View } from 'react-native';
import { pTd } from 'utils/unit';
function HeaderItem({ name, sortDir, style }: { name: string; sortDir: IMarketSortDir; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[itemStyles.mainContainer, style]}>
      <Text style={itemStyles.text}>{name}</Text>
      <View style={itemStyles.wrapper}>
        <Svg icon={'sort-asc'} size={pTd(6)} color={sortDir === 'asc' ? darkColors.textBase2 : darkColors.textBase3} />
        <Svg
          icon={'sort-desc'}
          size={pTd(6)}
          color={sortDir === 'desc' ? darkColors.textBase2 : darkColors.textBase3}
        />
      </View>
    </View>
  );
}
const itemStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    height: pTd(16),
    color: darkColors.textBase3,
    fontSize: pTd(12),
    lineHeight: pTd(16),
    textAlign: 'left',
  },
  wrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
    width: pTd(6),
    marginLeft: pTd(4),
  },
});
export default function MarketHeader({
  marketInfo,
  handleSort,
  style,
}: {
  marketInfo?: IMarketInfo;
  handleSort: (sort: IMarketSort) => Promise<void>;
  style?: StyleProp<ViewStyle>;
}) {
  const calSortDirBySort = useCallback(
    (sort: IMarketSort) => {
      return marketInfo?.sort === sort ? marketInfo?.sortDir || '' : '';
    },
    [marketInfo?.sort, marketInfo?.sortDir],
  );
  return (
    <View style={[styles.mainContainer, style]}>
      <View style={[styles.section]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log('click! Token');
            try {
              handleSort('symbol');
            } catch (e) {
              CommonToast.failError(`${e}`);
            }
          }}>
          <HeaderItem name={'Name'} sortDir={calSortDirBySort('symbol')} />
        </TouchableOpacity>
        <TextS style={styles.divider}>/</TextS>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log('click! Market Cap');
            try {
              handleSort('marketCap');
            } catch (e) {
              CommonToast.failError(`${e}`);
            }
          }}>
          <HeaderItem name={'Market Cap'} sortDir={calSortDirBySort('marketCap')} />
        </TouchableOpacity>
      </View>
      <View style={[styles.section]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log('click! Price');
            try {
              handleSort('currentPrice');
            } catch (e) {
              CommonToast.failError(`${e}`);
            }
          }}>
          <HeaderItem name={'Price'} sortDir={calSortDirBySort('currentPrice')} />
        </TouchableOpacity>
        <TextS style={styles.divider}>/</TextS>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log('click! 24 chg%');
            try {
              handleSort('priceChangePercentage24H');
            } catch (e) {
              CommonToast.failError(`${e}`);
            }
          }}>
          <HeaderItem name={'24H Chg%'} sortDir={calSortDirBySort('priceChangePercentage24H')} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: darkColors.bgBase1,
    paddingVertical: pTd(8),
    paddingHorizontal: pTd(16),
  },
  divider: {
    marginHorizontal: pTd(8),
    height: pTd(16),
    color: darkColors.textBase3,
    fontSize: pTd(12),
    lineHeight: pTd(16),
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
