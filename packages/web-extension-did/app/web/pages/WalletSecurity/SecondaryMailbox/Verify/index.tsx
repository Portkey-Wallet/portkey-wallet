import CommonHeader from 'components/CommonHeader';
import { useLocationState, useNavigateState } from 'hooks/router';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import BaseGuardianTypeIcon from 'components/BaseGuardianTypeIcon';
import clsx from 'clsx';
import { PasscodeInput } from 'antd-mobile';
import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import { ThrottleButton } from '@portkey/did-ui-react';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { TSecondaryMailboxVerifyState } from 'types/router';
import { request } from '@portkey-wallet/api/api-did';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useSecondaryMail } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import './index.less';

const MAX_TIMER = 60;

export default function SecondaryMailboxVerify() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigateState();
  const { state } = useLocationState<TSecondaryMailboxVerifyState>();
  const [code, setCode] = useState<string>();
  const [codeErr, setCodeErr] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timer>();
  const sessionIdRef = useRef(state.sessionid);
  const { sendSecondaryEmailCode } = useSecondaryMail(state.email);
  const { setLoading } = useLoading();

  const goBack = useCallback(() => {
    navigate('/setting/wallet-security/secondary-mailbox-edit', { state: { email: state.email } });
  }, [navigate, state.email]);
  useEffect(() => {
    if (!(state.email && state.sessionid)) {
      goBack();
    }
  }, [goBack, navigate, state.email, state.sessionid]);
  useEffectOnce(() => {
    setTimer(MAX_TIMER);
  });
  useEffect(() => {
    if (timer !== MAX_TIMER) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        const newTime = t - 1;
        if (newTime <= 0) {
          timerRef.current && clearInterval(timerRef.current);
          timerRef.current = undefined;
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [timer]);
  const onCodeChange = useCallback((pin: string) => {
    setCode(pin);
    setCodeErr(false);
  }, []);
  const reSendCode = useCallback(async () => {
    try {
      const res = await sendSecondaryEmailCode();
      if (res.verifierSessionId) {
        sessionIdRef.current = res.verifierSessionId;
        setTimer(MAX_TIMER);
      } else {
        throw new Error('send fail');
      }
    } catch (error) {
      console.log('===sendSecondaryEmailCode error', error);
      singleMessage.error(handleErrorMessage(error || 'send fail'));
    }
  }, [sendSecondaryEmailCode]);
  const btnText = useMemo(() => {
    if (codeErr) return 'Invalid code';
    return timer ? `Resend after (${timer}s)` : 'Resend';
  }, [codeErr, timer]);
  const onCodeFinish = useCallback(
    async (code: string) => {
      setLoading(true);
      try {
        const rst = await request.security.secondaryEmailCodeCheck({
          params: {
            verificationCode: code,
            verifierSessionId: sessionIdRef.current,
          },
        });
        if (rst.verifiedResult) {
          singleMessage.success('Set Secondary Email Successfully');
          navigate('/setting/wallet-security/secondary-mailbox');
        } else {
          throw 'Invalid code';
        }
      } catch (error) {
        console.log('===secondaryEmailCodeCheck error', error);
        singleMessage.error(handleErrorMessage(error || 'Invalid code'));
        onCodeChange('');
      } finally {
        setLoading(false);
      }
    },
    [navigate, onCodeChange, setLoading],
  );
  const mainContent = useMemo(() => {
    return (
      <div className="secondary-mailbox-verify-body">
        <div className="verify-email flex-row-center">
          <BaseGuardianTypeIcon type="Email" />
          <div>{state.email}</div>
        </div>
        <div className="verify-tip">
          {`A 6-digit code was sent to `}
          <span>{state.email}</span>
          {`. Enter it within 10 minutes.`}
        </div>
        <div className={clsx('verify-code', codeErr && 'verify-code-error')}>
          <PasscodeInput
            value={code}
            length={DIGIT_CODE.length}
            seperated
            plain
            onChange={onCodeChange}
            onFill={onCodeFinish}
          />
          <ThrottleButton
            type="text"
            disabled={!!timer}
            onClick={reSendCode}
            className={clsx('resend-btn', timer && 'resend-after-btn')}>
            {btnText}
          </ThrottleButton>
        </div>
      </div>
    );
  }, [btnText, code, codeErr, onCodeChange, onCodeFinish, reSendCode, state.email, timer]);
  return isNotLessThan768 ? (
    <div className="secondary-mailbox-verify-page flex-column secondary-mailbox-verify-prompt">
      <SecondPageHeader leftCallBack={goBack} />
      {mainContent}
    </div>
  ) : (
    <div className="secondary-mailbox-verify-page flex-column secondary-mailbox-verify-popup">
      <CommonHeader className="popup-header-wrap" onLeftBack={goBack} />
      {mainContent}
    </div>
  );
}
