import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { ChainId } from '@portkey-wallet/types';
import { OperationTypeEnum, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { handleVerificationDoc } from '@portkey-wallet/utils/guardian';
import { useVerifyToken } from 'hooks/authentication';
import { useCallback } from 'react';
import { useLoading } from 'store/Provider/hooks';
import { LoginInfo } from 'store/reducers/loginCache/type';
import singleMessage from 'utils/singleMessage';

export const useSocialVerify = () => {
  const { setLoading } = useLoading();
  const verifyToken = useVerifyToken();

  return useCallback(
    async ({
      operateGuardian,
      originChainId,
      operationType,
      loginAccount,
      targetChainId,
    }: {
      operateGuardian: UserGuardianItem;
      originChainId: ChainId;
      targetChainId?: ChainId;
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
          targetChainId,
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
        singleMessage.error(msg);
      } finally {
        setLoading(false);
      }
      return;
    },
    [setLoading, verifyToken],
  );
};
