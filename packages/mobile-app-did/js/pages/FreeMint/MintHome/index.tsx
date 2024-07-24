import React, { useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextXXXL, TextM, TextL, TextS } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import freeMintLogo from 'assets/image/pngs/freeMintLogo.png';
import fonts from 'assets/theme/fonts';
import Divider from 'components/Divider';
import { showFreeMintModal } from '../components/FreeMintModal';
import Svg from 'components/Svg';
import { FreeMintStatus } from '@portkey-wallet/types/types-ca/freeMint';
import CommonToast from 'components/CommonToast';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useFreeMintInfo } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import Loading from 'components/Loading';

const MintHome = () => {
  const { recentStatus } = useRouterParams<{ recentStatus: FreeMintStatus }>();
  const fetchMintInfo = useFreeMintInfo();
  const { t } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onMintPress = useCallback(async () => {
    try {
      Loading.show();
      const { isLimitExceed } = await fetchMintInfo();
      if (isLimitExceed) {
        CommonToast.fail('You have reached the daily limit of 5 free mint NFTs. Take a rest and come back tomorrow!');
        return;
      }
      showFreeMintModal();
    } finally {
      Loading.hide();
      if (recentStatus === FreeMintStatus.LimitExceed) {
        CommonToast.fail('You have reached the daily limit of 5 free mint NFTs. Take a rest and come back tomorrow!');
      } else {
        showFreeMintModal();
      }
    }
    showFreeMintModal();
  }, [fetchMintInfo, recentStatus]);
  return (
    <PageContainer
      noCenterDom
      safeAreaColor={['white']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: false }}>
      <TextXXXL style={[styles.title, FontStyles.size30, GStyles.textAlignCenter, GStyles.lineHeight(pTd(38))]}>
        NFT Free Mint
      </TextXXXL>
      {/* <TextM
        style={[
          styles.subTitle,
          FontStyles.neutralSecondaryTextColor,
          GStyles.textAlignCenter,
          GStyles.lineHeight(pTd(22)),
        ]}>
        Send crypto assets as a gift
      </TextM> */}
      <Image resizeMode="contain" source={freeMintLogo} style={{ width: pTd(343), height: pTd(240) }} />

      <CommonButton containerStyle={styles.buttonContainer} type="primary" disabled={false} onPress={onMintPress}>
        <TextL style={styles.buttonText}>{t('Get Started')}</TextL>
      </CommonButton>
      <View style={styles.noteWrap}>
        <View style={styles.explainContainer}>
          <View style={styles.numberContainer}>
            <TextS style={styles.textNumber}>1</TextS>
          </View>
          <View style={styles.explainContentContainer}>
            <TextL style={styles.explainTitle}>Upload a Picture</TextL>
            <TextM style={styles.explainContent}>Choose any image you like for your NFT.</TextM>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.explainContainer}>
          <View style={styles.numberContainer}>
            <TextS style={styles.textNumber}>2</TextS>
          </View>
          <View style={styles.explainContentContainer}>
            <TextL style={styles.explainTitle}>Customise the Minting</TextL>
            <TextM style={styles.explainContent}>Give your NFT a name and description to make it stand out.</TextM>
          </View>
        </View>
      </View>
      <View style={styles.hintContainer}>
        <Svg icon="suggest-circle" size={pTd(16)} />
        <TextS style={styles.hintText}>
          {t(
            `Notice: If you want to send the NFT to the MainChain after it's minted, please wait around 15 minutes for data synchronisation.`,
          )}
        </TextS>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  pageStyles: {
    backgroundColor: defaultColors.neutralDefaultBG,
    flex: 1,
    paddingBottom: pTd(40),
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
  explainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  numberContainer: {
    backgroundColor: defaultColors.brandLight,
    width: pTd(22),
    height: pTd(22),
    borderRadius: pTd(18),
    marginRight: pTd(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pTd(1),
  },
  textNumber: {
    color: defaultColors.brandNormal,
    lineHeight: pTd(16),
    ...fonts.mediumFont,
  },
  explainContentContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  explainTitle: {
    color: defaultColors.neutralPrimaryTextColor,
    lineHeight: pTd(24),
    ...fonts.mediumFont,
  },
  explainContent: {
    color: defaultColors.secondaryTextColor,
    lineHeight: pTd(22),
    ...fonts.regularFont,
  },
  divider: {
    height: pTd(16),
    backgroundColor: 'transparent',
  },
  hintContainer: {
    flexDirection: 'row',
    marginTop: pTd(16),
    marginRight: pTd(16),
  },
  hintText: {
    color: defaultColors.neutralSecondaryTextColor,
    marginLeft: pTd(6),
  },
});

export default MintHome;
