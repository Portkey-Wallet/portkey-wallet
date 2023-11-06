import { useCallback } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { PortkeyConfig } from 'global/constants';

export const useGetHolderInfo = () => {
  return useCallback(async (loginInfo: LoginInfo) => {
    if (!loginInfo) throw new Error('Could not find accountInfo');
    const chainId = await PortkeyConfig.currChainId();
    return request.wallet.guardianIdentifiers({
      params: { chainId: chainId, ...loginInfo },
    });
  }, []);
};

export const useGetGuardiansInfo = () => {
  const getHolderInfo = useGetHolderInfo();
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: ChainItemType) => {
      try {
        const res = await getHolderInfo(loginInfo, chainInfo);
        if (res && !res.error) return res?.data || res;
        throw new Error(checkHolderError(res.error?.message));
      } catch (error: any) {
        const code = handleErrorCode(error);
        const message = handleErrorMessage(error);
        throw { message: checkHolderError(message, code), code };
      }
    },
    [getHolderInfo],
  );
};
