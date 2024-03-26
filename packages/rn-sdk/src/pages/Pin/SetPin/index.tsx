import React, { useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from '@portkey-wallet/rn-components/components/DigitInput';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import PinContainer from '@portkey-wallet/rn-components/components/PinContainer';
import { StyleSheet } from 'react-native';
import { PortkeyEntries } from 'config/entries';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import useNavigation from 'core/router/hook';

const scrollViewProps = {
  disabled: true,
};
const MessageMap: any = {
  [VerificationType.register]: 'Are you sure you want to leave this page? All changes will not be saved.',
  [VerificationType.communityRecovery]:
    'Are you sure you want to leave this page? You will need approval from guardians again',
  [VerificationType.addManager]: 'After returning, you need to scan the code again to authorize login',
};
// const RouterMap: any = {
//   [VerificationType.register]: 'LoginPortkey',
//   [VerificationType.communityRecovery]: 'GuardianApproval',
//   [VerificationType.addManager]: 'LoginPortkey',
// };
export default function SetPin({ deliveredSetPinInfo, oldPin }: SetPinPageProps) {
  const digitInput = useRef<DigitInputInterface>();
  const [errorMessage] = useState<string>();
  const navigation = useNavigation();

  const leftCallback = () => {
    if (!oldPin)
      return ActionSheet.alert({
        title: 'Leave this page?',
        message: MessageMap[VerificationType.communityRecovery],
        buttons: [
          { title: 'No', type: 'outline' },
          {
            title: 'Yes',
            onPress: () => {
              navigation.goBack({
                status: 'cancel',
                data: {
                  finished: false,
                },
              });
            },
          },
        ],
      });
  };
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
          navigation.navigateByResult(
            PortkeyEntries.CONFIRM_PIN,
            res => {
              if (res?.status === 'success') {
                navigation.goBack({
                  animated: false,
                  status: 'success',
                  data: {
                    finished: true,
                  },
                });
              } else if (res?.status !== 'system') {
                CommonToast.failError('try again');
                digitInput.current?.reset();
              }
            },
            {
              deliveredSetPinInfo,
              oldPin,
              pin,
            },
          );
        }}
        errorMessage={errorMessage}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export interface SetPinPageProps {
  deliveredSetPinInfo?: string; // SetPinInfo
  oldPin?: string;
}

export interface SetPinPageResult {
  finished: boolean;
}
