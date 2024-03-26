import React, { useCallback, useState, useMemo } from 'react';
import { TextL, TextS } from '@portkey-wallet/rn-components/components/CommonText';
import PageContainer from 'components/PageContainer';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import { Image, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { BGStyles } from 'assets/theme/styles';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';
import { pTd } from 'utils/unit';
import { handleErrorMessage } from '@portkey-wallet/utils';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { getVerifiedAndLockWallet } from 'model/verify/core';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import { PortkeyEntries } from 'config/entries';
import useBaseContainer from 'model/container/UseBaseContainer';
import { authenticateAsync, LocalAuthenticationResult } from 'expo-local-authentication';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useSetBiometrics } from 'hooks/useBiometrics';

const ScrollViewProps = { disabled: true };

/* Biometrics */
export async function touchAuth(): Promise<LocalAuthenticationResult> {
  const options = {
    hintMessage: 'Verify your identity',
    fallbackLabel: 'Use password',
    promptMessage: 'AELF identity authentication',
  };
  return await authenticateAsync(options);
}
export default function SetBiometrics({ pin, deliveredSetPinInfo }: SetBiometricsProps) {
  usePreventHardwareBack();
  const setBiometrics = useSetBiometrics();
  // const { pin, caInfo: paramsCAInfo } = useRouterParams<{ pin?: string; caInfo?: CAInfo }>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { onFinish } = useBaseContainer({
    entryName: PortkeyEntries.SET_BIO,
  });

  const getResult = useCallback(
    async (useBiometrics = false) => {
      Loading.show();
      const res = await getVerifiedAndLockWallet(deliveredSetPinInfo, pin, useBiometrics);
      Loading.hide();
      if (res) {
        onFinish({
          animated: false,
          status: 'success',
          data: {
            finished: true,
          },
        });
      } else {
        setErrorMessage('network failure');
      }
    },
    [deliveredSetPinInfo, onFinish, pin],
  );

  const openBiometrics = async () => {
    if (!pin) {
      return;
    }
    try {
      const res = await touchAuth();
      if (!res?.success) {
        CommonToast.failError('Failed To Verify');
        return;
      }
      setBiometrics(true);
      await getResult(true);
    } catch (error) {
      Loading.hide();
      setErrorMessage(handleErrorMessage(error, 'Failed To Verify'));
    }
  };
  const onSkip = async () => {
    try {
      await getResult();
      onFinish({
        animated: false,
        status: 'success',
        data: {
          finished: true,
        },
      });
    } catch (error) {
      Loading.hide();
      CommonToast.failError(error);
    }
  };
  useEffectOnce(() => {
    setTimeout(() => {
      openBiometrics();
    }, 100);
  });
  const biometricIcon = useMemo(() => {
    if (isIOS) {
      return { uri: 'biometric' };
    } else {
      return require('../../../assets/image/pngs/biometric.png');
    }
  }, []);
  return (
    <PageContainer scrollViewProps={ScrollViewProps} leftDom titleDom containerStyles={styles.containerStyles}>
      <Touchable style={GStyles.itemCenter} onPress={openBiometrics}>
        <Image resizeMode="contain" source={biometricIcon} style={styles.biometricIcon} />
        <TextL style={styles.tipText}>Enable biometric authentication</TextL>
        {errorMessage ? <TextS style={styles.errorText}>{errorMessage}</TextS> : null}
      </Touchable>
      <CommonButton type="clear" title="Skip" buttonStyle={BGStyles.transparent} onPress={onSkip} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: 'space-around',
    paddingBottom: 52,
    paddingTop: '25%',
    alignItems: 'center',
    flex: 1,
  },
  tipText: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 16,
    color: defaultColors.error,
  },
  biometricIcon: {
    width: pTd(124),
    height: pTd(124),
  },
});

export interface SetBiometricsProps {
  pin: string;
  deliveredSetPinInfo: string; // SetPinInfo
}

export interface SetBiometricsResult {}
