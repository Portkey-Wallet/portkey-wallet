import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import { useUser } from 'hooks/store';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { checkPin } from 'utils/redux';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import Loading from 'components/Loading';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';
import { TimerResult } from 'utils/wallet';
import useEffectOnce from 'hooks/useEffectOnce';
import PinContainer from 'components/PinContainer';
import { getSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import GStyles from 'assets/theme/GStyles';
import useLatestIsFocusedRef from 'hooks/useLatestIsFocusedRef';
import { VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';

type RouterParams = {
  isCheck?: boolean;
  checkCallback?: () => void;
};

export default function SecurityLock() {
  const styles = getStyles();
  const { biometrics } = useUser();
  const appStateRef = useRef<AppStateStatus>();
  const isFocusedRef = useLatestIsFocusedRef();
  usePreventHardwareBack();
  const timer = useRef<TimerResult>();
  const digitInput = useRef<DigitInputInterface>();
  const navigation = useNavigation();
  const locked = useRef<boolean>(false);

  const { isCheck, checkCallback } = useRouterParams<RouterParams>();

  const handleRouter = useThrottleCallback(
    () => {
      Loading.hide();
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
      if (isCheck) {
        checkCallback?.();
        return;
      }

      dispatch(setCredentials({ pin: pwd }));
      handleRouter(pwd);
    },
    [checkCallback, dispatch, handleRouter, isCheck],
  );

  const verifyBiometrics = useThrottleCallback(
    // TODO: eoa
    async () => {
      if (!biometrics) {
        return;
      }
      try {
        const securePassword = await getSecureStoreItem('Pin');
        if (!securePassword) {
          throw new Error('No password');
        }
        handlePassword(securePassword);
      } catch (error: any) {
        // if (!isUserBiometricsError(error)) {
        //   ActionSheet.alert({
        //     title: 'Biometric authentication expired',
        //     message: 'Please re-enable it by going to Settings - Security - Biometric Authentication.',
        //     buttons: [{ title: 'OK', type: 'primary' }],
        //   });
        // }
      }
    },
    [biometrics, handlePassword],
    2000,
  );
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && appStateRef.current !== 'active') {
        verifyBiometrics();
        appStateRef.current = nextAppState;
      }
    },
    [verifyBiometrics],
  );
  useEffectOnce(() => {
    if (!navigation.canGoBack()) {
      verifyBiometrics();
    }
  });
  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      timer.current?.remove();
      listener.remove();
    };
  }, [handleAppStateChange]);

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
  return (
    <PageContainer hideHeader containerStyles={GStyles.flex1} scrollViewProps={{ disabled: true }}>
      <PinContainer
        ref={digitInput}
        title="Enter PIN"
        titleStyle={styles.pinTitle}
        onChangeText={onChangeText}
        errorMessage={textError.errorMsg}
        isBiometrics={biometrics}
        onBiometricsPress={verifyBiometrics}
      />
    </PageContainer>
  );
}

const getStyles = makeStyles(_ => ({
  pinTitle: {
    textAlign: 'center',
    marginBottom: pTd(36),
  },
}));
