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
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { AccountOriginalType } from 'model/verify/after-verify';

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

/*
accountIdentifier,
accountOriginalType,
guardianConfig: {
  accountIdentifier,
  accountOriginalType,
  isLoginGuardian: true,
  name: recommendedGuardian.name ?? 'Portkey',
  imageUrl: recommendedGuardian.imageUrl ?? null,
  sendVerifyCodeParams: {
    type: AccountOriginalType[accountOriginalType] as AccountOrGuardianOriginalTypeStr,
    guardianIdentifier: accountIdentifier,
    verifierId: recommendedGuardian.id,
    chainId: PortkeyConfig.currChainId,
    operationType: OperationTypeEnum.register,
  },
},*/

export default function VerifierDetails({
  verificationType = VerificationType.register,
  accountIdentifier,
  accountOriginalType,
}: {
  verificationType?: VerificationType;
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
}) {
  const guardianItem = {
    guardianAccount: accountIdentifier,
    guardianType: LoginType.Phone,
    verifier: {
      id: '123456789',
    },
  };

  const countdown = useRef<VerifierCountdownInterface>();
  // useEffectOnce(() => {
  //   if (!startResend) countdown.current?.resetTime(60);
  // });
  // const [requestCodeResult, setRequestCodeResult] =
  //   useState<RouterParams['requestCodeResult']>(paramsRequestCodeResult);
  const digitInput = useRef<DigitInputInterface>();
  // const { caHash, address: managerAddress } = useCurrentWalletInfo();
  // const pin = usePin();
  // const onRequestOrSetPin = useOnRequestOrSetPin();
  // const getCurrentCAContract = useGetCurrentCAContract();
  const getCurrentCAContract = null;
  // const setGuardianStatus = useCallback(
  //   (status: GuardiansStatusItem) => {
  //     myEvents.setGuardianStatus.emit({
  //       key: guardianItem?.key,
  //       status,
  //     });
  //   },
  //   [guardianItem?.key],
  // );
  const onSetLoginAccount = useCallback(async () => {
    console.log('onSetLoginAccount');
  }, []);
  /*
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
  */

  /*
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
  */

  const onFinish = useCallback(() => {}, []);
  const resendCode = useCallback(async () => {}, []);

  return (
    <PageContainer
      type="leftBack"
      titleDom="VerifierDetails"
      safeAreaColor={['white']}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
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
    paddingHorizontal: 20,
  },
});
