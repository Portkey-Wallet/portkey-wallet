import { useCallback } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { checkHolderError } from '@portkey-wallet/utils/check';
import { handleErrorCode, handleErrorMessage } from '@portkey-wallet/utils';
import { useAppCASelector } from './index';

export const useGetRegisterInfo = () => {
  return useCallback(async (info: { loginGuardianIdentifier?: string; caHash?: string }) => {
    try {
      if (info.loginGuardianIdentifier) {
        info.loginGuardianIdentifier = info.loginGuardianIdentifier.replaceAll(' ', '');
      }
      return await request.wallet.getRegisterInfo({
        params: info,
      });
    } catch (error: any) {
      const code = handleErrorCode(error);
      const message = handleErrorMessage(error);
      throw { message: checkHolderError(message, code), code };
    }
  }, []);
};

export const useGuardiansInfo = () => useAppCASelector(state => state.guardians);
