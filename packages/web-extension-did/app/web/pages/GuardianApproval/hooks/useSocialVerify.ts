import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { ChainId } from '@portkey-wallet/types';
import { OperationTypeEnum, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { handleVerificationDoc } from '@portkey-wallet/utils/guardian';
import { message } from 'antd';
import { useVerifyToken } from 'hooks/authentication';
import { useCallback } from 'react';
import { useLoading } from 'store/Provider/hooks';
import { LoginInfo } from 'store/reducers/loginCache/type';

export const useSocialVerify = () => {
  const { setLoading } = useLoading();
  const verifyToken = useVerifyToken();

  return useCallback(
    async ({
      operateGuardian,
      originChainId,
      operationType,
      loginAccount,
    }: {
      operateGuardian: UserGuardianItem;
      originChainId: ChainId;
      operationType: OperationTypeEnum;
      loginAccount?: LoginInfo;
    }) => {
      try {
        setLoading(true);
        const result = await verifyToken(operateGuardian.guardianType, {
          accessToken: loginAccount?.authenticationInfo?.[operateGuardian.guardianAccount],
          id: operateGuardian.guardianAccount,
          verifierId: operateGuardian.verifier?.id,
          chainId: originChainId,
          operationType: operationType,
        });
        const verifierInfo: VerifierInfo = { ...result, verifierId: operateGuardian?.verifier?.id };
        const { guardianIdentifier } = handleVerificationDoc(verifierInfo.verificationDoc);
        return {
          key: operateGuardian.key,
          signature: verifierInfo.signature,
          verificationDoc: verifierInfo.verificationDoc,
          status: VerifyStatus.Verified,
          identifierHash: guardianIdentifier,
        };
      } catch (error) {
        const msg = handleErrorMessage(error);
        message.error(msg);
      } finally {
        setLoading(false);
      }
      return;
    },
    [setLoading, verifyToken],
  );
};
