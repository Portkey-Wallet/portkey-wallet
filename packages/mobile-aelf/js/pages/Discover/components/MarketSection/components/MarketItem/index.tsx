import { ICryptoCurrencyItem } from '@portkey-wallet/store/store-eoa/discover/type';
import { darkColors, defaultColors } from 'assets/theme';
import { DarkFontStyles } from 'assets/theme/styles';
import CommonToast from 'components/CommonToast';
import PortkeySkeleton from 'components/PortkeySkeleton';
import Touchable from 'components/Touchable';
import { useMarketFavorite } from 'hooks/discover';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, StyleSheet, LayoutChangeEvent } from 'react-native';
import { pTd } from 'utils/unit';
import { getDecimalPlaces } from '../SinkableText';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { TextM, TextS } from 'components/CommonText';
import { showFavoriteModal } from '../FavoriteOverlay';
import fonts from 'assets/theme/fonts';
export interface IMarketItemProps {
  isLoading: boolean;
  item: ICryptoCurrencyItem;
  onStarClicked?: (favorite: boolean) => void;
}

export default function MarketItem(props: IMarketItemProps) {
  const { isLoading, item, onStarClicked } = props;
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

  const onLongPress = useCallback(
    (data: ICryptoCurrencyItem) => {
      if (isDefaultSymbol) {
        CommonToast.info(`${item.symbol} can’t be removed from the favorite list.`);
      } else {
        showFavoriteModal({
          title: data.symbol,
          favorite,
          onPress: async () => {
            onStarClicked?.(!data.collected);
            console.log('wfs=== favorite', favorite);
            if (favorite) {
              try {
                await unMarkFavorite(data.id + '', data.symbol);
                CommonToast.success('Removed');
                setFavorite(false);
              } catch (e) {
                console.log(e, 'Failed to remove favorites');
                CommonToast.failError('Failed to remove favorites');
              }
            } else {
              try {
                await markFavorite(data.id + '', data.symbol);
                CommonToast.success('Added to favorites');
                setFavorite(true);
              } catch (e) {
                console.log(e, 'Failed to add favorites');
                CommonToast.failError('Failed to add favorites');
              }
            }
            setShowTips(false);
          },
        });
      }
    },
    [favorite, isDefaultSymbol, item.symbol, markFavorite, onStarClicked, unMarkFavorite],
  );

  return (
    <View style={styles.mainContainerWrap}>
      {isLoading ? (
        <>
          <PortkeySkeleton width={pTd(167)} height={pTd(28)} />
          <PortkeySkeleton width={pTd(92)} height={pTd(28)} />
          <PortkeySkeleton width={pTd(64)} height={pTd(28)} />
        </>
      ) : (
        <Touchable
          onLayout={onLayout}
          onLongPress={() => onLongPress(item)}
          style={[styles.mainContainer, { backgroundColor: showTips ? defaultColors.bgBase2 : darkColors.bgBase1 }]}>
          <View style={[styles.boxWrapper, styles.section1Width]}>
            <Image
              source={{
                uri: item.image || 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
              }}
              style={styles.img}
            />
            <View style={styles.section}>
              <TextM style={[styles.text, DarkFontStyles.textBase1]}>{item.symbol || '--'}</TextM>
              <TextS style={[styles.text2, DarkFontStyles.textBase2]}>${item.marketCap || 0}</TextS>
            </View>
          </View>
          {/* </Text> */}
          <View style={styles.rightSection}>
            <TextM style={[styles.text, DarkFontStyles.textBase1, styles.snkableText]}>
              ${item.currentPrice || '--'}
            </TextM>
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
}

const styles = StyleSheet.create({
  mainContainerWrap: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: pTd(74),
    backgroundColor: darkColors.bgBase1,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: pTd(74),
    paddingHorizontal: pTd(16),
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
    borderRadius: pTd(21),
    backgroundColor: darkColors.iconBase1,
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
    fontSize: pTd(14),
    textAlign: 'left',
    lineHeight: pTd(22),
    color: darkColors.textBase1,
  },
  text1: {
    fontSize: pTd(16),
    textAlign: 'left',
    // fontWeight: 'bold',
    color: darkColors.textBase1,
    ...fonts.mediumFont,
  },
  text2: {
    height: pTd(20),
    lineHeight: pTd(20),
    // fontWeight: '400',
    textAlign: 'left',
  },
  text3: {
    fontSize: pTd(14),
    // fontWeight: '500',
    textAlign: 'right',
    ...fonts.mediumFont,
  },
  snkableText: {
    fontSize: pTd(14),
    // fontWeight: '900',
    ...fonts.mediumFont,
  },
  priceSinkText: {
    fontSize: pTd(10),
  },
  text4: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    height: pTd(20),
    // fontWeight: '500',
    textAlign: 'right',
    ...fonts.mediumFont,
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
