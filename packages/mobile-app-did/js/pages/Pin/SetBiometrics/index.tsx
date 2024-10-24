import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextL, TextS } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import { setSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { Image } from 'react-native';
import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import { useAppDispatch } from 'store/hooks';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';
import biometric from 'assets/image/pngs/biometric.png';
import { pTd } from 'utils/unit';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { TimerResult } from 'utils/wallet';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import Loading from 'components/Loading';
import { setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { VerificationType } from '@portkey-wallet/types/verifier';
import CommonToast from 'components/CommonToast';
import { useIntervalGetResult, useOnResultFail } from 'hooks/login';
import useEffectOnce from 'hooks/useEffectOnce';
import { useSetBiometrics } from 'hooks/useBiometrics';
import { useLanguage } from 'i18n/hooks';
import { changeCanLock } from 'utils/LockManager';
import { CreateAddressLoading } from '@portkey-wallet/constants/constants-ca/wallet';

const ScrollViewProps = { disabled: true };
export default function SetBiometrics() {
  const styles = getStyles();
  const { t } = useLanguage();
  usePreventHardwareBack();
  const dispatch = useAppDispatch();
  const timer = useRef<TimerResult>();
  const { pin, caInfo: paramsCAInfo } = useRouterParams<{ pin?: string; caInfo?: CAInfo }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { address, managerInfo, caHash } = useCurrentWalletInfo();
  const [caInfo, setStateCAInfo] = useState<CAInfo | undefined>(paramsCAInfo);
  const setBiometrics = useSetBiometrics();
  const originChainId = useOriginChainId();

  const isSyncCAInfo = useMemo(() => address && managerInfo && !caHash, [address, caHash, managerInfo]);
  const onIntervalGetResult = useIntervalGetResult();
  const onResultFail = useOnResultFail();

  useEffect(() => {
    if (isSyncCAInfo) {
      setTimeout(() => {
        if (managerInfo)
          timer.current = onIntervalGetResult({
            managerInfo,
            onPass: setStateCAInfo,
            onFail: message =>
              onResultFail(message, managerInfo?.verificationType === VerificationType.communityRecovery, true),
          });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSyncCAInfo]);
  const getResult = useCallback(async () => {
    if (!pin) return;
    if (!isSyncCAInfo) return navigationService.reset('Tab');
    if (caInfo) {
      dispatch(
        setCAInfo({
          caInfo,
          pin,
          chainId: originChainId,
        }),
      );
      return navigationService.reset('Tab');
    }
    if (managerInfo) {
      timer.current?.remove();
      const isRecovery = managerInfo?.verificationType === VerificationType.communityRecovery;
      Loading.show({
        text: t(isRecovery ? 'Initiating social recovery' : CreateAddressLoading),
      });
      timer.current = onIntervalGetResult({
        managerInfo,
        onPass: (info: CAInfo) => {
          dispatch(
            setCAInfo({
              caInfo: info,
              pin,
              chainId: originChainId,
            }),
          );
          Loading.hide();
          navigationService.reset('Tab');
        },
        onFail: message => onResultFail(message, isRecovery, true),
      });
    }
  }, [caInfo, dispatch, isSyncCAInfo, managerInfo, onIntervalGetResult, onResultFail, originChainId, pin, t]);
  const openBiometrics = useCallback(async () => {
    if (!pin) return;
    changeCanLock(false);
    try {
      await setSecureStoreItem('Pin', pin);
      await setBiometrics(true);
      await getResult();
    } catch (error) {
      setErrorMessage(handleErrorMessage(error, 'Failed To Verify'));
    }
    changeCanLock(true);
  }, [getResult, pin, setBiometrics]);
  const onSkip = useCallback(async () => {
    try {
      await setBiometrics(false);
      await getResult();
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [setBiometrics, getResult]);
  useEffectOnce(() => {
    setTimeout(() => {
      openBiometrics();
    }, 100);
  });
  return (
    <PageContainer scrollViewProps={ScrollViewProps} leftDom titleDom containerStyles={styles.containerStyles}>
      <Touchable style={GStyles.itemCenter} onPress={openBiometrics}>
        <Image resizeMode="contain" source={biometric} style={styles.biometricIcon} />
        <TextL style={styles.tipText}>Enable biometric authentication</TextL>
        {errorMessage ? <TextS style={styles.errorText}>{errorMessage}</TextS> : null}
      </Touchable>
      <CommonButton type="clear" title="Skip" buttonStyle={BGStyles.transparent} onPress={onSkip} />
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: pTd(52),
    paddingTop: '25%',
    alignItems: 'center',
  },
  tipText: {
    marginTop: -38,
  },
  errorText: {
    marginTop: 16,
    color: theme.colors.error,
  },
  biometricIcon: {
    width: pTd(124),
  },
}));
