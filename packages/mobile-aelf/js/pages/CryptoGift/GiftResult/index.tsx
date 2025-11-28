import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo } from 'react';
import { pTd } from 'utils/unit';
import { Share, TouchableOpacity } from 'react-native';
import { defaultColors } from 'assets/theme';
import { Image } from 'react-native';
import { View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { FontStyles } from 'assets/theme/styles';
import { TextL, TextM, TextTitle } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import { copyText } from 'utils';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { DeviceEventEmitter } from 'react-native';
import { CryptoGiftCreateSuccess, useGetCryptoGiftTgLink } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { isIOS } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import boxClose from 'assets/image/pngs/box-close.png';
import PageContainer from 'components/PageContainer';
import Touchable from 'components/Touchable';
import fonts from 'assets/theme/fonts';

export interface IGiftResultProps {
  giftId: string;
}

export default function GiftResult() {
  const styles = getStyles();
  const { theme } = useTheme();
  const { giftId } = useRouterParams<IGiftResultProps>();
  const { t } = useLanguage();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const shareUrl = useMemo(() => {
    return `${currentNetworkInfo.cryptoGiftUrl}/cryptoGift?id=${giftId}`;
  }, [currentNetworkInfo.cryptoGiftUrl, giftId]);
  const onCopyPress = useCallback(async () => await copyText(shareUrl || ''), [shareUrl]);
  const getCryptoGiftTgLink = useGetCryptoGiftTgLink();
  const onCopyTgLinkPress = useCallback(
    async () => await copyText(getCryptoGiftTgLink(giftId || '')),
    [getCryptoGiftTgLink, giftId],
  );
  const onSharePress = useCallback(async () => {
    await Share.share({
      message: isIOS ? '' : shareUrl,
      url: shareUrl,
    }).catch(shareError => {
      console.log(shareError);
    });
  }, [shareUrl]);
  useEffectOnce(() => {
    DeviceEventEmitter.emit(CryptoGiftCreateSuccess);
  });
  const onClose = useCallback(() => {
    navigationService.pop(3);
    navigationService.navigate('Tab');
  }, []);
  return (
    <PageContainer
      noCenterDom
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.pageWrap}
      leftDom={
        <Touchable onPress={onClose}>
          <Svg icon="close4" size={pTd(20)} color={theme.colors.iconBase1} iconStyle={{ marginLeft: pTd(16) }} />
        </Touchable>
      }>
      <Image resizeMode="contain" source={boxClose} style={{ width: pTd(171.5), height: pTd(120) }} />
      <View
        style={[
          GStyles.itemCenter,
          GStyles.flexCenter,
          GStyles.flexRow,
          GStyles.marginTop(pTd(8)),
          { width: pTd(226) },
        ]}>
        <TextTitle style={{ textAlign: 'center' }}>Your crypto gift is packaged and ready!</TextTitle>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigationService.pop(2);
          navigationService.navigate('GiftDetail', {
            id: giftId,
          });
        }}>
        <TextM style={[FontStyles.brandNormal, GStyles.marginTop(pTd(24)), styles.details]}>View Details</TextM>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TextM style={styles.tip}>Share the surprise with your friends now!</TextM>
        <CommonButton
          buttonStyle={styles.copyButtonStyle}
          type="primary"
          disabled={false}
          radius={pTd(6)}
          onPress={onCopyPress}>
          <View style={styles.buttonContentWrapper}>
            <Svg icon="copy-thin" size={pTd(16)} color={theme.colors.bgBase1} />
            <TextL style={styles.buttonText}>{t('Copy Link')}</TextL>
          </View>
        </CommonButton>
        <CommonButton
          containerStyle={[GStyles.paddingTop(pTd(16))]}
          buttonStyle={styles.copyTGButtonStyle}
          type="primary"
          disabled={false}
          radius={pTd(6)}
          onPress={onCopyTgLinkPress}>
          <View style={styles.buttonContentWrapper}>
            <Svg icon="telegram-mono" size={pTd(20)} color={defaultColors.bgBase1} />
            <TextL style={[styles.buttonText]}>{t('Copy Telegram Link')}</TextL>
          </View>
        </CommonButton>
        <CommonButton
          onPress={onSharePress}
          containerStyle={[GStyles.paddingTop(pTd(16))]}
          buttonStyle={styles.shareButtonStyle}
          type="outline"
          disabled={false}
          radius={pTd(6)}>
          <View style={styles.buttonContentWrapper}>
            <Svg icon="share-gift" size={pTd(16)} color={theme.colors.textBase1} />
            <TextL style={[styles.buttonText, FontStyles.brandNormal, { color: theme.colors.textBase1 }]}>
              {t('Share')}
            </TextL>
          </View>
        </CommonButton>
      </View>
    </PageContainer>
  );
}
const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    paddingTop: pTd(80),
    alignItems: 'center',
    backgroundColor: theme.colors.bgBase1,
  },
  details: {
    color: theme.colors.textBrand1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: pTd(16),
    width: '100%',
  },
  tip: {
    marginBottom: pTd(16),
    textAlign: 'center',
    color: theme.colors.textBase2,
    width: '100%',
  },
  buttonText: {
    lineHeight: pTd(24),
    marginLeft: pTd(8),
    color: theme.colors.bgBase1,
    ...fonts.mediumFont,
  },
  buttonContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonStyle: {
    backgroundColor: theme.colors.bgBrand1,
    borderRadius: pTd(48),
  },
  copyTGButtonStyle: {
    backgroundColor: theme.colors.bgBrand1,
    borderRadius: pTd(48),
  },
  shareButtonStyle: {
    borderColor: theme.colors.borderNeutral2,
    borderWidth: 1,
    borderRadius: pTd(48),
  },
}));
