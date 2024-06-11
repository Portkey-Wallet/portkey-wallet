import { IMarketInfo, IMarketSort, IMarketSortDir } from '@portkey-wallet/store/store-ca/discover/type';
import { defaultColors } from 'assets/theme';
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
        <Svg
          icon={'sort-asc'}
          size={pTd(6)}
          color={sortDir === 'asc' ? defaultColors.brandNormal : defaultColors.neutralTertiaryText}
        />
        <Svg
          icon={'sort-desc'}
          size={pTd(6)}
          color={sortDir === 'desc' ? defaultColors.brandNormal : defaultColors.neutralTertiaryText}
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
    color: defaultColors.neutralTertiaryText,
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
      <View style={[styles.section, styles.section1Width]}>
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
          <HeaderItem name={'/Market Cap'} style={styles.marginLeft4} sortDir={calSortDirBySort('marketCap')} />
        </TouchableOpacity>
      </View>
      <View style={[styles.section, styles.section2Width]}>
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
      </View>
      <View style={[styles.section, styles.section3Width]}>
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
    backgroundColor: defaultColors.neutralDefaultBG,
    paddingVertical: pTd(8),
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section1Width: {
    width: pTd(165),
  },
  section2Width: {
    width: pTd(92),
    justifyContent: 'flex-end',
  },
  section3Width: {
    width: pTd(68),
    justifyContent: 'flex-end',
  },
  marginLeft4: {
    marginLeft: pTd(4),
  },
});
