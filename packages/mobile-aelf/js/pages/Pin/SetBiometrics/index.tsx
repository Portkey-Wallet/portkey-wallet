import React, { useCallback } from 'react';
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

const ScrollViewProps = { disabled: true };
export default function SetBiometrics() {
  const styles = getStyles();
  const { theme } = useTheme();
  usePreventHardwareBack();

  const setBiometrics = useSetBiometrics();

  const dispatch = useAppDispatch();
  const openBiometrics = useCallback(async () => {
    changeCanLock(false);
    try {
      const pin = randomId();
      await setSecureStoreItem('Pin', pin);
      dispatch(setCredentials({ pin }));
      await setBiometrics(true);
    } catch (error) {
      CommonPrompt.failError(error, 'Failed To Verify');
    }
    changeCanLock(true);
  }, [dispatch, setBiometrics]);
  const onSkip = useCallback(async () => {
    try {
      await setBiometrics(false);
      // TODO: eoa jump to pin
    } catch (error) {
      CommonPrompt.failError(error);
    }
  }, [setBiometrics]);
  // useEffectOnce(() => {
  //   setTimeout(() => {
  //     openBiometrics();
  //   }, 100);
  // });
  return (
    <PageContainer
      hideHeader
      scrollViewProps={ScrollViewProps}
      leftDom
      titleDom
      containerStyles={styles.containerStyles}>
      <View>
        <TextH1 style={styles.headerTitle}>{'Enable biometrics authentication'}</TextH1>
        <Svg iconStyle={GStyles.alignCenter} icon="face-id" size={pTd(64)} />
      </View>
      <View>
        <CommonButton buttonStyle={styles.buttonWrap} type="primary" onPress={openBiometrics}>
          <Svg icon="face-id" iconStyle={styles.buttonIcon} size={pTd(16)} color={theme.colors.iconBrand4} />
          {'Set up now'}
        </CommonButton>
        <CommonButton type="outline" title="Do it later" onPress={onSkip} />
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
    marginBottom: pTd(24),
  },
}));
