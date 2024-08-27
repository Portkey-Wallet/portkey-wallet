import React, { useCallback } from 'react';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { ApprovalType, OperationTypeEnum, VerificationType } from '@portkey-wallet/types/verifier';
import ActionSheet from 'components/ActionSheet';
import { TextL } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { verification } from 'utils/api';
import navigationService from 'utils/navigationService';
import { Text } from 'react-native';
import { FontStyles } from 'assets/theme/styles';
import { useAuthenticationSign, useVerifyToken } from 'hooks/authentication';
import { AuthTypes } from 'constants/guardian';
import { getOperationDetails } from '@portkey-wallet/utils/operation.util';

const THIRD_PART_LOGIN_TYPE = AuthTypes;

export const useSetLoginAccount = (isEdit = false) => {
  const originChainId = useOriginChainId();

  const authenticationSign = useAuthenticationSign();
  const verifyToken = useVerifyToken();

  // Email & Phone
  const sendLoginAccountVerify = useCallback(
    async (currentGuardian: UserGuardianItem, isLoginAccount: boolean) => {
      try {
        Loading.show();
        const req = await verification.sendVerificationCode({
          params: {
            type: LoginType[currentGuardian.guardianType],
            guardianIdentifier: currentGuardian.guardianAccount,
            verifierId: currentGuardian.verifier?.id,
            chainId: originChainId,
            operationType: isLoginAccount ? OperationTypeEnum.setLoginAccount : OperationTypeEnum.unsetLoginAccount,
            operationDetails: getOperationDetails(
              isLoginAccount ? OperationTypeEnum.setLoginAccount : OperationTypeEnum.unsetLoginAccount,
              {
                identifierHash: currentGuardian.identifierHash,
                guardianType: currentGuardian.guardianType + '',
                verifierId: currentGuardian.verifier?.id,
              },
            ),
          },
        });
        if (req.verifierSessionId) {
          navigationService.navigateByMultiLevelParams('VerifierDetails', {
            params: {
              guardianItem: currentGuardian,
              requestCodeResult: {
                verifierSessionId: req.verifierSessionId,
              },
              verificationType: isLoginAccount ? VerificationType.setLoginAccount : VerificationType.unsetLoginAccount,
              operationDetails: getOperationDetails(
                isLoginAccount ? OperationTypeEnum.setLoginAccount : OperationTypeEnum.unsetLoginAccount,
                {
                  identifierHash: currentGuardian.identifierHash,
                  guardianType: currentGuardian.guardianType + '',
                  verifierId: currentGuardian.verifier?.id,
                },
              ),
            },
            multiLevelParams: {
              setLoginAccountNavigate: {
                from: isEdit ? 'GuardianEdit' : 'GuardianDetail',
                successParams: {
                  guardian: {
                    ...currentGuardian,
                    isLoginAccount,
                  },
                  isEdit: isEdit || undefined,
                },
                backParams: {
                  guardian: { ...currentGuardian },
                  isEdit: isEdit || undefined,
                },
              },
            },
          });
        } else {
          console.log('send fail');
        }
      } catch (error) {
        CommonToast.failError(error);
      }
      Loading.hide();
    },
    [isEdit, originChainId],
  );

  const setCommonLoginAccount = useCallback(
    async (currentGuardian: UserGuardianItem, isLoginAccount: boolean) => {
      ActionSheet.alert({
        title2: (
          <Text>
            <TextL>{`${currentGuardian.verifier?.name} will send a verification code to `}</TextL>
            <TextL style={FontStyles.weight500}>{currentGuardian.guardianAccount}</TextL>
            <TextL>{` to verify your ${
              currentGuardian.guardianType === LoginType.Phone ? 'phone number' : 'email address'
            }.`}</TextL>
          </Text>
        ),
        buttons: [
          {
            title: 'Cancel',
            type: 'outline',
          },
          {
            title: 'Confirm',
            onPress: () => {
              sendLoginAccountVerify(currentGuardian, isLoginAccount);
            },
          },
        ],
      });
    },
    [sendLoginAccountVerify],
  );

  const setThirdPartyLoginAccount = useCallback(
    async (currentGuardian: UserGuardianItem, isLoginAccount: boolean) => {
      Loading.show();
      try {
        let userInfo,
          accessToken = '';
        switch (currentGuardian.guardianType) {
          case LoginType.Apple:
            userInfo = await authenticationSign(LoginType.Apple);
            accessToken = userInfo.identityToken;
            break;
          case LoginType.Google:
          case LoginType.Telegram:
          case LoginType.Twitter:
          case LoginType.Facebook:
            userInfo = await authenticationSign(currentGuardian.guardianType as any);
            accessToken = userInfo.accessToken;
            break;
        }
        const guardianAccount = userInfo?.user.id;
        if (guardianAccount !== currentGuardian.guardianAccount)
          throw new Error('Account does not match your guardian');

        const rst = await verifyToken(currentGuardian.guardianType, {
          accessToken,
          id: currentGuardian.guardianAccount,
          verifierId: currentGuardian.verifier?.id,
          chainId: originChainId,
          operationType: isLoginAccount ? OperationTypeEnum.setLoginAccount : OperationTypeEnum.unsetLoginAccount,
          operationDetails: getOperationDetails(
            isLoginAccount ? OperationTypeEnum.setLoginAccount : OperationTypeEnum.unsetLoginAccount,
            {
              identifierHash: currentGuardian.identifierHash,
              guardianType: currentGuardian.guardianType + '',
              verifierId: currentGuardian.verifier?.id || '',
            },
          ),
        });

        navigationService.navigateByMultiLevelParams('GuardianApproval', {
          params: {
            approvalType: isLoginAccount ? ApprovalType.setLoginAccount : ApprovalType.unsetLoginAccount,
            guardianItem: currentGuardian,
            verifierInfo: {
              ...rst,
              verifierId: currentGuardian.verifier?.id,
            },
            verifiedTime: Date.now(),
            authenticationInfo: { [guardianAccount]: accessToken },
          },
          multiLevelParams: {
            setLoginAccountNavigate: {
              from: isEdit ? 'GuardianEdit' : 'GuardianDetail',
              successParams: {
                guardian: {
                  ...currentGuardian,
                  isLoginAccount,
                },
                isEdit: isEdit || undefined,
              },
              backParams: {
                guardian: { ...currentGuardian },
                isEdit: isEdit || undefined,
              },
            },
          },
        });
      } catch (error) {
        CommonToast.failError(error);
      }
      Loading.hide();
    },
    [authenticationSign, isEdit, originChainId, verifyToken],
  );

  const setLoginAccount = useCallback(
    async (currentGuardian: UserGuardianItem, isLoginAccount: boolean) => {
      if (THIRD_PART_LOGIN_TYPE.includes(currentGuardian.guardianType)) {
        setThirdPartyLoginAccount(currentGuardian, isLoginAccount);
      } else {
        setCommonLoginAccount(currentGuardian, isLoginAccount);
      }
    },
    [setCommonLoginAccount, setThirdPartyLoginAccount],
  );

  return setLoginAccount;
};
