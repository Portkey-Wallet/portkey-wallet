import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextH1 } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useMemo, useRef } from 'react';
import { Text } from 'react-native';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { makeStyles, useTheme } from '@rneui/themed';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';
import { verification } from 'utils/api';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { checkVerifierIsInvalidCode } from '@portkey-wallet/utils/guardian';
import { pTd } from 'utils/unit';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';

type RouterParams = {
  verifierSessionId: string;
  email: string;
};
function TipText({ email }: { email?: string }) {
  const { theme } = useTheme();
  const [first, last] = useMemo(() => {
    return [
      'Your assigned Guardian Verifier, has sent a verification email to ',
      `. Please enter the ${DIGIT_CODE.length}-digit code from the email to continue.`,
    ];
  }, []);
  return (
    <TextM
      style={[FontStyles.font3, GStyles.marginTop(16), GStyles.marginBottom(32), { color: theme.colors.textBase2 }]}>
      {first}
      <Text style={[FontStyles.font4, { color: theme.colors.textBrand1 }]}>{email}</Text>
      {last}
    </TextM>
  );
}
export default function VerifierEmail() {
  const styles = getStyles();
  const { verifierSessionId, email } = useRouterParams<RouterParams>();
  const verifierSessionIdRef = useRef<string>(verifierSessionId);
  const countdown = useRef<VerifierCountdownInterface>();
  useEffectOnce(() => {
    countdown.current?.resetTime(60);
  });
  const digitInput = useRef<DigitInputInterface>();

  const { error: codeError, setError: setCodeError } = useErrorMessage();

  const onFinish = useLockCallback(
    async (code: string) => {
      digitInput.current?.lockInput();
      const loadingKey = Loading.show();
      try {
        const rst = await verification.checkSecondaryVerificationCode({
          params: {
            secondaryEmail: email,
            verificationCode: code,
            verifierSessionId: verifierSessionIdRef.current,
          },
        });
        if (rst.verifiedResult) {
          CommonToast.success('Successfully');
          myEvents.updateSecondaryEmail.emit({ email });
          navigationService.navigate('SecondaryMailboxHome', {
            secondaryEmail: email,
          });
        } else {
          throw 'Invalid code';
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
      } finally {
        digitInput.current?.unLockInput();
        Loading.hide();
      }
    },
    [email, setCodeError],
  );

  const resendCode = useLockCallback(async () => {
    digitInput.current?.lockInput();
    Loading.show(undefined, true);
    try {
      const req = await verification.sendSecondaryVerificationCode({
        params: {
          secondaryEmail: email,
        },
      });
      if (req.verifierSessionId) {
        verifierSessionIdRef.current = req.verifierSessionId;
        countdown.current?.resetTime(60);
      }
    } catch (error) {
      CommonToast.failError(error, 'Verify Fail');
    }
    digitInput.current?.unLockInput();
    digitInput.current?.reset();
    Loading.hide();
  }, [email]);

  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      <TextH1>Verify your email</TextH1>
      <TipText email={email} />
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
        style={GStyles.marginTop(40)}
        onResend={resendCode}
        ref={countdown}
      />
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    paddingHorizontal: pTd(16),
    marginTop: pTd(24),
    backgroundColor: theme.colors.bgBase1,
  },
}));
