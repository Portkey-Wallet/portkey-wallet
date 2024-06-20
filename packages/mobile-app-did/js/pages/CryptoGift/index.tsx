import React, { useCallback, useEffect } from 'react';
import PageContainer from 'components/PageContainer';
import { DeviceEventEmitter, Image, StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { TextL, TextM, TextS, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';
import HistoryCard from './components/HistoryCard';
import { CryptoGiftCreateSuccess, useGetFirstCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import boxOpen from 'assets/image/pngs/box-open.png';

export default function CryptoGift() {
  const { t } = useLanguage();
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
      safeAreaColor={['white']}
      containerStyles={styles.pageStyles}
      pageSafeBottomPadding
      scrollViewProps={{ disabled: false }}>
      <TextXXXL style={[styles.title, FontStyles.size30, GStyles.textAlignCenter, GStyles.lineHeight(pTd(38))]}>
        Crypto Gift
      </TextXXXL>
      <TextM
        style={[
          styles.subTitle,
          FontStyles.neutralSecondaryTextColor,
          GStyles.textAlignCenter,
          GStyles.lineHeight(pTd(22)),
        ]}>
        Send crypto assets as a gift
      </TextM>
      <Image resizeMode="contain" source={boxOpen} style={{ width: pTd(343), height: pTd(240) }} />

      <CommonButton containerStyle={styles.buttonContainer} type="primary" disabled={false} onPress={onGiftCreatePress}>
        <TextL style={styles.buttonText}>{t('Send Crypto Gift')}</TextL>
      </CommonButton>
      {firstCryptoGift && firstCryptoGift.exist && (
        <HistoryCard
          containerStyle={styles.hsCardContainer}
          showTitle
          redPacketDetail={firstCryptoGift || undefined}
          isSkeleton={loading}
        />
      )}
      <View style={styles.noteWrap}>
        <TextM style={styles.noteTextTitle}>{t('About Crypto Gift')}</TextM>
        <View style={styles.qaWrapper}>
          <TextM style={styles.noteTextQuestion}>{t('What is crypto gift?')}</TextM>
          <TextS style={styles.noteTextAnswer}>
            {t(
              'Crypto gift allows Portkey users to send crypto assets to anyone as a gift, adding an element of fun and surprise.',
            )}
          </TextS>
        </View>
        <View style={styles.qaWrapper}>
          <TextM style={styles.noteTextQuestion}>{t('How to send a crypto gift?')}</TextM>
          <TextS style={styles.noteTextAnswer}>
            {t(
              'Click "Send Crypto Gift" and customise the gift by selecting the asset, quantity, and requirements for claimers. After the gift is sent, a gift link will be generated, which you can then share with friends.',
            )}
          </TextS>
        </View>
        <View style={styles.qaWrapper}>
          <TextM style={styles.noteTextQuestion}>{t('How to claim a crypto gift?')}</TextM>
          <TextS style={styles.noteTextAnswer}>
            {t(
              'Click on the crypto gift link and log in to your Portkey account to check eligibility. If you qualify, simply claim the gift.',
            )}
          </TextS>
        </View>
      </View>
    </PageContainer>
  );
}
const styles = StyleSheet.create({
  pageStyles: {
    backgroundColor: defaultColors.neutralDefaultBG,
    flex: 1,
  },
  title: {
    marginTop: pTd(16),
  },
  subTitle: {
    marginTop: pTd(8),
    marginBottom: pTd(32),
  },
  buttonContainer: {
    paddingVertical: pTd(32),
  },
  buttonText: {
    lineHeight: pTd(24),
    color: defaultColors.neutralContainerBG,
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
});
