import React, { useCallback, useEffect, useRef } from 'react';
import { getSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { checkPin } from 'utils/redux';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';
import PinContainer from 'components/PinContainer';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import GStyles from 'assets/theme/GStyles';
import useLatestIsFocusedRef from 'hooks/useLatestIsFocusedRef';
import { VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useUser } from 'hooks/store';
import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import { AppState, AppStateStatus, NativeEventSubscription } from 'react-native';

type RouterParams = {
  isCheck?: boolean;
  checkCallback?: () => void;
  isBackAllow?: boolean;
};

export default function SecurityLock() {
  const styles = getStyles();
  const { biometrics } = useUser();
  const listener = useRef<NativeEventSubscription>();
  const appStateRef = useRef<AppStateStatus>();

  const isFocusedRef = useLatestIsFocusedRef();
  usePreventHardwareBack();

  const digitInput = useRef<DigitInputInterface>();
  const navigation = useNavigation();
  const locked = useRef<boolean>(false);

  const { isCheck, checkCallback, isBackAllow = false } = useRouterParams<RouterParams>();

  const handleRouter = useThrottleCallback(
    () => {
      if (!isFocusedRef.current) {
        return;
      }
      locked.current = true;
      // TODO: eoa jump login
      // if (!managerInfo) {
      //   return navigationService.reset('LoginPortkey');
      // }
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigationService.reset('Tab');
      }
    },
    [isFocusedRef, navigation],
    2000,
  );

  const dispatch = useAppDispatch();
  const handlePassword = useCallback(
    (pwd: string) => {
      dispatch(setCredentials({ pin: pwd }));
      if (isCheck) {
        checkCallback?.();
        return;
      }
      handleRouter(pwd);
    },
    [checkCallback, dispatch, handleRouter, isCheck],
  );

  const { error: textError, setError: setTextError } = useErrorMessage();
  const onChangeText = useCallback(
    (enterPin: string) => {
      if (enterPin.length === PIN_SIZE) {
        if (!checkPin(enterPin)) {
          digitInput.current?.reset();
          setTextError('Incorrect Pin', VERIFY_INVALID_TIME);
          return;
        }
        handlePassword(enterPin);
      } else if (textError.isError) {
        setTextError();
      }
    },
    [textError.isError, handlePassword, setTextError],
  );

  const handleBio = useCallback(async () => {
    const securePassword = await getSecureStoreItem('Pin');
    if (!securePassword) {
      return;
    }
    handlePassword(securePassword);
  }, [handlePassword]);

  useEffect(() => {
    if (!biometrics) {
      return;
    }
    handleBio();
    listener.current = AppState.addEventListener('change', nextAppState => {
      console.log('LockScreen biometrics appStateRef', nextAppState, appStateRef.current);
      if (appStateRef.current === 'background' && nextAppState === 'active') {
        handleBio();
      }
      appStateRef.current = nextAppState;
    });
    return () => {
      listener.current?.remove();
    };
  }, [biometrics, handleBio]);

  return (
    <PageContainer
      hideHeader={!isBackAllow}
      type="leftBack"
      titleDom=""
      containerStyles={GStyles.flex1}
      scrollViewProps={{ disabled: true }}>
      {biometrics ? (
        <View style={styles.bioPageContainer}>
          <View style={styles.bioSvgContainer}>
            <Svg icon="aelf-logo-with-aelf" size={pTd(150)} />
          </View>
          <CommonButton style={styles.buttonStyle} title={'Unlock'} type="primary" onPress={handleBio} />
        </View>
      ) : (
        <PinContainer
          ref={digitInput}
          title="Enter PIN"
          titleStyle={styles.pinTitle}
          onChangeText={onChangeText}
          errorMessage={textError.errorMsg}
          // isBiometrics={false}
          isBiometrics={biometrics}
        />
      )}
    </PageContainer>
  );
}

const getStyles = makeStyles(_ => ({
  pinTitle: {
    textAlign: 'center',
    marginBottom: pTd(36),
  },
  bioPageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bioSvgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    marginHorizontal: pTd(16),
    marginBottom: pTd(16),
  },
}));
