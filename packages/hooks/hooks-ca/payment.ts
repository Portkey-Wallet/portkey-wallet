import { useAppCASelector } from '.';
import { getAchToken } from '@portkey-wallet/api/api-did/payment/util';
import { AchTokenInfoType } from '@portkey-wallet/store/store-ca/payment/type';
import { useCallback } from 'react';
import { useGuardiansInfo } from './guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export const usePayment = () => useAppCASelector(state => state.payment);

export const useGetAchTokenInfo = () => {
  const { userGuardiansList } = useGuardiansInfo();

  return useCallback(async (): Promise<AchTokenInfoType | undefined> => {
    if (userGuardiansList === undefined) {
      throw new Error('userGuardiansList is undefined');
    }

    const emailGuardian = userGuardiansList?.find(item => item.guardianType === LoginType.Email && item.isLoginAccount);
    if (emailGuardian === undefined) {
      return undefined;
    }

    const rst = await getAchToken({ email: emailGuardian.guardianAccount });
    const achTokenInfo = {
      token: rst.accessToken,
      expires: Date.now() + 24 * 60 * 60 * 1000,
    };

    return achTokenInfo;
  }, [userGuardiansList]);
};
