import React, { useCallback, useRef } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import ActionSheet from 'components/ActionSheet';
import useEffectOnce from 'hooks/useEffectOnce';
import { CAInfoType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType, VerifierInfo } from '@portkey-wallet/types/verifier';
import myEvents from 'utils/deviceEvent';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import PinContainer from 'components/PinContainer';
import { GuardiansApproved } from 'pages/Guardian/types';
import { StyleSheet } from 'react-native';
import { useCheckRouteExistInRouteStack } from 'hooks/route';

type RouterParams = {
  oldPin?: string;
  managerInfo?: ManagerInfo;
  caInfo?: CAInfoType;
  walletInfo?: AElfWallet;
  verifierInfo?: VerifierInfo;
  guardiansApproved?: GuardiansApproved;
  autoLogin?: boolean;
};

const scrollViewProps = {
  disabled: true,
};
const MessageMap: any = {
  [VerificationType.register]: 'Are you sure you want to leave this page? All changes will not be saved.',
  [VerificationType.communityRecovery]:
    'Are you sure you want to leave this page? You will need approval from guardians again',
  [VerificationType.addManager]: 'After returning, you need to scan the code again to authorize login',
};
const RouterMap: any = {
  [VerificationType.register]: 'LoginPortkey',
  [VerificationType.communityRecovery]: 'GuardianApproval',
  [VerificationType.addManager]: 'LoginPortkey',
};
export default function SetPin() {
  const { oldPin, managerInfo, caInfo, walletInfo, verifierInfo, guardiansApproved, autoLogin } =
    useRouterParams<RouterParams>();
  const digitInput = useRef<DigitInputInterface>();

  const checkRouteExistInRouteStack = useCheckRouteExistInRouteStack();

  useEffectOnce(() => {
    const listener = myEvents.clearSetPin.addListener(() => digitInput.current?.reset());
    return () => listener.remove();
  });
  const leftCallback = useCallback(() => {
    if (!oldPin && managerInfo && managerInfo.verificationType !== VerificationType.communityRecovery)
      return ActionSheet.alert({
        title: 'Leave this page?',
        message: MessageMap[managerInfo.verificationType],
        buttons: [
          { title: 'No', type: 'outline' },
          {
            title: 'Yes',
            onPress: () => {
              if (managerInfo.verificationType === VerificationType.addManager) myEvents.clearQRWallet.emit();
              if (managerInfo.verificationType === VerificationType.register) {
                const isSignUpPageExist = checkRouteExistInRouteStack('SignupPortkey');
                if (isSignUpPageExist) {
                  navigationService.navigate('SignupPortkey');
                } else {
                  navigationService.navigate('LoginPortkey');
                }
                return;
              }
              navigationService.navigate(RouterMap[managerInfo.verificationType]);
            },
          },
        ],
      });

    if (!autoLogin && managerInfo && MessageMap[managerInfo.verificationType])
      return navigationService.navigate(RouterMap[managerInfo.verificationType]);

    navigationService.goBack();
  }, [autoLogin, checkRouteExistInRouteStack, managerInfo, oldPin]);
  return (
    <PageContainer
      scrollViewProps={scrollViewProps}
      titleDom
      type="leftBack"
      backTitle={oldPin ? 'Change Pin' : undefined}
      leftCallback={leftCallback}
      containerStyles={styles.container}>
      <PinContainer
        showHeader
        ref={digitInput}
        title={oldPin ? 'Please enter a new pin' : 'Enter pin to protect your device'}
        onFinish={pin => {
          navigationService.navigate('ConfirmPin', {
            oldPin,
            pin,
            managerInfo,
            walletInfo,
            caInfo,
            verifierInfo,
            guardiansApproved,
          });
        }}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
