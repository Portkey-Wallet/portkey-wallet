import { AchTokenInfoType } from '@portkey-wallet/store/store-ca/payment/type';
import { useCallback } from 'react';
import { useGuardiansInfo } from '../guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import ramp from '@portkey-wallet/ramp';

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

    const { data } = await ramp.service.getAchToken({ email: emailGuardian.guardianAccount });
    const achTokenInfo = {
      token: data.accessToken,
      expires: Date.now() + 24 * 60 * 60 * 1000,
    };

    return achTokenInfo;
  }, [userGuardiansList]);
};
