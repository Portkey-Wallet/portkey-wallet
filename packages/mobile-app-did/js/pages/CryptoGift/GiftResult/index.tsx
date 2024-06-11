import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { pTd } from 'utils/unit';
import HistoryCard from '../components/HistoryCard';
import { Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultColors } from 'assets/theme';
import HeaderCard from '../components/HeaderCard';
import { View } from 'react-native';
import Packet_Detail_Header_Bg from '../img/Packet_Detail_Header_Bg.png';
import { screenWidth, statusBarHeight } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import referralTopBackground from 'assets/image/pngs/referralTopBackground.png';
import giftResultBg from 'assets/image/pngs/giftResultBg.png';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import { TextL, TextM, TextTitle, TextXL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
const data = Array.from({ length: 11 });
export default function GiftResult() {
  const { t } = useLanguage();
  const [isSkeleton, setIsSkeleton] = useState<boolean>(true);
  const renderItem = useCallback(() => {
    return <HistoryCard containerStyle={styles.itemDivider} />;
  }, []);
  const renderDivider = useCallback(() => {
    return <View style={styles.divider} />;
  }, []);
  const onDone = useCallback(() => {
    console.log('onDone clicked!!');
    navigationService.navigate('CryptoGift');
  }, []);
  return (
    <View style={styles.pageWrap}>
      <ImageBackground source={giftResultBg} style={styles.topSectionStyle}>
        <TouchableOpacity onPress={onDone}>
          <View style={[GStyles.height(pTd(44)), GStyles.itemCenter, GStyles.flexEnd, GStyles.flexRow]}>
            <TextM style={[FontStyles.brandNormal, GStyles.paddingRight(pTd(16))]}>Done</TextM>
          </View>
        </TouchableOpacity>
        <HeaderCard />
        {/* <Image source={referralTopText} style={styles.referralTopText} /> */}
      </ImageBackground>
      <View style={[GStyles.itemCenter, GStyles.flexCenter, GStyles.flexRow, GStyles.marginTop(pTd(40))]}>
        <TextTitle>Send to Your Friends Right Now!</TextTitle>
      </View>
      <CommonButton containerStyle={styles.buttonContainer} type="primary" disabled={false} radius={pTd(6)}>
        <View style={styles.buttonContentWrapper}>
          <Svg icon="copy" size={pTd(20)} color={defaultColors.neutralDefaultBG} />
          <TextL style={styles.buttonText}>{t('Create Crypto Gifts')}</TextL>
        </View>
      </CommonButton>
      <CommonButton
        containerStyle={[styles.buttonContainer, GStyles.paddingTop(pTd(16))]}
        buttonStyle={styles.shareButtonStyle}
        type="outline"
        disabled={false}
        radius={pTd(6)}>
        <View style={styles.buttonContentWrapper}>
          <Svg icon="share-gift" size={pTd(20)} color={defaultColors.brandNormal} />
          <TextL style={[styles.buttonText, FontStyles.brandNormal]}>{t('Share with your friends')}</TextL>
        </View>
      </CommonButton>
      {/* <NewUserOnly /> */}
      {/* <View style={[GStyles.flexCol, GStyles.center, styles.bottomSectionWrap]} /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  pageWrap: {
    ...BGStyles.neutralDefaultBG,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  topSectionStyle: {
    width: screenWidth,
    height: pTd(305),
    position: 'relative',
    paddingTop: statusBarHeight + pTd(27),
  },
  title: {
    flex: 5,
  },
  referralTopText: {
    width: pTd(297),
    height: pTd(94),
    position: 'absolute',
    left: pTd(38),
    bottom: pTd(244),
  },

  pageStyles: {
    backgroundColor: defaultColors.neutralDefaultBG,
    flex: 1,
    paddingHorizontal: 0,
  },
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  headerWrap: {
    width: screenWidth,
    height: pTd(76),
  },
  backIconWrap: {
    paddingLeft: pTd(16),
    paddingVertical: pTd(16),
    width: pTd(60),
  },
  iconMargin: { marginRight: pTd(16) },
  itemDivider: {
    marginTop: pTd(16),
  },
  divider: {
    height: pTd(8),
    backgroundColor: defaultColors.neutralContainerBG,
    marginTop: pTd(32),
  },
  buttonContainer: {
    paddingTop: pTd(32),
    width: screenWidth - pTd(32),
  },
  buttonText: {
    lineHeight: pTd(24),
    color: defaultColors.neutralContainerBG,
    marginLeft: pTd(8),
  },
  buttonContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonStyle: {
    borderColor: defaultColors.brandNormal,
    borderWidth: 1,
  },
});
