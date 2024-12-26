import React, { useCallback } from 'react';
import { View, Image } from 'react-native';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { TextM, TextH1 } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import CommonToast from 'components/CommonToast';
import { useFreeMintInfo } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import Loading from 'components/Loading';
import { makeStyles } from '@rneui/themed';
import OutlinedTextButton from 'components/OutlinedTextButton';
import navigationService from 'utils/navigationService';

const MintHome = () => {
  const styles = getStyles();
  const fetchMintInfo = useFreeMintInfo();
  const { t } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onMintPress = useCallback(async () => {
    try {
      Loading.show();
      const { isLimitExceed, limitCount } = await fetchMintInfo();
      if (isLimitExceed) {
        return CommonToast.fail(
          `You have reached the daily limit of ${limitCount || 5} free mint NFTs. Take a rest and come back tomorrow!`,
        );
      }
      navigationService.navigate('MintProcess');
    } finally {
      Loading.hide();
    }
  }, [fetchMintInfo]);
  return (
    <PageContainer
      noCenterDom
      safeAreaColor={['black']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: true }}>
      <TextH1 style={styles.title}>{t('Mint NFT for Free')}</TextH1>
      <TextM style={styles.subTitle}>{t('Upload any image you like! You can mint up to 5 NFTs per day.')}</TextM>
      <Image source={require('../../../assets/image/pngs/mint_nft_cover.png')} style={[styles.image]} />
      <View style={GStyles.flex1} />
      <OutlinedTextButton
        style={styles.button}
        textStyle={styles.buttonText}
        title={t('Get started')}
        onPress={onMintPress}
      />
    </PageContainer>
  );
};
const getStyles = makeStyles(theme => ({
  pageStyles: {
    backgroundColor: theme.colors.bgBase1,
    flex: 1,
    paddingBottom: pTd(24),
    paddingHorizontal: 0,
    flexDirection: 'column',
    height: '100%',
  },
  container: {
    flexDirection: 'column',
    backgroundColor: 'red',
    height: '100%',
  },
  title: {
    marginTop: pTd(24),
    paddingHorizontal: pTd(16),
  },
  subTitle: {
    marginTop: pTd(16),
    ...fonts.SGRegularFont,
    color: theme.colors.textBase2,
    paddingHorizontal: pTd(16),
  },
  image: {
    width: '100%',
    height: pTd(236),
    marginTop: pTd(64),
  },
  button: {
    marginHorizontal: pTd(16),
  },
  buttonText: {
    ...fonts.SGMediumFont,
    fontSize: pTd(16),
  },
}));
export default MintHome;
