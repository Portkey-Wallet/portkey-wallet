import React, { useCallback, useMemo, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View, Text } from 'react-native';
import Svg from 'components/Svg';
import { measurePageY } from 'utils/measure';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { TouchableOpacity } from 'react-native';
import CommonToast from 'components/CommonToast';
import { IMarketInfo, IMarketType } from '@portkey-wallet/store/store-ca/discover/type';
import FloatOverlay from 'components/FloatOverlay';

export default function MarketType({
  marketInfo,
  handleType,
}: {
  marketInfo?: IMarketInfo;
  handleType: (type: IMarketType) => Promise<void>;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const onRightPress = useCallback(
    async (event: GestureResponderEvent) => {
      setCollapsed(false);
      const top = await measurePageY(event.target);
      FloatOverlay.showFloatPopover({
        list: [
          {
            title: 'Favourites',
            onPress: () => {
              try {
                handleType('Favorites');
              } catch (e) {
                CommonToast.failError(`${e}`);
              }
            },
          },
          {
            title: 'Top',
            onPress: () => {
              try {
                handleType('Hot');
              } catch (e) {
                CommonToast.failError(`${e}`);
              }
            },
          },
          {
            title: 'Trending',
            onPress: () => {
              try {
                handleType('Trending');
              } catch (e) {
                CommonToast.failError(`${e}`);
              }
            },
          },
        ],
        formatType: 'dynamicWidth',
        customPosition: { left: pTd(16), top: top + pTd(40) },
        customBounds: { x: pTd(16), y: top + pTd(20), width: 0, height: 0 },
        onMaskClose() {
          setCollapsed(true);
        },
      });
    },
    [handleType],
  );
  const showTypeName = useMemo(() => {
    if (marketInfo?.type === 'Hot') {
      return 'Top';
    } else if (marketInfo?.type === 'Favorites') {
      return 'Favourites';
    } else if (marketInfo?.type === 'Trending') {
      return 'Trending';
    }
  }, [marketInfo?.type]);
  return (
    <TouchableOpacity onPress={onRightPress} style={styles.touchWrapper}>
      <View style={styles.mainContainer}>
        <Text style={styles.text}>{showTypeName || 'Top'}</Text>
        <Svg
          icon={collapsed ? 'down-arrow' : 'direction-up'}
          size={pTd(16)}
          color={defaultColors.neutralSecondaryTextColor}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: pTd(112),
    padding: pTd(5),
    paddingLeft: pTd(12),
    paddingRight: pTd(12),
    backgroundColor: defaultColors.neutralDefaultBG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.neutralBorder,
    borderRadius: pTd(24),
  },
  text: {
    minHeight: pTd(22),
    color: defaultColors.neutralPrimaryTextColor,
    fontSize: pTd(14),
    textAlign: 'left',
  },
});
