import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import { touchAuth } from '@portkey-wallet/utils-mobile/authentication';
import CommonToast from 'components/CommonToast';
import useBiometricsReady, { useSetBiometrics } from 'hooks/useBiometrics';
import navigationService from 'utils/navigationService';
import { View } from 'react-native';
import { checkPin } from 'utils/redux';
import fonts from 'assets/theme/fonts';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
import { useUser } from 'hooks/store';
import { TextL, TextM } from 'components/CommonText';
import CommonSwitch from 'components/CommonSwitch';
import ActionSheet from 'components/ActionSheet';
import { setSecureStoreItem } from '@portkey-wallet/utils-mobile/biometric';
import myEvents from 'utils/deviceEvent';
import { changeCanLock } from 'utils/LockManager';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

export default function Biometric() {
  const styles = getStyles();
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
                  if (enrolled.success) {
                    await setBiometrics(value);
                  } else {
                    CommonToast.fail(enrolled.warning || enrolled.error);
                  }
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
    <PageContainer
      containerStyles={styles.containerStyles}
      safeAreaColor={['black']}
      titleDom={t('Biometric Authentication')}>
      {biometricsReady && (
        <View style={styles.wrap}>
          <View style={styles.switchWrap}>
            <TextL style={styles.switchText}>Biometric authentication</TextL>
            <CommonSwitch style={styles.switchButton} value={biometrics} onValueChange={onValueChange} />
          </View>
          <TextM style={styles.tipText}>Enable biometric authentication to quickly unlock the device.</TextM>
        </View>
      )}
    </PageContainer>
  );
}

export const getStyles = makeStyles(theme => ({
  containerStyles: {},
  wrap: {
    width: '100%',
    marginTop: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(8),
    padding: pTd(16),
  },
  switchWrap: {
    height: pTd(22),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchText: {
    color: theme.colors.textBase1,
  },
  switchButton: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  tipText: {
    marginTop: pTd(4),
    lineHeight: pTd(22.4),
    color: theme.colors.textBase2,
    ...fonts.SGRegularFont,
  },
}));
