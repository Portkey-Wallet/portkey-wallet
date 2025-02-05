import { useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { SetBiometricsTypeEnum } from 'pages/Pin/SetBiometrics';
import { authenticationReady } from '@portkey-wallet/utils/mobile/authentication';

function formatMnemonics(mnemonics: string[] | string) {
  return typeof mnemonics === 'string' ? mnemonics.trim() : mnemonics.join(' ');
}
export const useImportWallet = () => {
  const importWalletByMnemonic = useCallback(async (mnemonics: string[] | string) => {
    const isReady = await authenticationReady();
    if (isReady) {
      navigationService.push('SetBiometrics', {
        type: SetBiometricsTypeEnum.create,
        mnemonics: formatMnemonics(mnemonics),
      });
      return;
    }

    navigationService.navigate('SetPin', {
      mnemonics: formatMnemonics(mnemonics),
    });
  }, []);

  const importWalletByPrivateKey = useCallback(async (privateKey: string) => {
    const isReady = await authenticationReady();
    if (isReady) {
      navigationService.push('SetBiometrics', {
        type: SetBiometricsTypeEnum.create,
        privateKey: privateKey.trim(),
      });
      return;
    }

    navigationService.navigate('SetPin', {
      privateKey: privateKey.trim(),
    });
  }, []);

  return {
    importWalletByMnemonic,
    importWalletByPrivateKey,
  };
};
