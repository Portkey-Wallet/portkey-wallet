import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import React, { useCallback, useRef, useState } from 'react';
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

  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  const dispatch = useAppDispatch();
  const { biometrics } = useUser();
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult();
  const onChangePin = useCallback(
    async (newPin: string) => {
      if (!oldPin) return;
      try {
        if (biometrics) await setSecureStoreItem('Pin', newPin);
        dispatch(changePin({ pin: oldPin, newPin }));
        dispatch(setCredentials({ pin: newPin }));
        CommonToast.success(t('Modified Successfully'));
      } catch (error) {
        CommonToast.failError(error);
      }
      navigationService.navigate('AccountSettings');
    },
    [biometrics, dispatch, oldPin, t],
  );
  const onFinish = useCallback(
    async (confirmPin: string) => {
      if (managerInfo?.verificationType === VerificationType.addManager) {
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
      managerInfo,
      onManagerAddressAndQueryResult,
      paramsWalletInfo,
      verifierInfo,
      walletInfo,
    ],
  );

  const onChangeText = useCallback(
    async (confirmPin: string) => {
      if (confirmPin.length !== PIN_SIZE) {
        if (errorMessage) setErrorMessage(undefined);
        return;
      }

      if (confirmPin !== pin) {
        pinRef.current?.reset();
        return setErrorMessage('Pins do not match');
      }

      if (oldPin) return onChangePin(confirmPin);
      if (managerInfo) return onFinish(confirmPin);
    },
    [errorMessage, oldPin, onChangePin, onFinish, pin, managerInfo],
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
        errorMessage={errorMessage}
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
