import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { VerificationType, OperationTypeEnum, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import GuardianItem from '../components/GuardianItem';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import myEvents from 'utils/deviceEvent';
import { useCurrentWalletInfo, useOriginChainId, useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { LoginType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { GuardiansApproved, GuardiansStatusItem } from '../types';
import { verification } from 'utils/api';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useOnRequestOrSetPin } from 'hooks/login';
import { usePin } from 'hooks/store';
import {
  VERIFICATION_TO_APPROVAL_MAP,
  VERIFICATION_TO_OPERATION_MAP,
} from '@portkey-wallet/constants/constants-ca/verifier';
import { ChainId } from '@portkey-wallet/types';
import { CreateAddressLoading, VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { handleGuardiansApproved } from 'utils/login';
import { checkVerifierIsInvalidCode } from '@portkey-wallet/utils/guardian';
import { pTd } from 'utils/unit';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';
import { useLatestRef } from '@portkey-wallet/hooks';
import { deleteLoginAccount } from '@portkey-wallet/utils/deleteAccount';
import { useGetCurrentCAContract } from 'hooks/contract';
import useLogOut from 'hooks/useLogOut';

type RouterParams = {
  guardianItem?: UserGuardianItem;
  requestCodeResult?: { verifierSessionId: string };
  startResend?: boolean;
  verificationType?: VerificationType;
  targetChainId?: ChainId;
  accelerateChainId?: ChainId;
  autoLogin?: boolean;
};
function TipText({ guardianAccount, isRegister }: { guardianAccount?: string; isRegister?: boolean }) {
  const [first, last] = useMemo(() => {
    if (!isRegister)
      return [
        `Please contact your guardians, and enter the ${DIGIT_CODE.length}-digit code sent to `,
        ` within ${DIGIT_CODE.expiration} minutes.`,
      ];
    return [`A ${DIGIT_CODE.length}-digit code was sent to `, ` Enter it within ${DIGIT_CODE.expiration} minutes`];
  }, [isRegister]);
  return (
    <TextM style={[FontStyles.font3, GStyles.marginTop(16), GStyles.marginBottom(50)]}>
      {first}
      <Text style={FontStyles.font4}>{guardianAccount}</Text>
      {last}
    </TextM>
  );
}

export default function VerifierDetails() {
  const {
    guardianItem,
    requestCodeResult: paramsRequestCodeResult,
    startResend,
    verificationType,
    targetChainId,
    accelerateChainId,
    autoLogin,
  } = useRouterParams<RouterParams>();

  const originChainId = useOriginChainId();
  const countdown = useRef<VerifierCountdownInterface>();
  useEffectOnce(() => {
    if (!startResend) countdown.current?.resetTime(60);
  });
  const [requestCodeResult, setRequestCodeResult] =
    useState<RouterParams['requestCodeResult']>(paramsRequestCodeResult);
  const digitInput = useRef<DigitInputInterface>();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();
  const pin = usePin();
  const onRequestOrSetPin = useOnRequestOrSetPin();
  const logout = useLogOut();

  const setGuardianStatus = useCallback(
    (status: GuardiansStatusItem) => {
      myEvents.setGuardianStatus.emit({
        key: guardianItem?.key,
        status,
      });
    },
    [guardianItem?.key],
  );

  const operationType: OperationTypeEnum = useMemo(
    () => VERIFICATION_TO_OPERATION_MAP[verificationType as VerificationType] || OperationTypeEnum.unknown,
    [verificationType],
  );

  const registerAccount = useCallback(
    async ({
      verifierInfo,
      codeResult,
    }: {
      verifierInfo: VerifierInfo;
      codeResult?: {
        verifierSessionId: string;
      };
    }) => {
      if (!guardianItem) return CommonToast.fail('Guardian not found');
      const key = guardianItem.key as string;
      onRequestOrSetPin({
        managerInfo: {
          verificationType: VerificationType.communityRecovery,
          loginAccount: guardianItem.guardianAccount,
          type: guardianItem.guardianType,
        } as ManagerInfo,
        guardiansApproved: handleGuardiansApproved(
          { [key]: { status: VerifyStatus.Verified, verifierInfo, requestCodeResult: codeResult } },
          [guardianItem],
        ) as GuardiansApproved,
        showLoading: true,
        autoLogin: true,
      });
    },
    [guardianItem, onRequestOrSetPin],
  );

  const { error: codeError, setError: setCodeError } = useErrorMessage();
  const verifyManagerAddress = useVerifyManagerAddress();
  const latestVerifyManagerAddress = useLatestRef(verifyManagerAddress);

  const onFinish = useLockCallback(
    async (code: string) => {
      if (!requestCodeResult || !guardianItem || !code) return;
      const isRequestResult = pin && verificationType === VerificationType.register && managerAddress;
      digitInput.current?.lockInput();
      const loadingKey = Loading.show(isRequestResult ? { text: CreateAddressLoading } : undefined, true);
      try {
        const rst = await verification.checkVerificationCode({
          params: {
            type: LoginType[guardianItem?.guardianType as LoginType],
            verificationCode: code,
            guardianIdentifier: guardianItem.guardianAccount,
            ...requestCodeResult,
            verifierId: guardianItem?.verifier?.id,
            chainId: originChainId,
            operationType,
            targetChainId,
            operationDetails: JSON.stringify({ manager: latestVerifyManagerAddress.current }),
          },
        });
        !isRequestResult && CommonToast.success('Verified Successfully');

        const verifierInfo: VerifierInfo = {
          ...rst,
          verifierId: guardianItem?.verifier?.id,
        };

        switch (verificationType) {
          case VerificationType.register:
            onRequestOrSetPin({
              showLoading: false,
              managerInfo: {
                verificationType: VerificationType.register,
                loginAccount: guardianItem.guardianAccount,
                type: guardianItem.guardianType,
              },
              verifierInfo,
            });
            break;

          case VerificationType.setLoginAccount:
          case VerificationType.unsetLoginAccount:
          case VerificationType.addGuardian:
            if (verifierInfo.signature && verifierInfo.verificationDoc) {
              navigationService.navigate('GuardianApproval', {
                approvalType: VERIFICATION_TO_APPROVAL_MAP[verificationType],
                guardianItem,
                verifierInfo,
                verifiedTime: Date.now(),
                accelerateChainId,
              });
            }
            break;

          case VerificationType.revokeAccount: {
            //TODO: CHANGE ACTION
            console.log('revokeAccount!!');
            const caContract = await getCurrentCAContract();
            const removeManagerParams = {
              caContract,
              managerAddress,
              caHash: caHash || '',
            };
            const deleteParams = {
              type: LoginType[guardianItem.guardianType],
              chainId: originChainId,
              token: code,
              guardianIdentifier: guardianItem.guardianAccount,
              ...requestCodeResult,
              verifierId: guardianItem?.verifier?.id || '',
            };

            try {
              await deleteLoginAccount({
                removeManagerParams,
                deleteParams,
              });
              await logout();
            } catch (error) {
              CommonToast.failError(error);
            } finally {
              Loading.hide();
            }

            break;
          }

          case VerificationType.communityRecovery: {
            if (autoLogin) {
              registerAccount({ verifierInfo, codeResult: requestCodeResult });
              break;
            }
          }

          // eslint-disable-next-line no-fallthrough
          default:
            setGuardianStatus({
              requestCodeResult: requestCodeResult,
              status: VerifyStatus.Verified,
              verifierInfo,
            });
            navigationService.goBack();
            break;
        }
      } catch (error) {
        const _isInvalidCode = checkVerifierIsInvalidCode(error);
        if (_isInvalidCode) {
          setCodeError('', VERIFY_INVALID_TIME);
        } else {
          CommonToast.failError(error, 'Verify Fail');
        }

        digitInput.current?.reset();
        Loading.hide(loadingKey);
      }
      digitInput.current?.unLockInput();
      !isRequestResult && Loading.hide(loadingKey);
    },
    [
      requestCodeResult,
      guardianItem,
      pin,
      verificationType,
      managerAddress,
      originChainId,
      operationType,
      targetChainId,
      latestVerifyManagerAddress,
      onRequestOrSetPin,
      setGuardianStatus,
      accelerateChainId,
      getCurrentCAContract,
      caHash,
      logout,
      autoLogin,
      registerAccount,
      setCodeError,
    ],
  );

  const resendCode = useLockCallback(async () => {
    digitInput.current?.lockInput();
    Loading.show(undefined, true);
    try {
      const req = await verification.sendVerificationCode({
        params: {
          type: LoginType[guardianItem?.guardianType as LoginType],
          guardianIdentifier: guardianItem?.guardianAccount,
          verifierId: guardianItem?.verifier?.id,
          chainId: originChainId,
          operationType,
          targetChainId,
        },
      });
      if (req.verifierSessionId) {
        setRequestCodeResult(req);
        setGuardianStatus({
          requestCodeResult: req,
          status: VerifyStatus.Verifying,
        });
        countdown.current?.resetTime(60);
      }
    } catch (error) {
      CommonToast.failError(error, 'Verify Fail');
    }
    digitInput.current?.unLockInput();
    digitInput.current?.reset();
    Loading.hide();
  }, [guardianItem, operationType, originChainId, setGuardianStatus, targetChainId]);

  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      {guardianItem ? <GuardianItem guardianItem={guardianItem} isButtonHide /> : null}
      <TipText
        isRegister={!verificationType || (verificationType as VerificationType) === VerificationType.register}
        guardianAccount={guardianItem?.guardianAccount}
      />
      <DigitInput
        ref={digitInput}
        onChangeText={() => {
          setCodeError();
        }}
        onFinish={onFinish}
        maxLength={DIGIT_CODE.length}
        isError={codeError.isError}
      />
      <VerifierCountdown
        isInvalidCode={codeError.isError}
        style={GStyles.marginTop(24)}
        onResend={resendCode}
        ref={countdown}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: pTd(8),
    paddingHorizontal: pTd(20),
  },
});
