import React, { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import navigationService from 'utils/navigationService';
import { RootStackParamList } from 'navigation';
import { useCredentials } from 'hooks/store';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Welcome from './components/Welcome';
import { ImageBackground, View } from 'react-native';
import { screenHeight } from '@portkey-wallet/utils/mobile/device';
import background from './img/getStartedBg.png';
import { sleep } from '@portkey-wallet/utils';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import useLatestIsFocusedRef from 'hooks/useLatestIsFocusedRef';
import { useGetLoginControlListAsync } from '@portkey-wallet/hooks/hooks-ca/cms';
import { makeStyles } from '@rneui/themed';
import PageContainer from 'components/PageContainer';
import { TextL } from 'components/CommonText';
import fonts from 'assets/theme/fonts';

export default function Referral() {
  const styles = getStyles();
  const credentials = useCredentials();
  const { address, caHash } = useCurrentWalletInfo();

  const { t } = useLanguage();
  const getLoginControlListAsync = useGetLoginControlListAsync();
  const isFocusedRef = useLatestIsFocusedRef();
  // const [isSplashScreen, setIsSplashScreen] = useState(true);

  const init = useCallback(async () => {
    if (!isFocusedRef.current) return;
    try {
      await Promise.race([getLoginControlListAsync(), sleep(3000)]);
    } catch (error) {
      console.log(error, '=====error-getLoginControlListAsync');
    }
    if (address) {
      let name: keyof RootStackParamList = 'SecurityLock';
      if (credentials && caHash) name = 'Tab';
      navigationService.reset(name);
    }
    await sleep(500);
    SplashScreen.hideAsync();
    // await sleep(500);
    // setIsSplashScreen(false);
  }, [isFocusedRef, address, getLoginControlListAsync, credentials, caHash]);

  useEffect(() => {
    init();
  }, [init]);

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
      {/* <ImageBackground
        style={isSplashScreen ? styles.backgroundSplashContainer : styles.backgroundContainer}
        resizeMode="cover"
        source={isSplashScreen ? splashScreen : background}
      /> */}
      <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background} />

      {/* {isSplashScreen && (
        <View style={[GStyles.flex1, GStyles.flexEnd, GStyles.itemCenter]}>
          <TextM style={[FontStyles.font22, styles.versionStyle]}>{`V${Application.nativeApplicationVersion}`}</TextM>
        </View>
      )} */}
      {!address ? (
        <>
          <Welcome />

          <CommonButton
            buttonStyle={[styles.buttonStyle]}
            type="transparent"
            onPress={() => navigationService.reset('LoginPortkey')}>
            <View style={styles.buttonContainer}>
              <TextL style={styles.buttonText}>{'Get Started'}</TextL>
            </View>
          </CommonButton>
        </>
      ) : null}
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
  backgroundSplashContainer: {
    // height: screenHeight,
  },
  backgroundContainer: {
    width: '100%',
    height: pTd(407),
    padding: 0,
    margin: 0,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgBrand1,
    width: '100%',
    height: '100%',
    borderRadius: pTd(38),
  },
  buttonStyle: {
    marginHorizontal: pTd(16),
    height: pTd(48),
    marginBottom: pTd(16),
    borderWidth: pTd(1.5),
    paddingVertical: pTd(3.5),
    paddingHorizontal: pTd(3.5),
  },
  buttonText: {
    color: theme.colors.textNeutral4,
    ...fonts.mediumFont,
  },
  versionStyle: {
    marginBottom: pTd(32),
  },
}));
