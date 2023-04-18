import { useGStyles } from 'assets/theme/useGStyles';
import React, { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import navigationService from 'utils/navigationService';
import { RootStackParamList } from 'navigation';
import SafeAreaBox from 'components/SafeAreaBox';
import { useCredentials } from 'hooks/store';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Welcome from './components/Welcome';
import { ImageBackground, StyleSheet } from 'react-native';
import { isIos, screenHeight } from '@portkey-wallet/utils/mobile/device';
import background from '../Login/img/background.png';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { sleep } from '@portkey-wallet/utils';

export default function Referral() {
  const credentials = useCredentials();
  const { address } = useCurrentWalletInfo();
  const gStyles = useGStyles();
  const { t } = useLanguage();
  const init = useCallback(async () => {
    await sleep(200);
    if (address) {
      let name: keyof RootStackParamList = 'SecurityLock';
      if (credentials) name = 'Tab';
      navigationService.reset(name);
    }

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, [credentials, address]);
  useEffect(() => {
    init();
  }, [init]);
  return (
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background}>
      <SafeAreaBox pageSafeBottomPadding={!isIos} style={[gStyles.container, BGStyles.transparent]}>
        {!address ? (
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
});
