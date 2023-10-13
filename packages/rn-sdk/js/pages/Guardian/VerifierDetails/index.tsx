import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { OperationTypeEnum, VerificationType } from '@portkey-wallet/types/verifier';
import { FontStyles } from 'assets/theme/styles';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { AccountOriginalType } from 'model/verify/after-verify';
import usePhoneOrEmailGuardian, { GuardianConfig, INIT_TIME_OUT } from 'model/verify/guardian';
import { NetworkController } from 'network/controller';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import Loading from 'components/Loading';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { CheckVerifyCodeResultDTO } from 'network/dto/guardian';
import GuardianItem from '../components/GuardianItem';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import CommonToast from 'components/CommonToast';

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
  verificationType = VerificationType.register,
  accountIdentifier,
  guardianConfig,
}: {
  verificationType?: VerificationType;
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardianConfig: GuardianConfig;
}) {
  const { onFinish } = useBaseContainer({
    entryName: PortkeyEntries.VERIFIER_DETAIL_ENTRY,
  });

  const guardianItem: UserGuardianItem = {
    guardianAccount: accountIdentifier,
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

  const { countDown: countDownNumber, sendVerifyCode, checkVerifyCode } = usePhoneOrEmailGuardian(guardianConfig);

  const tryToResendCode = async () => {
    if (countDownNumber > 0) {
      console.error(`countDown: ${countDownNumber}`);
      return;
    }
    try {
      let token: string | undefined;
      Loading.show();
      const needRecaptcha = await NetworkController.isGoogleRecaptchaOpen(OperationTypeEnum.register); // TODO
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

  useEffect(() => {
    if (guardianConfig.alreadySent) {
      countdown.current?.resetTime(INIT_TIME_OUT);
    }
  }, []);

  return (
    <PageContainer
      type="leftBack"
      titleDom="VerifierDetails"
      safeAreaColor={['white']}
      leftCallback={onBack}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      {guardianItem ? <GuardianItem guardianItem={guardianItem} isButtonHide /> : null}
      <TipText
        isRegister={!verificationType || (verificationType as VerificationType) === VerificationType.register}
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
