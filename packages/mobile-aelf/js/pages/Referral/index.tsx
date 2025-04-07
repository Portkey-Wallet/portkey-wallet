import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import navigationService from 'utils/navigationService';
import { useCredentials } from 'hooks/store';
import { ImageBackground, View } from 'react-native';
import { isIOS, screenHeight } from '@portkey-wallet/utils/mobile/device';
import background from './img/getStartWallet.png';
import splashScreen from './img/splashScreen.png';
import { sleep } from '@portkey-wallet/utils';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import useLatestIsFocusedRef from 'hooks/useLatestIsFocusedRef';
import { useGetLoginControlListAsync } from '@portkey-wallet/hooks/hooks-eoa/cms';
import { makeStyles } from '@rneui/themed';
import PageContainer from 'components/PageContainer';
import fonts from 'assets/theme/fonts';
import { getStatusBarHeight } from 'utils/statusbar';
import { useIsAccountExist } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { authenticationReady } from '@portkey-wallet/utils/mobile/authentication';
import { TextH1, TextM } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import { SetBiometricsTypeEnum } from 'pages/Pin/SetBiometrics';
import { useCheckSecurityLock } from 'hooks/securityLock';

export default function Referral() {
  const styles = getStyles();
  const credentials = useCredentials();
  const isAccountExist = useIsAccountExist();

  const getLoginControlListAsync = useGetLoginControlListAsync();
  const isFocusedRef = useLatestIsFocusedRef();
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const checkSecurityLock = useCheckSecurityLock();

  const init = useCallback(async () => {
    if (!isFocusedRef.current) {
      return;
    }
    try {
      await Promise.race([getLoginControlListAsync(), sleep(3000)]);
    } catch (error) {
      console.log(error, '=====error-getLoginControlListAsync');
    }
    if (isAccountExist) {
      if (credentials) {
        navigationService.reset('Tab');
      } else {
        navigationService.push('SecurityLock', {
          isCheck: true,
          checkCallback: () => {
            navigationService.reset('Tab');
          },
          isBackAllow: false,
        });
      }
    }
    // https://docs.expo.dev/versions/v51.0.0/sdk/splash-screen/#splashscreenhideasync
    await sleep(2000);
    SplashScreen.hideAsync();
    setIsSplashScreen(false);
  }, [isFocusedRef, isAccountExist, getLoginControlListAsync, credentials, checkSecurityLock]);

  useEffect(() => {
    init();
  }, [init]);

  const createWallet = useCallback(async () => {
    const isReady = await authenticationReady();
    if (isReady) {
      navigationService.push('SetBiometrics', {
        type: SetBiometricsTypeEnum.create,
      });
      return;
    }

    navigationService.navigate('SetPin');
  }, []);

  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      containerStyles={[styles.referralContainer, GStyles.paddingArg(0, 0)]}
      leftIconType="close"
      leftCallback={undefined}
      rightDom={undefined}
      titleDom
      hideTouchable
      hideHeader>
      {isSplashScreen ? (
        <View style={[isIOS ? { marginTop: -1 * getStatusBarHeight() } : styles.backgroundSplashContainerWrap]}>
          <ImageBackground
            style={isIOS ? styles.backgroundSplashContainerIOS : styles.backgroundSplashContainer}
            resizeMode="cover"
            source={splashScreen}
          />
        </View>
      ) : (
        <View style={styles.backgroundContainerWrap}>
          <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background} />
          <TextH1 style={styles.brandLabel}>{'aelf Wallet'}</TextH1>
          <TextM>{'Smart. Safe. Seamless. Crypto Wallet.'}</TextM>
        </View>
      )}

      {/*<View style={styles.buttonStyle}>*/}
      <CommonButton
        containerStyle={styles.buttonStyle}
        titleStyle={styles.buttonText}
        title={'Create a wallet'}
        type="primary"
        onPress={createWallet}
      />
      {/*</View>*/}

      {/*<View style={styles.buttonStyle}>*/}
      <CommonButton
        containerStyle={styles.buttonStyle}
        titleStyle={styles.buttonText}
        title={'Import an existing wallet'}
        type="outline"
        onPress={() => {
          navigationService.navigate('WalletImportTypeSelect');
        }}
      />
      {/*</View>*/}
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
    marginTop: pTd(100),
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundContainer: {
    width: pTd(240),
    height: pTd(240),
    padding: 0,
    margin: 0,
    marginTop: pTd(20),
  },
  brandLabel: {
    marginBottom: pTd(16),
  },
  buttonStyle: {
    marginHorizontal: pTd(16),
    marginBottom: pTd(16),
  },
  buttonText: {
    fontSize: pTd(16),
    ...fonts.mediumFont,
  },
}));
