import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextXXXL } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Carousel from 'rn-teaset/components/Carousel/Carousel';
import { screenWidth, windowHeight } from '@portkey-wallet/utils/mobile/device';
import Guide1Logo from '../../img/guide-1.png';
import Guide2Logo from '../../img/guide-2.png';
import Guide3Logo from '../../img/guide-3.png';

const guideList = [
  { title: 'Welcome to Portkey', detail: 'Portkey is an all-in-one wallet on aelf blockchain', img: Guide1Logo },
  {
    title: 'Digital Assets Management',
    detail: 'Store, send, and receive assets within aelf ecosystem',
    img: Guide2Logo,
  },
  {
    title: 'Immersive Web3 Experience',
    detail: 'Pulling you into a Web3 world where everything is fast, secure, and interconnected',
    img: Guide3Logo,
  },
];

export default function Guide() {
  const { t } = useLanguage();
  return (
    <Carousel
      style={styles.container}
      control={
        <Carousel.Control
          style={styles.dotRow}
          dot={<View style={styles.dotStyle} />}
          activeDot={<View style={[styles.dotStyle, styles.activeDotStyle]} />}
        />
      }
      carousel={false}>
      {guideList.map((item, index) => {
        return (
          <View key={index} style={[GStyles.itemCenter]}>
            <View style={styles.logoRow}>
              <Svg icon="logo-text" size={windowHeight * 0.25} />
            </View>
            <TextXXXL>{t(item.title)}</TextXXXL>
            <TextL style={styles.detailText}>{t(item.detail)}</TextL>
            <Image style={styles.guideLogo} source={item.img} resizeMode="contain" />
          </View>
        );
      })}
    </Carousel>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotRow: {
    paddingBottom: 50,
  },
  guideLogo: {
    marginTop: 48,
    height: screenWidth * 0.7,
  },
  detailText: {
    textAlign: 'center',
    marginHorizontal: '15%',
    marginTop: 8,
    color: defaultColors.font3,
  },
  logoRow: {
    overflow: 'hidden',
    height: windowHeight * 0.22,
  },
  activeDotStyle: {
    opacity: 1,
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: defaultColors.primaryColor,
    opacity: 0.2,
    marginHorizontal: 8,
  },
});
