import React, { useCallback, useEffect } from 'react';
import PageContainer from 'components/PageContainer';
import { DeviceEventEmitter, Image, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { TextL, TextM, TextS, TextH1 } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { makeStyles } from '@rneui/themed';
import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import HistoryCard from './components/HistoryCard';
import { CryptoGiftCreateSuccess, useGetFirstCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import boxOpen from 'assets/image/pngs/box-open.png';

export default function CryptoGift() {
  const { t } = useLanguage();
  const styles = getStyles();
  const { firstCryptoGift, loading, getFirstCryptoGift } = useGetFirstCryptoGift();
  useEffect(() => {
    const eventListener = DeviceEventEmitter.addListener(CryptoGiftCreateSuccess, () => {
      getFirstCryptoGift();
    });
    return () => {
      eventListener.remove();
    };
  }, [getFirstCryptoGift]);
  const onGiftCreatePress = useCallback(() => {
    navigationService.navigate('SendPacketGroupPage', {
      isCryptoGift: true,
    });
  }, []);
  return (
    <PageContainer
      noCenterDom
      containerStyles={styles.pageStyles}
      rightDom={
        <Touchable
          onPress={() => {
            // TODO: help
          }}>
          <Svg icon="help-white" size={pTd(24)} iconStyle={styles.headerHelpIcon} />
        </Touchable>
      }
      scrollViewProps={{ disabled: true }}>
      <TextH1 style={[styles.title, GStyles.lineHeight(pTd(38))]}>Crypto gift</TextH1>
      <TextM style={[styles.subTitle, GStyles.lineHeight(pTd(19.6))]}>
        Spread joy with Portkey&apos;s Crypto Gift feature—send crypto assets to anyone as a gift!
      </TextM>
      <Image resizeMode="contain" source={boxOpen} style={{ width: pTd(343), height: pTd(240) }} />

      <CommonButton
        containerStyle={styles.button}
        buttonStyle={styles.buttonStyle}
        type="transparent"
        onPress={onGiftCreatePress}>
        <View style={styles.buttonContainer}>
          <TextL style={styles.buttonText}>{t('Create Crypto Gift')}</TextL>
        </View>
      </CommonButton>
    </PageContainer>
  );
}
const getStyles = makeStyles(theme => ({
  pageStyles: {
    backgroundColor: theme.colors.bgBase1,
    flex: 1,
  },
  headerHelpIcon: { marginRight: pTd(16) },
  title: {
    marginTop: pTd(24),
  },
  subTitle: {
    marginTop: pTd(16),
    marginBottom: pTd(64),
    color: theme.colors.textBase2,
  },
  button: {
    position: 'absolute',
    left: pTd(16),
    bottom: pTd(24),
  },
  buttonStyle: {
    height: pTd(48),
    borderWidth: pTd(1.5),
    paddingVertical: pTd(3.5),
    paddingHorizontal: pTd(3.5),
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgBrand1,
    borderRadius: pTd(38),
  },
  buttonText: {
    lineHeight: pTd(24),
    color: theme.colors.bgNeutral4,
    ...fonts.mediumFont,
  },
  noteWrap: {
    width: '100%',
    backgroundColor: defaultColors.neutralHoverBG,
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(16),
    borderRadius: pTd(6),
  },
  qaWrapper: {
    marginTop: pTd(12),
  },
  noteTextTitle: {
    ...fonts.mediumFont,
    ...GStyles.lineHeight(pTd(22)),
  },
  noteTextQuestion: {
    ...fonts.regularFont,
    ...GStyles.lineHeight(pTd(22)),
  },
  noteTextAnswer: {
    color: defaultColors.neutralTertiaryText,
    marginTop: pTd(4),
    ...GStyles.lineHeight(pTd(16)),
  },
  hsCardContainer: {
    marginBottom: pTd(16),
  },
}));
