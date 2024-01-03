import React, { memo } from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import inviteFriendButton from 'assets/image/pngs/inviteFriendButton.png';
import { showReferralLinkOverlay } from '../components/ReferralLinkOverlay';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { bottomBarHeight, screenWidth, statusBarHeight } from '@portkey-wallet/utils/mobile/device';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { defaultColors } from 'assets/theme';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import LinearGradient from 'react-native-linear-gradient';
import referralTopBackground from 'assets/image/pngs/referralTopBackground.png';
import referralTopText from 'assets/image/pngs/referralTopText.png';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';

const UserReferral = () => {
  return (
    <View style={styles.pageWrap}>
      <ImageBackground source={referralTopBackground} style={styles.topSectionStyle}>
        <View style={styles.headerWrap}>
          <Touchable onPress={navigationService.goBack} style={GStyles.flex1}>
            <Svg icon="left-arrow" color={defaultColors.bg1} size={pTd(20)} />
          </Touchable>
          <TextL style={[GStyles.textAlignCenter, FontStyles.font11, styles.title]}>Portkey Referral</TextL>
          <View style={GStyles.flex1} />
        </View>
        <Image source={referralTopText} style={styles.referralTopText} />
      </ImageBackground>

      <View style={[GStyles.flexCol, GStyles.center, styles.bottomSectionWrap]}>
        <View style={[GStyles.flexCenter, styles.qrCodeSection]}>
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={['#2F31A1', '#707EFF', '#2F31A1']}
            style={styles.gradient}
          />
          <View style={styles.qrBgSection} />
          <View style={styles.qrCodeWrap}>
            <CommonQRCodeStyled qrData={'xxxxxxx'} width={pTd(103)} />
          </View>
          <TextM style={[FontStyles.font7, GStyles.textAlignCenter, GStyles.marginTop(pTd(4))]}>Referral Code</TextM>
        </View>

        {/* TODO: change url */}
        <Touchable onPress={() => showReferralLinkOverlay('linkUrl')}>
          <Image source={inviteFriendButton} style={styles.btn} />
        </Touchable>
      </View>
    </View>
  );
};

export default memo(UserReferral);

export const styles = StyleSheet.create({
  pageWrap: {
    ...BGStyles.bg1,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: defaultColors.bg28,
  },
  backIcon: {
    position: 'absolute',
    left: pTd(16),
    top: pTd(16),
  },
  title: {
    flex: 3,
  },
  topSectionStyle: {
    width: screenWidth,
    height: pTd(480),
    position: 'relative',
    paddingTop: statusBarHeight + pTd(30),
  },
  headerWrap: {
    width: screenWidth,
    height: pTd(44),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pTd(20),
  },
  referralTopText: {
    width: pTd(297),
    height: pTd(94),
    position: 'absolute',
    left: pTd(38),
    bottom: pTd(244),
  },
  qrCodeSection: {
    position: 'relative',
    width: pTd(152),
    paddingTop: pTd(16),
    paddingHorizontal: pTd(16),
    paddingBottom: pTd(8),
    marginBottom: pTd(42),
  },
  qrCodeWrap: {
    padding: pTd(8.5),
    zIndex: 100,
    backgroundColor: defaultColors.bg1,
    marginTop: pTd(4),
  },
  qrBgSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: defaultColors.bg29,
  },
  btn: {
    width: pTd(335),
    height: pTd(48),
    marginBottom: bottomBarHeight + pTd(16),
  },
  gradient: {
    position: 'absolute',
    left: -pTd(2),
    right: -pTd(2),
    top: -pTd(2),
    bottom: -pTd(2),
    zIndex: -1,
  },
  bottomSectionWrap: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    paddingHorizontal: pTd(20),
  },
});
