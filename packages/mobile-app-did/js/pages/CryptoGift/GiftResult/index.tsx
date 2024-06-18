import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo } from 'react';
import { pTd } from 'utils/unit';
import { ImageBackground, Share, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultColors } from 'assets/theme';
import HeaderCard from '../components/HeaderCard';
import { View } from 'react-native';
import { screenWidth, statusBarHeight } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import giftResultBg from 'assets/image/pngs/giftResultBg.png';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextL, TextM, TextTitle, TextXL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import { copyText } from 'utils';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { DeviceEventEmitter } from 'react-native';
import { CryptoGiftCreateSuccess } from '@portkey-wallet/hooks/hooks-ca/cryptogift';

export interface IGiftResultProps {
  giftId: string;
}

export default function GiftResult() {
  const { giftId } = useRouterParams<IGiftResultProps>();
  const { t } = useLanguage();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const shareUrl = useMemo(() => {
    return `${currentNetworkInfo.referralUrl}/cryptoGift?id=${giftId}`;
  }, [currentNetworkInfo.referralUrl, giftId]);
  const onDone = useCallback(() => {
    console.log('onDone clicked!!');
    navigationService.navigate('CryptoGift');
  }, []);
  const onCopyPress = useCallback(async () => {
    await copyText(shareUrl || '');
  }, [shareUrl]);
  const onSharePress = useCallback(async () => {
    await Share.share({
      url: shareUrl,
    }).catch(shareError => {
      console.log(shareError);
    });
  }, [shareUrl]);
  useEffectOnce(() => {
    DeviceEventEmitter.emit(CryptoGiftCreateSuccess);
  });
  return (
    <View style={styles.pageWrap}>
      <ImageBackground source={giftResultBg} style={styles.topSectionStyle}>
        <TouchableOpacity onPress={onDone}>
          <View style={[GStyles.height(pTd(44)), GStyles.itemCenter, GStyles.flexEnd, GStyles.flexRow]}>
            <TextM style={[FontStyles.brandNormal, GStyles.paddingRight(pTd(16))]}>Done</TextM>
          </View>
        </TouchableOpacity>
        <HeaderCard showViewDetails giftId={giftId} />
        {/* <Image source={referralTopText} style={styles.referralTopText} /> */}
      </ImageBackground>
      <View style={[GStyles.itemCenter, GStyles.flexCenter, GStyles.flexRow, GStyles.marginTop(pTd(40))]}>
        <TextTitle>Share the surprise with your friends NOW!</TextTitle>
      </View>
      <CommonButton
        containerStyle={styles.buttonContainer}
        type="primary"
        disabled={false}
        radius={pTd(6)}
        onPress={onCopyPress}>
        <View style={styles.buttonContentWrapper}>
          <Svg icon="copy" size={pTd(20)} color={defaultColors.neutralDefaultBG} />
          <TextL style={styles.buttonText}>{t('Copy Link')}</TextL>
        </View>
      </CommonButton>
      <CommonButton
        onPress={onSharePress}
        containerStyle={[styles.buttonContainer, GStyles.paddingTop(pTd(16))]}
        buttonStyle={styles.shareButtonStyle}
        type="outline"
        disabled={false}
        radius={pTd(6)}>
        <View style={styles.buttonContentWrapper}>
          <Svg icon="share-gift" size={pTd(20)} color={defaultColors.brandNormal} />
          <TextL style={[styles.buttonText, FontStyles.brandNormal]}>{t('Share')}</TextL>
        </View>
      </CommonButton>
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
