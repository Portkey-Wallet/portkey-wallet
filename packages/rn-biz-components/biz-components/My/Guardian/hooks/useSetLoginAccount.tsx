import React, { useCallback } from 'react';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { ApprovalType, OperationTypeEnum, VerificationType } from '@portkey-wallet/types/verifier';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import { TextL } from '@portkey-wallet/rn-components/components/CommonText';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import { verification } from '@portkey-wallet/rn-base/utils/api';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { Text } from 'react-native';
import { FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import { useAuthenticationSign, useVerifyToken } from '@portkey-wallet/rn-base/hooks/authentication';
import { AuthTypes } from '@portkey-wallet/rn-base/constants/guardian';

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
