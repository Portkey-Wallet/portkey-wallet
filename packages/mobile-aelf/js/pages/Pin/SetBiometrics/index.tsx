import React, { useCallback, useMemo } from 'react';
import { TextH1 } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import { setSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import { View } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';
import { pTd } from 'utils/unit';
import CommonPrompt from 'components/CommonPromptCard';
import { useSetBiometrics } from 'hooks/useBiometrics';
import { changeCanLock } from 'utils/LockManager';
import Svg from 'components/Svg';
import { randomId } from 'utils/bridgeUtils';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import navigationService from 'utils/navigationService';
import { usePin } from 'hooks/store';
import { useUpdateWalletAES } from '@portkey-wallet/hooks/hooks-eoa/wallet';

export enum SetBiometricsTypeEnum {
  'create' = 'CREATE',
  'update' = 'UPDATE',
}

type TRouterParams = {
  type: SetBiometricsTypeEnum;
  mnemonics?: string;
  privateKey?: string;
  isBackup?: boolean;
};

const ScrollViewProps = { disabled: true };

export default function SetBiometrics() {
  const styles = getStyles();
  const { theme } = useTheme();
  usePreventHardwareBack();

  const { type = SetBiometricsTypeEnum.create, mnemonics, privateKey, isBackup } = useRouterParams<TRouterParams>();

  const isCreate = useMemo(() => type === SetBiometricsTypeEnum.create, [type]);

  const setBiometrics = useSetBiometrics();

  const dispatch = useAppDispatch();

  const createBiometrics = useCallback(async () => {
    const newPin = randomId();
    await setSecureStoreItem('Pin', newPin);
    dispatch(setCredentials({ pin: newPin }));
    await setBiometrics(true);
    navigationService.reset('PrepareWallet', { pin: newPin, mnemonics, privateKey, isBackup });
  }, [dispatch, setBiometrics, mnemonics, privateKey, isBackup]);

  const pin = usePin();
  const updateWalletAES = useUpdateWalletAES();

  const updateBiometrics = useCallback(async () => {
    if (!pin) {
      return;
    }
    const newPin = randomId();
    updateWalletAES(pin, newPin);
    await setSecureStoreItem('Pin', newPin);
    dispatch(setCredentials({ pin: newPin }));
    await setBiometrics(true);
    navigationService.goBack();
  }, [dispatch, pin, setBiometrics, updateWalletAES]);

  const openBiometrics = useCallback(async () => {
    changeCanLock(false);
    try {
      if (isCreate) {
        await createBiometrics();
      } else {
        await updateBiometrics();
      }
    } catch (error) {
      CommonPrompt.failError(error, 'Failed To Verify');
    }
    changeCanLock(true);
  }, [isCreate, createBiometrics, updateBiometrics]);

  const onSkip = useCallback(async () => {
    try {
      await setBiometrics(false);
      navigationService.reset('SetPin', {
        mnemonics,
        privateKey,
        isBackup,
      });
    } catch (error) {
      CommonPrompt.failError(error);
    }
  }, [setBiometrics, mnemonics, privateKey, isBackup]);

  return (
    <PageContainer
      hideHeader={isCreate}
      type="leftBack"
      titleDom=""
      scrollViewProps={ScrollViewProps}
      containerStyles={styles.containerStyles}>
      <View>
        <TextH1 style={styles.headerTitle}>{'Enable biometrics authentication'}</TextH1>
        <Svg iconStyle={GStyles.alignCenter} icon="face-id" size={pTd(64)} />
      </View>
      <View>
        <CommonButton type="primary" onPress={openBiometrics}>
          <Svg icon="face-id" iconStyle={styles.buttonIcon} size={pTd(16)} color={theme.colors.iconBrand4} />
          {'Set up now'}
        </CommonButton>
        {isCreate && (
          <CommonButton buttonStyle={styles.buttonWrap} type="outline" title="Do it later" onPress={onSkip} />
        )}
      </View>
    </PageContainer>
  );
}

const getStyles = makeStyles(_theme => ({
  containerStyles: {
    justifyContent: 'space-between',
    paddingTop: pTd(58),
    paddingBottom: pTd(32),
  },
  buttonIcon: {
    marginRight: pTd(8),
  },
  headerTitle: {
    marginBottom: pTd(120),
  },
  buttonWrap: {
    marginTop: pTd(24),
  },
}));
