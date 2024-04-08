import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import OverlayModal from '@portkey-wallet/rn-components/components/OverlayModal';
import { GuardiansStatus } from '../types/guardian';
import navigationService from '@portkey-wallet/rn-inject-app';

export function queryFailAlert(callBack: () => void, isRecovery?: boolean, isReset?: boolean) {
  OverlayModal.hide();
  ActionSheet.alert({
    message: isRecovery ? 'Wallet Recovery Failed!' : 'Wallet Register Failed!',
    buttons: [
      {
        title: isRecovery ? 'Re-login' : 'Re-register',
        onPress: () => {
          callBack();
          if (isRecovery) {
            if (isReset) navigationService.reset('LoginPortkey');
            else navigationService.navigate('LoginPortkey');
          } else {
            if (isReset) navigationService.reset([{ name: 'LoginPortkey' }, { name: 'SignupPortkey' }]);
            else navigationService.navigate('SignupPortkey');
          }
        },
      },
    ],
  });
}

export function handleGuardiansApproved(guardiansStatus: GuardiansStatus, userGuardiansList: UserGuardianItem[]) {
  return Object.keys(guardiansStatus)
    .map(key => {
      const status = guardiansStatus?.[key];
      const guardian = userGuardiansList?.find(item => item.key === key);
      return {
        ...status?.verifierInfo,
        value: guardian?.guardianAccount,
        guardianType: guardian?.guardianType,
        type: LoginType[guardian?.guardianType as LoginType],
      };
    })
    .filter(item => item.signature && item.verificationDoc);
}
