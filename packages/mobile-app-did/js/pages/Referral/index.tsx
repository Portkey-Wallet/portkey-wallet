import { useGStyles } from 'assets/theme/useGStyles';
import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import navigationService from 'utils/navigationService';
import { RootStackParamList } from 'navigation';
import SafeAreaBox from 'components/SafeAreaBox';
import { useCredentials } from 'hooks/store';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Welcome from './components/Welcome';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { isIOS, screenHeight } from '@portkey-wallet/utils/mobile/device';
import splashScreen from './img/splashScreen.png';
import background from '../Login/img/background.png';
import * as Application from 'expo-application';

import { BGStyles, FontStyles } from 'assets/theme/styles';
import { sleep } from '@portkey-wallet/utils';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import useLatestIsFocusedRef from 'hooks/useLatestIsFocusedRef';
import { useGetLoginControlListAsync } from '@portkey-wallet/hooks/hooks-ca/cms';

export default function Referral() {
  const credentials = useCredentials();
  const { address, caHash } = useCurrentWalletInfo();
  const gStyles = useGStyles();
  const { t } = useLanguage();
  const getLoginControlListAsync = useGetLoginControlListAsync();
  const isFocusedRef = useLatestIsFocusedRef();
  const [isSplashScreen, setIsSplashScreen] = useState(true);

  const init = useCallback(async () => {
    if (!isFocusedRef.current) return;
    try {
      await Promise.race([getLoginControlListAsync(), sleep(3000)]);
    } catch (error) {
      console.log(error, '=====error-getLoginControlListAsync');
    }
    SplashScreen.hideAsync();
    await sleep(500);
    if (address) {
      let name: keyof RootStackParamList = 'SecurityLock';
      if (credentials && caHash) name = 'Tab';
      navigationService.reset(name);
    }
    await sleep(500);
    setIsSplashScreen(false);
  }, [isFocusedRef, address, getLoginControlListAsync, credentials, caHash]);
  useEffect(() => {
    init();
  }, [init]);
  return (
    <ImageBackground
      style={styles.backgroundContainer}
      resizeMode="cover"
      source={isSplashScreen ? splashScreen : background}>
      <SafeAreaBox pageSafeBottomPadding={!isIOS} style={[gStyles.container, BGStyles.transparent]}>
        {isSplashScreen && (
          <View style={[GStyles.flex1, GStyles.flexEnd, GStyles.itemCenter]}>
            <TextM style={[FontStyles.font3, styles.versionStyle]}>{`V${Application.nativeApplicationVersion}`}</TextM>
          </View>
        )}
        {!isSplashScreen && !address ? (
          <>
            <Welcome />
            <CommonButton
              buttonStyle={[styles.buttonStyle, BGStyles.bg1]}
              titleStyle={FontStyles.font4}
              type="primary"
              title={t('Get Started')}
              onPress={() => navigationService.reset('LoginPortkey')}
            />
          </>
        ) : null}
      </SafeAreaBox>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    height: screenHeight,
  },
  buttonStyle: {
    height: 56,
    marginBottom: 40,
  },
  versionStyle: {
    marginBottom: pTd(32),
  },
});
