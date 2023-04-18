import { useAppCASelector } from '.';
import { getAchToken } from '@portkey-wallet/api/api-did/payment/util';
import { AchTokenInfoType } from '@portkey-wallet/store/store-ca/payment/type';
import { useCallback } from 'react';
import { useAppCommonDispatch } from '../index';
import { setAchTokenInfo } from '@portkey-wallet/store/store-ca/payment/actions';
import { useGuardiansInfo } from './guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export const usePayment = () => useAppCASelector(state => state.payment);

export const useGetAchTokenInfo = () => {
  const { achTokenInfo } = usePayment();
  const dispatch = useAppCommonDispatch();
  const { userGuardiansList } = useGuardiansInfo();

  return useCallback(async (): Promise<AchTokenInfoType | undefined> => {
    if (userGuardiansList === undefined) {
      throw new Error('userGuardiansList is undefined');
    }

    const emailGuardian = userGuardiansList?.find(item => item.guardianType === LoginType.Email && item.isLoginAccount);
    if (emailGuardian === undefined) {
      return undefined;
    }
    console.log('email', emailGuardian.guardianAccount);

    if (achTokenInfo === undefined || achTokenInfo.expires < Date.now()) {
      const rst = await getAchToken({ email: emailGuardian.guardianAccount });
      const achTokenInfo = {
        token: rst.accessToken,
        expires: Date.now() + 24 * 60 * 60 * 1000,
      };
      dispatch(setAchTokenInfo(achTokenInfo));
      return achTokenInfo;
    }
    return achTokenInfo;
  }, [userGuardiansList, achTokenInfo, dispatch]);
};
