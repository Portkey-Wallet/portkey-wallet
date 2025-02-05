import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { checkPin } from 'utils/redux';
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

type RouterParams = {
  isCheck?: boolean;
  checkCallback?: () => void;
  isBackAllow?: boolean;
};

export default function SecurityLock() {
  const styles = getStyles();

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

  return (
    <PageContainer
      hideHeader={!isBackAllow}
      type="leftBack"
      titleDom=""
      containerStyles={GStyles.flex1}
      scrollViewProps={{ disabled: true }}>
      <PinContainer
        ref={digitInput}
        title="Enter PIN"
        titleStyle={styles.pinTitle}
        onChangeText={onChangeText}
        errorMessage={textError.errorMsg}
        isBiometrics={false}
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
