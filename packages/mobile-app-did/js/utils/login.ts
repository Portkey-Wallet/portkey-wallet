import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import ActionSheet from 'components/ActionSheet';
import OverlayModal from 'components/OverlayModal';
import { GuardiansStatus } from 'pages/Guardian/types';
import navigationService from './navigationService';

export function queryFailAlert(callBack: () => void, isRecovery?: boolean, isReset?: boolean) {
  OverlayModal.hide();
  ActionSheet.alert({
    isCloseShow: false,
    isModalCloseDisable: true,
    message: isRecovery
      ? 'Wallet account recovery failed. Please try again.'
      : 'Wallet account sign-up failed. Please try again.',
    buttons: [
      {
        title: isRecovery ? 'Log in again' : 'Sign up again',
        onPress: () => {
          callBack();
          if (isReset) {
            navigationService.reset('LoginPortkey');
          } else {
            navigationService.navigate('LoginPortkey');
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
    .filter(item => (item.signature && item.verificationDoc) || item.zkLoginInfo);
}
