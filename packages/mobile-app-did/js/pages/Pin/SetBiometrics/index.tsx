import React, { useCallback, useMemo } from 'react';
import { TextH1 } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import { setSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';
import { pTd } from 'utils/unit';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { useSetBiometrics } from 'hooks/useBiometrics';
import { changeCanLock } from 'utils/LockManager';
import fonts from 'assets/theme/fonts';
import Svg from 'components/Svg';

const ScrollViewProps = { disabled: true };
export default function SetBiometrics() {
  const styles = getStyles();
  usePreventHardwareBack();
  // const dispatch = useAppDispatch();
  // const timer = useRef<TimerResult>();
  // const { pin, caInfo: paramsCAInfo } = useRouterParams<{ pin?: string; caInfo?: CAInfo }>();
  const { pin } = useRouterParams<{ pin?: string; caInfo?: CAInfo }>();
  const { address, managerInfo, caHash } = useCurrentWalletInfo();
  // const [caInfo, setStateCAInfo] = useState<CAInfo | undefined>(paramsCAInfo);
  const setBiometrics = useSetBiometrics();

  const isSyncCAInfo = useMemo(() => address && managerInfo && !caHash, [address, caHash, managerInfo]);

  // useEffect(() => {
  //   if (isSyncCAInfo) {
  //     setTimeout(() => {
  //       if (managerInfo)
  //         timer.current = onIntervalGetResult({
  //           managerInfo,
  //           onPass: setStateCAInfo,
  //           onFail: message =>
  //             onResultFail(message, managerInfo?.verificationType === VerificationType.communityRecovery, true),
  //         });
  //     }, 100);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSyncCAInfo]);
  const getResult = useCallback(async () => {
    if (!pin) return;
    if (!isSyncCAInfo) return navigationService.reset('Tab');
    // if (caInfo) {
    //   dispatch(
    //     setCAInfo({
    //       caInfo,
    //       pin,
    //       chainId: originChainId,
    //     }),
    //   );
    //   return navigationService.reset('Tab');
    // }
    if (managerInfo) {
      const isRecovery = managerInfo?.verificationType === VerificationType.communityRecovery;
      navigationService.navigate('PrepareWallet', {
        managerInfo,
        isRecovery,
        confirmPin: pin,
      });

      // TODO: login remove
      // timer.current?.remove();
      // Loading.show({
      //   text: t(isRecovery ? 'Initiating social recovery' : CreateAddressLoading),
      // });
      // timer.current = onIntervalGetResult({
      //   managerInfo,
      //   onPass: (info: CAInfo) => {
      //     dispatch(
      //       setCAInfo({
      //         caInfo: info,
      //         pin,
      //         chainId: originChainId,
      //       }),
      //     );
      //     Loading.hide();
      //     navigationService.reset('Tab');
      //   },
      //   onFail: message => onResultFail(message, isRecovery, true),
      // });
    }
  }, [isSyncCAInfo, managerInfo, pin]);
  const openBiometrics = useCallback(async () => {
    if (!pin) return;
    changeCanLock(false);
    try {
      await setSecureStoreItem('Pin', pin);
      await setBiometrics(true);
      await getResult();
    } catch (error) {
      CommonToast.failError(error, 'Failed To Verify');
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
      <View>
        <TextH1 style={styles.headerTitle}>{'Enable biometrics authentication'}</TextH1>
        <Svg iconStyle={GStyles.alignCenter} icon="face-id" size={pTd(64)} />
      </View>
      <View>
        <CommonButton buttonStyle={styles.buttonWrap} type="primary" onPress={openBiometrics}>
          {'Set up now'}
        </CommonButton>
        <CommonButton type="outline" title="Do it later" onPress={onSkip} />
      </View>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    justifyContent: 'space-between',
    paddingTop: pTd(24),
  },
  headerTitle: {
    marginBottom: pTd(120),
    ...fonts.BGMediumFont,
  },
  buttonWrap: {
    marginBottom: pTd(24),
  },
}));
