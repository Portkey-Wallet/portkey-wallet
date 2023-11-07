import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import ListItem from 'components/ListItem';
import CommonToast from 'components/CommonToast';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
import { TextM } from 'components/CommonText';
import ActionSheet from 'components/ActionSheet';
import myEvents from 'utils/deviceEvent';
import { checkPin, getUseBiometric, rememberUseBiometric } from 'model/verify/after-verify';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BaseContainerContext from 'model/container/BaseContainerContext';
// import { touchAuth } from 'pages/Pin/SetBiometrics';
import { authenticationReady } from '@portkey-wallet/utils/mobile/authentication';
import { authenticateBioAsync, authenticateBioReady } from 'service/biometric';

export default function Biometric() {
  const [biometricsSwitch, setBiometricsSwitch] = useState<boolean>(false);
  const [biometricsReady, setBiometricsReady] = useState<boolean>(true);
  useEffect(() => {
    Promise.all([getUseBiometric(), authenticationReady()])
      .then(results => {
        setBiometricsSwitch(results[0]);
        setBiometricsReady(results[1]);
      })
      .catch(error => {
        console.log(error); // reject
      });
  }, []);
  const { navigationTo } = useBaseContainer({ entryName: PortkeyEntries.BIOMETRIC_SWITCH_ENTRY });
  const { t } = useLanguage();
  const openBiometrics = useCallback(async (pin: string) => {
    // when use bio to verify, the pin value is 'use-bio'
    if (pin === 'use-bio' || (await checkPin(pin))) {
      try {
        if (await authenticateBioReady()) {
          console.log('authenticateBioReady');
          const enrolled = await authenticateBioAsync();
          console.log('authenticateBioAsyncauthenticateBioAsyncauthenticateBioAsync', enrolled);
          if (enrolled.success) {
            setBiometricsSwitch(true);
            await rememberUseBiometric(true);
          } else CommonToast.fail(enrolled.warning || enrolled.error);
        } else {
          setBiometricsSwitch(true);
          await rememberUseBiometric(true);
        }
      } catch (error: any) {
        console.log('error', error);
        CommonToast.failError(error, i18n.t('Failed to enable biometrics'));
        await rememberUseBiometric(false);
      }
    }
  }, []);
  useEffectOnce(() => {
    const listener = myEvents.openBiometrics.addListener(openBiometrics);
    return () => listener.remove();
  });
  const onValueChange = useCallback(
    async (value: boolean) => {
      if (value) {
        // const result = await authenticationReady();
        // if (!result) return CommonToast.fail('This device does not currently support biometrics');
        navigationTo(PortkeyEntries.CHECK_PIN, { params: { openBiometrics: true } });
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
                    setBiometricsSwitch(value);
                    await rememberUseBiometric(value);
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
    [navigationTo],
  );
  return (
    // <SafeAreaProvider style={{ backgroundColor: 'white' }}>
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
              switchValue={biometricsSwitch}
              style={styles.listStyle}
              onValueChange={onValueChange}
              title={t('Biometric Authentication')}
            />
            <TextM style={styles.tipText}>Enable biometric authentication to quickly unlock the device</TextM>
          </>
        )}
      </PageContainer>
    </BaseContainerContext.Provider>
    // </SafeAreaProvider>
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
