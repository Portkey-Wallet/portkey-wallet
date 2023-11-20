import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import {
  ApprovalType,
  VerificationType,
  OperationTypeEnum,
  VerifierInfo,
  VerifyStatus,
} from '@portkey-wallet/types/verifier';
import GuardianItem from '../components/GuardianItem';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import myEvents from 'utils/deviceEvent';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGetCurrentCAContract } from 'hooks/contract';
import { setLoginAccount } from 'utils/guardian';
import { LoginType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { GuardiansApproved, GuardiansStatusItem } from '../types';
import { verification } from 'utils/api';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useOnRequestOrSetPin } from 'hooks/login';
import { usePin } from 'hooks/store';
import { VERIFICATION_TO_OPERATION_MAP } from '@portkey-wallet/constants/constants-ca/verifier';
import { CreateAddressLoading } from '@portkey-wallet/constants/constants-ca/wallet';
import { handleGuardiansApproved } from 'utils/login';

type RouterParams = {
  guardianItem?: UserGuardianItem;
  requestCodeResult?: { verifierSessionId: string };
  startResend?: boolean;
  verificationType?: VerificationType;
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
  const pin = usePin();
  const onRequestOrSetPin = useOnRequestOrSetPin();
  const getCurrentCAContract = useGetCurrentCAContract();
  const setGuardianStatus = useCallback(
    (status: GuardiansStatusItem) => {
      myEvents.setGuardianStatus.emit({
        key: guardianItem?.key,
        status,
      });
    },
    [guardianItem?.key],
  );
  const onSetLoginAccount = useCallback(async () => {
    if (!managerAddress || !caHash || !guardianItem) return;

    try {
      const caContract = await getCurrentCAContract();
      const req = await setLoginAccount(caContract, managerAddress, caHash, guardianItem);
      if (req && !req.error) {
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianDetail', {
          guardian: { ...guardianItem, isLoginAccount: true },
        });
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [caHash, getCurrentCAContract, guardianItem, managerAddress]);

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

  const onFinish = useLockCallback(
    async (code: string) => {
      if (!requestCodeResult || !guardianItem || !code) return;
      const isRequestResult = pin && verificationType === VerificationType.register && managerAddress;
      const loadingKey = Loading.show(isRequestResult ? { text: CreateAddressLoading } : undefined);
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
          },
        });
        !isRequestResult && CommonToast.success('Verified Successfully');

        const verifierInfo: VerifierInfo = {
          ...rst,
          verifierId: guardianItem?.verifier?.id,
        };

        switch (verificationType) {
          case VerificationType.communityRecovery: {
            if (autoLogin) {
              registerAccount({ verifierInfo, codeResult: requestCodeResult });
              break;
            }
          }
          // eslint-disable-next-line no-fallthrough
          case VerificationType.addGuardianByApprove:
          case VerificationType.editGuardian:
          case VerificationType.deleteGuardian:
          case VerificationType.removeOtherManager:
            setGuardianStatus({
              requestCodeResult: requestCodeResult,
              status: VerifyStatus.Verified,
              verifierInfo,
            });
            navigationService.goBack();
            break;
          case VerificationType.addGuardian:
            if (verifierInfo.signature && verifierInfo.verificationDoc) {
              navigationService.navigate('GuardianApproval', {
                approvalType: ApprovalType.addGuardian,
                guardianItem,
                verifierInfo,
                verifiedTime: Date.now(),
              });
            }
            break;
          case VerificationType.setLoginAccount:
            await onSetLoginAccount();
            break;
          default:
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
        }
      } catch (error) {
        CommonToast.failError(error, 'Verify Fail');
        digitInput.current?.reset();
        Loading.hide(loadingKey);
      }
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
      setGuardianStatus,
      onSetLoginAccount,
      onRequestOrSetPin,
    ],
  );

  const resendCode = useCallback(async () => {
    try {
      Loading.show();

      const req = await verification.sendVerificationCode({
        params: {
          type: LoginType[guardianItem?.guardianType as LoginType],
          guardianIdentifier: guardianItem?.guardianAccount,
          verifierId: guardianItem?.verifier?.id,
          chainId: originChainId,
          operationType,
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
    digitInput.current?.reset();
    Loading.hide();
  }, [guardianItem, operationType, originChainId, setGuardianStatus]);

  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      {guardianItem ? <GuardianItem guardianItem={guardianItem} isButtonHide /> : null}
      <TipText
        isRegister={!verificationType || (verificationType as VerificationType) === VerificationType.register}
        guardianAccount={guardianItem?.guardianAccount}
      />
      <DigitInput ref={digitInput} onFinish={onFinish} maxLength={DIGIT_CODE.length} />
      <VerifierCountdown style={GStyles.marginTop(24)} onResend={resendCode} ref={countdown} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: 8,
  },
});
