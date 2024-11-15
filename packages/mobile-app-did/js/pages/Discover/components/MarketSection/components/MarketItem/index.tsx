import { ICryptoCurrencyItem } from '@portkey-wallet/store/store-ca/discover/type';
import { darkColors, defaultColors } from 'assets/theme';
import { DarkFontStyles } from 'assets/theme/styles';
import CommonToast from 'components/CommonToast';
import PortkeySkeleton from 'components/PortkeySkeleton';
import Touchable from 'components/Touchable';
import { useMarketFavorite } from 'hooks/discover';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, LayoutChangeEvent } from 'react-native';
import { pTd } from 'utils/unit';
import SinkableText, { getDecimalPlaces } from '../SinkableText';
import { FloatTips } from 'components/FloatTips';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { TextS } from 'components/CommonText';
export interface IMarketItemProps {
  isLoading: boolean;
  item: ICryptoCurrencyItem;
  itemRefs: React.MutableRefObject<Map<any, any>>;
  onStarClicked?: (favorite: boolean) => void;
}

export default forwardRef(function MarketItem(props: IMarketItemProps, _ref: any) {
  const { isLoading, item, onStarClicked, itemRefs } = props;
  const { markFavorite, unMarkFavorite } = useMarketFavorite();
  const [favorite, setFavorite] = useState(item.collected);
  const [showTips, setShowTips] = useState(false);
  const [wrapperLayoutProps, setWrapperLayoutProps] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const isDefaultSymbol = item.symbol === 'ELF' || item.symbol === 'SGR';
  const chgColor = useMemo(() => {
    if (item.priceChangePercentage24H > 0) {
      return darkColors.textSuccess1;
    } else if (item.priceChangePercentage24H < 0) {
      return darkColors.textDanger2;
    }
    return darkColors.textBase2;
  }, [item.priceChangePercentage24H]);
  const prefixChg = useMemo(() => {
    if (item.priceChangePercentage24H > 0) {
      return '+';
    } else if (item.priceChangePercentage24H < 0) {
      return '';
    }
    return '';
  }, [item.priceChangePercentage24H]);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (wrapperLayoutProps.width === width && wrapperLayoutProps.height === height) {
        return;
      }
      setWrapperLayoutProps({ width: screenWidth, height });
    },
    [wrapperLayoutProps],
  );

  const showTip = (isShow: boolean) => {
    [...itemRefs.current.entries()].forEach(([id, ref]) => {
      if (id !== item.id && ref) {
        ref && ref.hideTips();
      }
    });
    if (isDefaultSymbol) {
      CommonToast.info(`${item.symbol} can’t be removed from the favorite list.`);
    } else {
      setShowTips(isShow);
    }
  };

  useImperativeHandle(_ref, () => ({
    hideTips: () => setShowTips(false),
  }));

  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
        <>
          <PortkeySkeleton width={pTd(167)} height={pTd(28)} />
          <PortkeySkeleton width={pTd(92)} height={pTd(28)} />
          <PortkeySkeleton width={pTd(64)} height={pTd(28)} />
        </>
      ) : (
        <Touchable
          onLayout={onLayout}
          onPress={() => showTip(false)}
          onLongPress={() => showTip(true)}
          style={[styles.mainContainer, { backgroundColor: showTips ? defaultColors.bgBase2 : darkColors.bgBase1 }]}>
          <FloatTips
            wrapperLayoutProps={wrapperLayoutProps}
            textStyle={{
              color: defaultColors.textBase2,
            }}
            icon={favorite ? (isDefaultSymbol ? 'favorite-disable' : 'collected') : 'collect'}
            onPress={async () => {
              onStarClicked?.(!item.collected);
              console.log('wfs=== favorite', favorite);
              if (favorite) {
                try {
                  setFavorite(false);
                  await unMarkFavorite(item.id, item.symbol);
                  CommonToast.success('Removed');
                } catch (e) {
                  setFavorite(true);
                  CommonToast.failError('Failed to remove favourites');
                }
              } else {
                try {
                  setFavorite(true);
                  await markFavorite(item.id, item.symbol);
                  CommonToast.success('Added to favourites');
                } catch (e) {
                  setFavorite(false);
                  CommonToast.failError('Failed to add favourites');
                }
              }
              setShowTips(false);
            }}
            content={favorite ? 'Remove from favorite' : 'Add to favorite'}
            display={showTips}
          />
          <View style={[styles.boxWrapper, styles.section1Width]}>
            <Image
              source={{
                uri: item.image || 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
              }}
              style={styles.img}
            />
            <View style={styles.section}>
              <Text style={[styles.text, DarkFontStyles.textBase1]}>{item.symbol || '--'}</Text>
              <TextS style={[styles.text2, DarkFontStyles.textBase2]}>${item.marketCap || 0}</TextS>
            </View>
          </View>
          {/* </Text> */}
          <View style={styles.rightSection}>
            <SinkableText sinkable value={item?.currentPrice} />
            <TextS style={[styles.text4, DarkFontStyles.textBase2, styles.section3Width, { color: chgColor }]}>
              {prefixChg}
              {item.priceChangePercentage24H?.toFixed(
                getDecimalPlaces(item.priceChangePercentage24H) < 1
                  ? 1
                  : getDecimalPlaces(item.priceChangePercentage24H),
              ) || 0}
              %
            </TextS>
          </View>
        </Touchable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: pTd(74),
    backgroundColor: darkColors.bgBase1,
  },
  boxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  img: {
    width: pTd(42),
    height: pTd(42),
    marginRight: pTd(10),
    borderRadius: pTd(18),
  },
  iconFavorite: {
    marginRight: pTd(10),
  },
  section: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: pTd(42),
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: pTd(42),
  },
  text: {
    fontSize: pTd(16),
    textAlign: 'left',
    color: darkColors.textBase1,
  },
  text1: {
    fontSize: pTd(16),
    textAlign: 'left',
    fontWeight: 'bold',
    color: darkColors.textBase1,
  },
  text2: {
    height: pTd(20),
    lineHeight: pTd(20),
    fontWeight: '400',
    textAlign: 'left',
  },
  text3: {
    fontSize: pTd(14),
    fontWeight: '500',
    textAlign: 'right',
  },
  priceSinkText: {
    fontSize: pTd(10),
  },
  text4: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    height: pTd(20),
    fontWeight: '500',
    textAlign: 'right',
  },
  section1Width: {
    width: pTd(165),
  },
  section2Width: {
    width: pTd(92),
  },
  section3Width: {
    width: pTd(68),
  },
});
