import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import ListItem from '@portkey-wallet/rn-components/components/ListItem';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import myEvents from 'utils/deviceEvent';
import { checkPin, rememberSimpleBiometric } from 'model/verify/core';
import { PortkeyEntries } from 'config/entries';
import BaseContainerContext from 'model/container/BaseContainerContext';
import { authenticateBioAsync, authenticateBioReady } from 'service/biometric';
import useNavigation from 'core/router/hook';
import { useUser } from 'store/hook';
import useBiometricsReady, { useSetBiometrics } from 'hooks/useBiometrics';

export default function Biometric() {
  const { biometrics } = useUser();
  const setBiometrics = useSetBiometrics();
  const biometricsReady = useBiometricsReady();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const openBiometrics = useCallback(
    async (pin: string) => {
      // when use bio to verify, the pin value is 'use-bio'
      if (pin === 'use-bio' || (await checkPin(pin))) {
        try {
          if (await authenticateBioReady()) {
            const enrolled = await authenticateBioAsync();
            if (enrolled.success) {
              setBiometrics(true);
              await rememberSimpleBiometric(true);
            } else {
              throw { message: enrolled.warning || enrolled.error };
            }
          } else {
            throw { message: 'biometrics is not ready' };
          }
        } catch (error: any) {
          console.log('error', error);
          CommonToast.failError(error, i18n.t('Failed to enable biometrics'));
          setBiometrics(false);
          await rememberSimpleBiometric(false);
        }
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
        navigation.navigate(PortkeyEntries.CHECK_PIN, { openBiometrics: true });
      } else {
        ActionSheet.alert({
          title2: 'Disable fingerprint login?',
          buttons: [
            { type: 'outline', title: 'Cancel' },
            {
              type: 'primary',
              title: 'Confirm',
              onPress: async () => {
                try {
                  const enrolled = await authenticateBioAsync();
                  if (enrolled.success) {
                    setBiometrics(value);
                    await rememberSimpleBiometric(value);
                  } else CommonToast.fail(enrolled.warning || enrolled.error);
                } catch (error) {
                  CommonToast.failError(error, i18n.t('Failed to enable biometrics'));
                }
              },
            },
          ],
        });
      }
    },
    [navigation, setBiometrics],
  );
  return (
    <BaseContainerContext.Provider value={{ entryName: PortkeyEntries.ACCOUNT_SETTING_ENTRY }}>
      <PageContainer
        containerStyles={styles.containerStyles}
        safeAreaColor={['blue', 'gray']}
        titleDom={t('Biometric')}>
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
    </BaseContainerContext.Provider>
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
