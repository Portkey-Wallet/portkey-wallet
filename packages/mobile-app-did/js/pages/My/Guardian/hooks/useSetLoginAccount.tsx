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
import {
  AppleAuthentication,
  GoogleAuthentication,
  useAppleAuthentication,
  useGoogleAuthentication,
  useVerifyToken,
} from 'hooks/authentication';

const THIRD_PART_LOGIN_TYPE = [LoginType.Apple, LoginType.Google];

export const useSetLoginAccount = (isEdit = false) => {
  const originChainId = useOriginChainId();
  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();
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
        const userInfo = await (currentGuardian.guardianType === LoginType.Apple ? appleSign : googleSign)();
        const guardianAccount = userInfo.user.id;
        if (guardianAccount !== currentGuardian.guardianAccount)
          throw new Error('Account does not match your guardian');

        let accessToken = '';
        if (currentGuardian.guardianType === LoginType.Apple) {
          accessToken = (userInfo as AppleAuthentication).identityToken;
        } else {
          accessToken = (userInfo as GoogleAuthentication).accessToken;
        }
        const rst = await verifyToken(currentGuardian.guardianType, {
          accessToken,
          id: guardianAccount,
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
    [appleSign, googleSign, isEdit, originChainId, verifyToken],
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
