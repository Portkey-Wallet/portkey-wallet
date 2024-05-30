import { ICryptoCurrencyItem } from '@portkey-wallet/store/store-ca/discover/type';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import CommonToast from 'components/CommonToast';
import PortkeySkeleton from 'components/PortkeySkeleton';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useMarketFavorite } from 'hooks/discover';
import React, { useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import SinkableText from '../SinkableText';
export interface IMarketItemProps {
  isLoading: boolean;
  item: ICryptoCurrencyItem;
  onStarClicked?: (favorite: boolean) => void;
}
export default function MarketItem(props: IMarketItemProps) {
  const { isLoading, item, onStarClicked } = props;
  const { markFavorite, unMarkFavorite } = useMarketFavorite();
  const [favorite, setFavorite] = useState(item.collected);
  const isDefaultSymbol = item.symbol === 'ELF' || item.symbol === 'SGR';
  const chgColor = useMemo(() => {
    if (item.priceChangePercentage24H > 0) {
      return FontStyles.functionalGreenDefault;
    } else if (item.priceChangePercentage24H < 0) {
      return FontStyles.functionalRedDefault;
    }
    return FontStyles.neutralTertiaryText;
  }, [item.priceChangePercentage24H]);
  const prefixChg = useMemo(() => {
    if (item.priceChangePercentage24H > 0) {
      return '+';
    } else if (item.priceChangePercentage24H < 0) {
      return '';
    }
    return '';
  }, [item.priceChangePercentage24H]);
  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
        <>
          <PortkeySkeleton width={pTd(167)} height={pTd(28)} />
          <PortkeySkeleton width={pTd(92)} height={pTd(28)} />
          <PortkeySkeleton width={pTd(64)} height={pTd(28)} />
        </>
      ) : (
        <>
          <View style={[styles.boxWrapper, styles.section1Width]}>
            <Touchable
              disabled={isDefaultSymbol}
              onPress={async () => {
                onStarClicked?.(!item.collected);
                console.log('wfs=== favorite', favorite);
                if (favorite) {
                  unMarkFavorite(item.id, item.symbol);
                  try {
                    setFavorite(false);
                    await unMarkFavorite(item.id, item.symbol);
                    CommonToast.success('Removed');
                  } catch (e) {
                    setFavorite(true);
                    CommonToast.success('Removed Failed');
                  }
                } else {
                  try {
                    setFavorite(true);
                    await markFavorite(item.id, item.symbol);
                    CommonToast.success('Added to Favorites');
                  } catch (e) {
                    setFavorite(false);
                    CommonToast.success('Add Failed');
                  }
                }
              }}>
              <Svg
                icon={favorite ? (isDefaultSymbol ? 'favorite-disable' : 'favorite') : 'favorite-unselected'}
                size={pTd(16)}
                iconStyle={styles.iconFavorite}
              />
            </Touchable>
            <Image
              source={{
                uri: item.image || 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
              }}
              style={styles.img}
            />
            <View style={styles.section}>
              <Text style={[styles.text, FontStyles.neutralPrimaryTextColor]}>{item.symbol || '--'}</Text>
              <Text style={[styles.text2, FontStyles.neutralSecondaryTextColor]}>${item.marketCap || 0}</Text>
            </View>
          </View>
          <SinkableText sinkable value={item.currentPrice} />
          {/* </Text> */}
          <Text style={[styles.text4, FontStyles.functionalRedDefault, styles.section3Width, chgColor]}>
            {prefixChg}
            {item.priceChangePercentage24H || 0}%
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: pTd(64),
    backgroundColor: defaultColors.neutralDefaultBG,
  },
  boxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  img: {
    width: pTd(36),
    height: pTd(36),
    marginRight: pTd(10),
  },
  iconFavorite: {
    marginRight: pTd(10),
  },
  section: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: pTd(16),
    fontWeight: '500',
    textAlign: 'left',
  },
  text2: {
    height: pTd(16),
    fontSize: pTd(12),
    fontWeight: '400',
    textAlign: 'left',
  },
  priceWrapper: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    height: pTd(22),
  },
  text3: {
    // height: pTd(22),
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
    width: pTd(64),
    height: pTd(22),
    fontSize: pTd(14),
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
