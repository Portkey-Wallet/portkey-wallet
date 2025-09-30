import { useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { SetBiometricsTypeEnum } from 'pages/Pin/SetBiometrics';
import { authenticationReady } from '@portkey-wallet/utils-mobile/authentication';
import { useCredentials } from 'hooks/store';

function formatMnemonics(mnemonics: string[] | string) {
  return typeof mnemonics === 'string' ? mnemonics.trim() : mnemonics.join(' ');
}
export const useImportWallet = () => {
  const credentials = useCredentials();
  const importWalletByMnemonic = useCallback(
    async (mnemonics: string[] | string, checkedSecurityLock?: boolean) => {
      const mnemonicsFormatted = formatMnemonics(mnemonics);
      if (checkedSecurityLock) {
        navigationService.reset('PrepareWallet', {
          pin: credentials?.pin,
          mnemonics: mnemonicsFormatted,
          customTitle: 'Importing your wallet...',
          successToastShow: true,
          isBackup: true,
        });
        return;
      }

      const isReady = await authenticationReady();
      if (isReady) {
        navigationService.push('SetBiometrics', {
          type: SetBiometricsTypeEnum.create,
          mnemonics: mnemonicsFormatted,
          isBackup: true,
        });
        return;
      }

      navigationService.navigate('SetPin', {
        mnemonics: mnemonicsFormatted,
        isBackup: true,
      });
    },
    [credentials?.pin],
  );

  const importWalletByPrivateKey = useCallback(
    async (privateKey: string, checkedSecurityLock?: boolean) => {
      const privateKeyFormatted = privateKey.trim();
      if (checkedSecurityLock) {
        navigationService.reset('PrepareWallet', {
          pin: credentials?.pin,
          privateKey: privateKeyFormatted,
          customTitle: 'Importing your wallet...',
          successToastShow: true,
          isBackup: true,
        });
        return;
      }

      const isReady = await authenticationReady();
      if (isReady) {
        navigationService.push('SetBiometrics', {
          type: SetBiometricsTypeEnum.create,
          privateKey: privateKeyFormatted,
          isBackup: true,
        });
        return;
      }

      navigationService.navigate('SetPin', {
        privateKey: privateKeyFormatted,
        isBackup: true,
      });
    },
    [credentials?.pin],
  );

  return {
    importWalletByMnemonic,
    importWalletByPrivateKey,
  };
};
