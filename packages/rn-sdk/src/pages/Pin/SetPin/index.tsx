import React, { useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import ActionSheet from 'components/ActionSheet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import PinContainer from 'components/PinContainer';
import { StyleSheet } from 'react-native';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { ConfirmPinPageProps } from '../ConfirmPin';
import CommonToast from 'components/CommonToast';

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

  const { onFinish, navigateForResult } = useBaseContainer({
    entryName: PortkeyEntries.SET_PIN,
  });

  const leftCallback = () => {
    return ActionSheet.alert({
      title: 'Leave this page?',
      message: oldPin ? MessageMap[VerificationType.communityRecovery] : MessageMap[VerificationType.communityRecovery],
      buttons: [
        { title: 'No', type: 'outline' },
        {
          title: 'Yes',
          onPress: () => {
            onFinish<SetPinPageResult>({
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
          navigateForResult<ConfirmPinPageProps>(
            PortkeyEntries.CONFIRM_PIN,
            {
              params: {
                deliveredSetPinInfo,
                oldPin,
                pin,
              },
            },
            res => {
              if (res?.status === 'success') {
                onFinish<SetPinPageResult>({
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
