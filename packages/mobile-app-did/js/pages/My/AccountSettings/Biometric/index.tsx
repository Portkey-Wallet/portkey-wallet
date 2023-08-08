import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import ListItem from 'components/ListItem';
import { touchAuth } from '@portkey-wallet/utils/mobile/authentication';
import CommonToast from 'components/CommonToast';
import useBiometricsReady, { useSetBiometrics } from 'hooks/useBiometrics';
import navigationService from 'utils/navigationService';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { checkPin } from 'utils/redux';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
import { useUser } from 'hooks/store';
import { TextM } from 'components/CommonText';
import ActionSheet from 'components/ActionSheet';
import { setSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import myEvents from 'utils/deviceEvent';
import { changeCanLock } from 'utils/LockManager';

export default function Biometric() {
  const { biometrics } = useUser();
  const setBiometrics = useSetBiometrics();
  const biometricsReady = useBiometricsReady();
  const { t } = useLanguage();
  const openBiometrics = useCallback(
    async (pin: string) => {
      if (checkPin(pin)) {
        changeCanLock(false);
        try {
          await setSecureStoreItem('Pin', pin);
          await setBiometrics(true);
        } catch (error: any) {
          CommonToast.failError(error, i18n.t('Failed to enable biometrics'));
          await setBiometrics(false);
        }
        changeCanLock(true);
      }
    },
    [setBiometrics],
  );
  useEffectOnce(() => {
    const listener = myEvents.openBiometrics.addListener(openBiometrics);
    return () => listener.remove();
  });
  const onValueChange = useCallback(
    async (value: boolean) => {
      if (value) {
        // const result = await authenticationReady();
        // if (!result) return CommonToast.fail('This device does not currently support biometrics');
        navigationService.navigate('CheckPin', { openBiometrics: true });
      } else {
        ActionSheet.alert({
          title2: 'Disable fingerprint login?',
          buttons: [
            { type: 'outline', title: 'Cancel' },
            {
              type: 'primary',
              title: 'Confirm',
              onPress: async () => {
                changeCanLock(false);
                try {
                  const enrolled = await touchAuth();
                  if (enrolled.success) await setBiometrics(value);
                  else CommonToast.fail(enrolled.warning || enrolled.error);
                } catch (error) {
                  CommonToast.failError(error, i18n.t('Failed to enable biometrics'));
                }
                changeCanLock(true);
              },
            },
          ],
        });
      }
    },
    [setBiometrics],
  );
  return (
    <PageContainer containerStyles={styles.containerStyles} safeAreaColor={['blue', 'gray']} titleDom={t('Biometric')}>
      {biometricsReady && (
        <>
          <ListItem
            disabled
            switching
            switchValue={biometrics}
            style={styles.listStyle}
            onValueChange={onValueChange}
            title={t('Biometric Authentication')}
          />
          <TextM style={styles.tipText}>Enable biometric authentication to quickly unlock the device</TextM>
        </>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: 8,
    backgroundColor: defaultColors.bg4,
  },
  listStyle: {
    marginTop: 24,
    marginBottom: 0,
  },
  tipText: {
    paddingLeft: 8,
    marginTop: 24,
    color: defaultColors.font3,
  },
});
