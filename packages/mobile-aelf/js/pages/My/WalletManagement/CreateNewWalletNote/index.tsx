import React, { useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { useCredentials } from 'hooks/store';
import { ImageBackground, Text, View } from 'react-native';
import { isIOS, screenHeight } from '@portkey-wallet/utils/mobile/device';
import background from 'pages/Referral/img/getStartWallet.png';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import PageContainer from 'components/PageContainer';
import fonts from 'assets/theme/fonts';
import CommonButton from 'components/CommonButton';
import CommonToast from 'components/CommonToast';
import { useWalletCommonStyles } from '../../../Login/styles';

export default function Referral() {
  const styles = getStyles();
  const credentials = useCredentials();
  const commonStyles = useWalletCommonStyles();

  const createWallet = useCallback(async () => {
    if (!credentials?.pin) {
      CommonToast.fail('Please enter pin first');
      return;
    }
    navigationService.reset('PrepareWallet', { pin: credentials?.pin });
  }, [credentials?.pin]);

  return (
    <PageContainer
      pageSafeBottomPadding={!isIOS}
      scrollViewProps={{ disabled: true }}
      containerStyles={[styles.referralContainer]}
      titleDom
      hideTouchable>
      <Text style={commonStyles.title}>Create a new wallet</Text>
      <Text style={[commonStyles.desc]}>
        Your wallet is secured by a seed phrase, which grants access to your wallet. To ensure asset safety, write your
        seed phrase down in a safe place and never share it with anyone.
      </Text>

      <View style={styles.backgroundContainerWrap}>
        <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background} />
      </View>

      <CommonButton
        style={styles.buttonStyle}
        titleStyle={styles.buttonText}
        title={'Continue'}
        type="primary"
        onPress={createWallet}
      />
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  referralContainer: {
    height: screenHeight,
    backgroundColor: theme.colors.bgBase1,
    justifyContent: 'flex-start',
    gap: 0,
  },
  backgroundSplashContainerWrap: {
    width: '100%',
    height: '100%',
    padding: 50,
    paddingTop: 70,
    backgroundColor: theme.colors.bgBase1,
  },
  backgroundSplashContainer: {
    width: '100%',
    height: '100%',
  },
  backgroundSplashContainerIOS: {
    height: screenHeight,
  },
  backgroundContainerWrap: {
    flex: 1,
    marginTop: pTd(44),
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundContainer: {
    width: pTd(240),
    height: pTd(240),
    padding: 0,
    margin: 0,
    marginTop: pTd(16),
  },
  brandLabel: {
    marginBottom: pTd(16),
  },
  buttonStyle: {
    marginBottom: pTd(16),
  },
  buttonText: {
    fontSize: pTd(16),
    ...fonts.mediumFont,
  },
}));
