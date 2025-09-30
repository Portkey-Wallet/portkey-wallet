import React, { useCallback } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import Svg from 'components/Svg';
import { measurePageY } from 'utils/measure';
import { pTd } from 'utils/unit';
import { darkColors } from 'assets/theme';
import { TouchableOpacity } from 'react-native';
import CommonToast from 'components/CommonToast';
import { IMarketInfo, IMarketType } from '@portkey-wallet/store/store-ca/discover/type';
import { screenWidth } from '@portkey-wallet/utils-mobile/device';
import FloatOverlay from 'components/FloatOverlay';

export default function MarketType({
  marketInfo,
  handleType,
}: {
  marketInfo?: IMarketInfo;
  handleType: (type: IMarketType) => Promise<void>;
}) {
  const onRightPress = useCallback(
    async (event: GestureResponderEvent) => {
      const top = await measurePageY(event.target);
      FloatOverlay.showFloatPopover({
        list: [
          {
            title: 'Top',
            iconName: 'filter-top',
            active: marketInfo?.type === 'Hot',
            onPress: async () => {
              try {
                await handleType('Hot');
              } catch (e) {
                CommonToast.failError(`${e}`);
              }
            },
          },
          {
            title: 'Favourites',
            iconName: 'collect',
            active: marketInfo?.type === 'Favorites',
            onPress: async () => {
              try {
                await handleType('Favorites');
              } catch (e) {
                CommonToast.failError(`${e}`);
              }
            },
          },
          {
            title: 'Trending',
            iconName: 'trend',
            active: marketInfo?.type === 'Trending',
            onPress: async () => {
              try {
                await handleType('Trending');
              } catch (e) {
                CommonToast.failError(`${e}`);
              }
            },
          },
        ],
        formatType: 'fixedWidth',
        customPosition: { right: pTd(16), top: top + pTd(40) },
        customBounds: { x: screenWidth - pTd(16), y: top + pTd(20), width: 0, height: 0 },
        contentStyle: { color: darkColors.textBase1 },
        containerStyle: { backgroundColor: darkColors.bgBase1, borderColor: darkColors.borderBase1, borderWidth: 1 },
      });
    },
    [handleType, marketInfo?.type],
  );

  return (
    <TouchableOpacity onPress={onRightPress} style={styles.touchWrapper}>
      <View style={styles.mainContainer}>
        <Svg icon={'filter'} size={pTd(16)} color={darkColors.textBase2} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: pTd(32),
    height: pTd(32),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkColors.borderBase1,
    borderRadius: pTd(16),
  },
  text: {
    minHeight: pTd(22),
    color: darkColors.textBase2,
    fontSize: pTd(14),
    textAlign: 'left',
  },
});
