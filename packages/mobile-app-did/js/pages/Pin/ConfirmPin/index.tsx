import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import React, { useCallback, useRef } from 'react';
import navigationService from 'utils/navigationService';
import { useAppDispatch } from 'store/hooks';
import { changePin, createWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import CommonToast from 'components/CommonToast';
import { setCredentials } from 'store/user/actions';
import { useUser } from 'hooks/store';
import { setSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import { CAInfoType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useOnManagerAddressAndQueryResult } from 'hooks/login';
import myEvents from 'utils/deviceEvent';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { VerificationType, VerifierInfo } from '@portkey-wallet/types/verifier';
import useBiometricsReady from 'hooks/useBiometrics';
import PinContainer from 'components/PinContainer';
import { GuardiansApproved } from 'pages/Guardian/types';
import { StyleSheet } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import { sendScanLoginSuccess } from '@portkey-wallet/api/api-did/message/utils';
import { changeCanLock } from 'utils/LockManager';
import { VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';
import { LoginTrackTypeEnum, useLoginSuccessTrack } from 'hooks/amplitude';
type RouterParams = {
  oldPin?: string;
  pin?: string;
  managerInfo?: ManagerInfo;
  caInfo?: CAInfoType;
  walletInfo?: AElfWallet;
  verifierInfo?: VerifierInfo;
  guardiansApproved?: GuardiansApproved;
};

export default function ConfirmPin() {
  const { t } = useLanguage();
  const { walletInfo } = useCurrentWallet();
  const {
    pin,
    oldPin,
    managerInfo,
    caInfo,
    walletInfo: paramsWalletInfo,
    verifierInfo,
    guardiansApproved,
  } = useRouterParams<RouterParams>();

  const biometricsReady = useBiometricsReady();

  const pinRef = useRef<DigitInputInterface>();
  const dispatch = useAppDispatch();
  const { biometrics } = useUser();
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult();
  const onChangePin = useCallback(
    async (newPin: string) => {
      if (!oldPin) return;
      changeCanLock(false);
      try {
        if (biometrics) await setSecureStoreItem('Pin', newPin);
        dispatch(changePin({ pin: oldPin, newPin }));
        dispatch(setCredentials({ pin: newPin }));
        CommonToast.success(t('Modified Successfully'));
      } catch (error) {
        CommonToast.failError(error);
      }
      changeCanLock(true);
      navigationService.navigate('AccountSettings');
    },
    [biometrics, dispatch, oldPin, t],
  );

  const loginSuccessTrack = useLoginSuccessTrack();
  const onFinish = useCallback(
    async (confirmPin: string) => {
      if (managerInfo?.verificationType === VerificationType.addManager) {
        loginSuccessTrack({
          type: LoginTrackTypeEnum.Scan,
          isPinNeeded: true,
        });
        dispatch(createWallet({ walletInfo: paramsWalletInfo, caInfo, pin: confirmPin }));
        dispatch(setCredentials({ pin: confirmPin }));
        paramsWalletInfo?.address && sendScanLoginSuccess({ targetClientId: paramsWalletInfo.address });
        if (biometricsReady) {
          navigationService.navigate('SetBiometrics', { pin: confirmPin });
        } else {
          navigationService.reset('Tab');
        }
      } else {
        onManagerAddressAndQueryResult({
          managerInfo: managerInfo as ManagerInfo,
          confirmPin,
          walletInfo,
          pinRef,
          verifierInfo,
          guardiansApproved,
        });
      }
    },
    [
      biometricsReady,
      caInfo,
      dispatch,
      guardiansApproved,
      loginSuccessTrack,
      managerInfo,
      onManagerAddressAndQueryResult,
      paramsWalletInfo,
      verifierInfo,
      walletInfo,
    ],
  );

  const { error: textError, setError: setTextError } = useErrorMessage();
  const onChangeText = useCallback(
    async (confirmPin: string) => {
      if (confirmPin.length !== PIN_SIZE) {
        if (textError.isError) {
          setTextError();
        }
        return;
      }

      if (confirmPin !== pin) {
        pinRef.current?.reset();
        setTextError('Pins do not match', VERIFY_INVALID_TIME);
        return;
      }

      if (oldPin) return onChangePin(confirmPin);
      if (managerInfo) return onFinish(confirmPin);
    },
    [pin, oldPin, onChangePin, managerInfo, onFinish, textError.isError, setTextError],
  );

  return (
    <PageContainer
      titleDom
      type="leftBack"
      backTitle={oldPin ? 'Change Pin' : undefined}
      onGestureStartCallback={() => {
        myEvents.clearSetPin.emit('clearSetPin');
      }}
      leftCallback={() => {
        myEvents.clearSetPin.emit('clearSetPin');
        navigationService.goBack();
      }}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <PinContainer
        showHeader
        ref={pinRef}
        title="Confirm Pin"
        errorMessage={textError.errorMsg}
        onChangeText={onChangeText}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
