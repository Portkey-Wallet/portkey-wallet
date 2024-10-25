import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextH1, TextM } from 'components/CommonText';
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
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
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
import { checkVerifierIsInvalidCode, checkVerifierIsTimeout } from '@portkey-wallet/utils/guardian';
import { pTd } from 'utils/unit';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';
import { deleteLoginAccount } from '@portkey-wallet/utils/deleteAccount';
import { useGetCurrentCAContract } from 'hooks/contract';
import useLogOut from 'hooks/useLogOut';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';

type RouterParams = {
  guardianItem?: UserGuardianItem;
  requestCodeResult?: { verifierSessionId: string };
  startResend?: boolean;
  verificationType?: VerificationType;
  targetChainId?: ChainId;
  accelerateChainId?: ChainId;
  autoLogin?: boolean;
  operationDetails: string;
};

export default function VerifierDetails() {
  const styles = getStyles();

  const {
    guardianItem,
    requestCodeResult: paramsRequestCodeResult,
    startResend,
    verificationType,
    targetChainId,
    accelerateChainId,
    autoLogin,
    operationDetails,
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
  // const verifyManagerAddress = useVerifyManagerAddress();
  // const latestVerifyManagerAddress = useLatestRef(verifyManagerAddress);

  const onGeneralVerify = useLockCallback(
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
            caHash,
            operationDetails: operationDetails,
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
        if (checkVerifierIsInvalidCode(error)) {
          setCodeError('Incorrect code, please try again.', VERIFY_INVALID_TIME);
        } else if (checkVerifierIsTimeout(error)) {
          setCodeError('Verification code expired. Please request a new one to continue.', VERIFY_INVALID_TIME);
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
      caHash,
      operationDetails,
      onRequestOrSetPin,
      setGuardianStatus,
      accelerateChainId,
      autoLogin,
      registerAccount,
      setCodeError,
    ],
  );

  const onRevokeVerify = useLockCallback(
    async (code: string) => {
      if (!guardianItem || !code) return;
      digitInput.current?.lockInput();
      Loading.show();
      try {
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
        await deleteLoginAccount({
          removeManagerParams,
          deleteParams,
        });
        await logout();
      } catch (error) {
        if (checkVerifierIsInvalidCode(error)) {
          setCodeError('Incorrect code, please try again.', VERIFY_INVALID_TIME);
        } else if (checkVerifierIsTimeout(error)) {
          setCodeError('Verification code expired. Please request a new one to continue.', VERIFY_INVALID_TIME);
        } else {
          CommonToast.failError(error, 'Verify Fail');
        }

        digitInput.current?.reset();
        Loading.hide();
      } finally {
        digitInput.current?.unLockInput();
        Loading.hide();
      }
    },
    [
      caHash,
      getCurrentCAContract,
      guardianItem,
      logout,
      managerAddress,
      originChainId,
      requestCodeResult,
      setCodeError,
    ],
  );

  const onFinish = useLockCallback(
    (code: string) => {
      verificationType === VerificationType.revokeAccount ? onRevokeVerify(code) : onGeneralVerify(code);
    },
    [onGeneralVerify, onRevokeVerify, verificationType],
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
          operationDetails,
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
  }, [
    guardianItem?.guardianAccount,
    guardianItem?.guardianType,
    guardianItem?.verifier?.id,
    operationDetails,
    operationType,
    originChainId,
    setGuardianStatus,
    targetChainId,
  ]);

  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      <TextH1 style={styles.headerTitle}>{'Verify your email'}</TextH1>

      <TextM style={styles.headerContent}>
        {`${guardianItem?.verifier?.name || ''}, your assigned Guardian Verifier, has sent a verification email to `}
        <TextM style={styles.headerContentAccount}>{`${guardianItem?.guardianAccount || ''}`}</TextM>
        {`. Please enter the 6-digit code from the email to continue.`}
      </TextM>

      <DigitInput
        ref={digitInput}
        onChangeText={() => {
          setCodeError();
        }}
        onFinish={onFinish}
        maxLength={DIGIT_CODE.length}
        isError={codeError.isError}
        errorMessage={codeError.errorMsg}
      />
      <VerifierCountdown style={GStyles.marginTop(40)} onResend={resendCode} ref={countdown} />
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    paddingTop: pTd(24),
    paddingHorizontal: pTd(16),
  },
  headerTitle: {
    marginBottom: pTd(16),
    ...fonts.BGMediumFont,
  },
  headerContent: {
    lineHeight: pTd(20),
    color: theme.colors.textBase2,
    marginBottom: pTd(32),
  },
  headerContentAccount: {
    color: theme.colors.iconBrand1,
  },
}));
