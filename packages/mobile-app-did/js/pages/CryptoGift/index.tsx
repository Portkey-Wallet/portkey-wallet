import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import { Image, View } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import { TextL, TextM, TextH1 } from 'components/CommonText';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { makeStyles } from '@rneui/themed';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import boxOpen from 'assets/image/pngs/box-open.png';
import CommonTooltip from 'components/CommonTooltip';

export default function CryptoGift() {
  const { t } = useLanguage();
  const styles = getStyles();
  const onGiftCreatePress = useCallback(() => {
    navigationService.navigate('SendPacketGroupPage', {
      isCryptoGift: true,
    });
  }, []);
  const onViewSentGifts = useCallback(() => {
    navigationService.navigate('GiftHistory');
  }, []);
  return (
    <PageContainer
      noCenterDom
      containerStyles={styles.pageStyles}
      rightDom={
        <CommonTooltip
          iconStyle={{ marginRight: pTd(16) }}
          iconName="help-white"
          iconSize={pTd(24)}
          tooltipProps={{
            title: 'About crypto gift',
            description: `Crypto Gift lets Portkey users send crypto assets as gifts.

To get started, click "Create crypto gift" to choose the asset, quantity, and claim requirements. After sending, share the generated gift link with friends.

To claim, click the link, log in to your Portkey account, and verify eligibility. Gifts are valid for 24 hours, and unclaimed tokens or NFTs are returned to you afterward.`,
          }}
        />
      }
      scrollViewProps={{ disabled: true }}>
      <TextH1 style={[styles.title, GStyles.lineHeight(pTd(38))]}>Crypto gift</TextH1>
      <TextM style={[styles.subTitle, GStyles.lineHeight(pTd(19.6))]}>
        Spread joy with Portkey&apos;s Crypto Gift feature—send crypto assets to anyone as a gift!
      </TextM>
      <Image resizeMode="contain" source={boxOpen} style={{ width: pTd(343), height: pTd(240) }} />
      <View style={styles.multiBtnWrap}>
        <CommonButton buttonStyle={styles.createBtnStyle} type="transparent" onPress={onGiftCreatePress}>
          <View style={styles.createBtnContainer}>
            <TextL style={styles.createBtnText}>{t('Create Crypto Gift')}</TextL>
          </View>
        </CommonButton>
        <CommonButton buttonStyle={styles.ViewBtnStyle} type="transparent" onPress={onViewSentGifts}>
          <View style={styles.ViewBtnContainer}>
            <TextL style={styles.ViewBtnText}>{t('View sent gifts')}</TextL>
          </View>
        </CommonButton>
      </View>
      {/* <CommonButton
          containerStyle={styles.button}
          buttonStyle={styles.buttonStyle}
          type="transparent"
          onPress={onGiftCreatePress}>
          <View style={styles.buttonContainer}>
            <TextL style={styles.buttonText}>{t('Create Crypto Gift')}</TextL>
          </View>
        </CommonButton> */}
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
  multiBtnWrap: {
    position: 'absolute',
    left: pTd(16),
    bottom: pTd(24),
  },
  createBtnStyle: {
    height: pTd(48),
    paddingVertical: pTd(0),
    paddingHorizontal: pTd(0),
  },
  createBtnContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgBrand1,
    borderRadius: pTd(38),
  },
  createBtnText: {
    lineHeight: pTd(24),
    color: theme.colors.textBrand4,
    ...fonts.mediumFont,
  },
  ViewBtnStyle: {
    marginTop: pTd(16),
    height: pTd(48),
    paddingVertical: pTd(0),
    paddingHorizontal: pTd(0),
  },
  ViewBtnContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(38),
    borderWidth: 1,
    borderColor: theme.colors.borderNeutral2,
  },
  ViewBtnText: {
    lineHeight: pTd(16),
    color: theme.colors.textBase1,
    ...fonts.mediumFont,
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
}));
