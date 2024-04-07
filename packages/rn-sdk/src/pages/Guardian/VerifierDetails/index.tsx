import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import VerifierCountdown, {
  VerifierCountdownInterface,
} from '@portkey-wallet/rn-components/components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from '@portkey-wallet/rn-components/components/DigitInput';
import React, { useMemo, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { FontStyles } from 'assets/theme/styles';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { AccountOriginalType } from 'model/verify/core';
import usePhoneOrEmailGuardian, { GuardianConfig, INIT_TIME_OUT } from 'model/verify/guardian';
import { NetworkController } from 'network/controller';
import { verifyHumanMachine } from '@portkey-wallet/rn-components/components/VerifyHumanMachine';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { CheckVerifyCodeResultDTO } from 'network/dto/guardian';
import GuardianItem from '../components/GuardianItem';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';

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

export default function VerifierDetails({
  guardianConfig,
  operationType,
}: {
  operationType: OperationTypeEnum;
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardianConfig: GuardianConfig;
}) {
  const { onFinish } = useBaseContainer({
    entryName: PortkeyEntries.VERIFIER_DETAIL_ENTRY,
  });

  const realOperationType =
    operationType !== OperationTypeEnum.unknown ? operationType : guardianConfig.sendVerifyCodeParams.operationType;
  const guardianItem: UserGuardianItem = {
    guardianAccount: guardianConfig.sendVerifyCodeParams.guardianIdentifier,
    guardianType: guardianConfig.sendVerifyCodeParams.type === 'Phone' ? LoginType.Phone : LoginType.Email,
    verifier: {
      id: guardianConfig.sendVerifyCodeParams.verifierId,
      name: guardianConfig.name ?? 'Portkey',
      imageUrl: guardianConfig.imageUrl ?? '',
    },
    isLoginAccount: guardianConfig.isLoginGuardian,
    key: '0',
    identifierHash: '',
    salt: guardianConfig.salt ?? '',
  };

  const guardianInfo = useMemo(() => {
    const parsedGuardian = JSON.parse(JSON.stringify(guardianConfig));
    parsedGuardian.sendVerifyCodeParams.operationType = realOperationType;
    return parsedGuardian;
  }, [guardianConfig, realOperationType]);

  const { countDown: countDownNumber, sendVerifyCode, checkVerifyCode } = usePhoneOrEmailGuardian(guardianInfo);

  const tryToResendCode = async () => {
    if (countDownNumber > 0) {
      console.error(`countDown: ${countDownNumber}`);
      return;
    }
    try {
      let token: string | undefined;
      Loading.show();
      const needRecaptcha = await NetworkController.isGoogleRecaptchaOpen(realOperationType);
      if (needRecaptcha) {
        token = (await verifyHumanMachine('en')) as string;
      }
      const sendSuccess = await sendVerifyCode(token);
      if (sendSuccess) {
        countdown.current?.resetTime(INIT_TIME_OUT);
        Loading.hide();
        return;
      }
    } catch (e) {
      Loading.hide();
    }
    CommonToast.fail('Network error, please try again.');
  };

  const onPageFinish = (result: CheckVerifyCodeResultDTO | null) => {
    onFinish<VerifyPageResult>({
      status: result ? 'success' : 'fail',
      data: { verifiedData: result ? JSON.stringify(result) : '' },
    });
  };

  const onInputFinish = async (code: string) => {
    try {
      Loading.show();
      const result = await checkVerifyCode(code);
      Loading.hide();
      if (result?.signature && result?.verificationDoc) {
        onPageFinish(result);
        return;
      } else if (result?.failedBecauseOfTooManyRequests) {
        digitInput.current?.reset();
        CommonToast.fail('Too many retries');
        return;
      }
    } catch (e) {
      Loading.hide();
    }
    digitInput.current?.reset();
    CommonToast.fail('Verification code is incorrect');
  };

  const onBack = () => {
    onPageFinish(null);
  };

  const countdown = useRef<VerifierCountdownInterface>();
  const digitInput = useRef<DigitInputInterface>();

  useEffectOnce(() => {
    if (guardianConfig.alreadySent) {
      countdown.current?.resetTime(INIT_TIME_OUT);
    }
  });

  return (
    <PageContainer
      type="leftBack"
      titleDom=""
      safeAreaColor={['white']}
      leftCallback={onBack}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      {guardianItem ? <GuardianItem guardianItem={guardianItem} isButtonHide /> : null}
      <TipText
        isRegister={realOperationType === OperationTypeEnum.register}
        guardianAccount={guardianItem?.guardianAccount}
      />
      <DigitInput ref={digitInput} onFinish={onInputFinish} maxLength={DIGIT_CODE.length} />
      <VerifierCountdown style={GStyles.marginTop(24)} onResend={tryToResendCode} ref={countdown} />
    </PageContainer>
  );
}

export interface VerifyPageResult {
  verifiedData: string;
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: 8,
    paddingHorizontal: 20,
  },
});
