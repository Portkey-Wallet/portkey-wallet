import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import navigationService from 'utils/navigationService';
// import { RootStackParamList } from 'navigation';
import { useCredentials } from 'hooks/store';
// import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Welcome from './components/Welcome';
import { ImageBackground, View } from 'react-native';
import { isIOS, screenHeight } from '@portkey-wallet/utils/mobile/device';
import background from './img/getStartedBg.png';
import splashScreen from './img/splashScreen.png';
import { sleep } from '@portkey-wallet/utils';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import useLatestIsFocusedRef from 'hooks/useLatestIsFocusedRef';
import { useGetLoginControlListAsync } from '@portkey-wallet/hooks/hooks-ca/cms';
import { makeStyles } from '@rneui/themed';
import PageContainer from 'components/PageContainer';
import fonts from 'assets/theme/fonts';
import { getStatusBarHeight } from 'utils/statusbar';
import OutlinedTextButton from 'components/OutlinedTextButton';
import { useAddWallet, useIsAccountExist } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import { RootStackParamList } from 'navigation';

export default function Referral() {
  const styles = getStyles();
  const credentials = useCredentials();
  const isAccountExist = useIsAccountExist();

  const getLoginControlListAsync = useGetLoginControlListAsync();
  const isFocusedRef = useLatestIsFocusedRef();
  const [isSplashScreen, setIsSplashScreen] = useState(true);

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
      let name: keyof RootStackParamList = 'SecurityLock';
      if (credentials) {
        name = 'Tab';
      }
      navigationService.reset(name);
    }
    await sleep(500);
    SplashScreen.hideAsync();
    setIsSplashScreen(false);
  }, [isFocusedRef, isAccountExist, getLoginControlListAsync, credentials]);

  useEffect(() => {
    init();
  }, [init]);

  const addWallet = useAddWallet();
  const dispatch = useAppDispatch();
  const createWallet = useCallback(() => {
    const pin = '111111';
    addWallet(pin);
    dispatch(setCredentials({ pin }));
  }, [addWallet, dispatch]);

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
        <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background} />
      )}

      {/* {!address ? (
        <> */}
      <Welcome />

      <OutlinedTextButton
        style={styles.buttonStyle}
        textStyle={styles.buttonText}
        title={'Get started'}
        onPress={() => {
          createWallet();
          navigationService.reset('Tab');
        }}
      />
      {/* </>
      ) : null} */}
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
  backgroundContainer: {
    width: '100%',
    height: pTd(407),
    padding: 0,
    margin: 0,
    marginTop: pTd(16),
  },
  buttonStyle: {
    marginHorizontal: pTd(16),
    marginBottom: pTd(16),
  },
  buttonText: {
    color: theme.colors.textNeutral4,
    fontSize: pTd(16),
    ...fonts.mediumFont,
  },
}));
