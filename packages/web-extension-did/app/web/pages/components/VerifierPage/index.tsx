import { Button, message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { PasscodeInput } from 'antd-mobile';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import './index.less';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { useTranslation } from 'react-i18next';
import { setUserGuardianSessionIdAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useEffectOnce } from 'react-use';
import { verification } from 'utils/api';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCommonState } from 'store/Provider/hooks';
import { useLocation } from 'react-router';
import { RecaptchaType } from '@portkey-wallet/types/verifier';

const MAX_TIMER = 60;

enum VerificationError {
  InvalidCode = 'Invalid code',
  codeExpired = 'The code has expired. Please resend it.',
}

interface VerifierPageProps {
  recaptchaType: RecaptchaType;
  loginAccount?: LoginInfo;
  currentGuardian?: UserGuardianItem;
  guardianType?: LoginType;
  isInitStatus?: boolean;
  onSuccess?: (res: { verificationDoc: string; signature: string; verifierId: string }) => void;
}

export default function VerifierPage({
  recaptchaType,
  currentGuardian,
  guardianType,
  isInitStatus,
  onSuccess,
}: VerifierPageProps) {
  const { setLoading } = useLoading();
  const [timer, setTimer] = useState<number>(0);
  const { isNotLessThan768 } = useCommonState();
  const { pathname } = useLocation();
  const [isFromLoginOrRegister, setIsFromLoginOrRegister] = useState(true);
  const [pinVal, setPinVal] = useState<string>();
  const timerRef = useRef<NodeJS.Timer | number>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const originChainId = useOriginChainId();

  useEffect(() => {
    setIsFromLoginOrRegister(pathname.includes('register') || pathname.includes('login'));
  }, [pathname]);

  useEffectOnce(() => {
    isInitStatus && setTimer(MAX_TIMER);
  });

  const onFinish = useCallback(
    async (code: string) => {
      try {
        console.log(code);
        if (code && code.length === 6) {
          if (!guardianType && guardianType !== 0) return message.error('Missing guardiansType');
          if (!currentGuardian?.verifierInfo) throw 'Missing verifierInfo!!!';
          setLoading(true);

          const res = await verification.checkVerificationCode({
            params: {
              type: LoginType[currentGuardian?.guardianType as LoginType],
              guardianIdentifier: currentGuardian.guardianAccount.replaceAll(' ', ''),
              verifierSessionId: currentGuardian.verifierInfo.sessionId,
              verificationCode: code,
              verifierId: currentGuardian.verifier?.id || '',
              chainId: originChainId,
            },
          });

          setLoading(false);
          if (res.signature) return onSuccess?.({ ...res, verifierId: currentGuardian.verifier?.id || '' });

          if (res?.error?.message) {
            message.error(t(res.error.message));
          } else {
            message.error(t(VerificationError.InvalidCode));
          }
          setPinVal('');
        }
      } catch (error: any) {
        console.log(error, 'error====');
        setLoading(false);
        setPinVal('');
        const _error = verifyErrorHandler(error);
        message.error(_error);
      }
    },
    [guardianType, originChainId, currentGuardian, setLoading, onSuccess, t],
  );

  const resendCode = useCallback(async () => {
    try {
      if (!currentGuardian?.guardianAccount) throw 'Missing loginGuardianType';
      if (!guardianType && guardianType !== 0) throw 'Missing guardiansType';
      setLoading(true);

      const res = await verification.sendVerificationCode({
        params: {
          guardianIdentifier: currentGuardian.guardianAccount.replaceAll(' ', ''),
          type: LoginType[guardianType],
          verifierId: currentGuardian.verifier?.id || '',
          chainId: originChainId,
          operationType: recaptchaType,
        },
      });
      setLoading(false);
      if (res.verifierSessionId) {
        setTimer(MAX_TIMER);
        dispatch(
          setUserGuardianSessionIdAction({
            key: currentGuardian?.key ?? `${currentGuardian?.guardianAccount}&${currentGuardian?.verifier?.name}`,
            verifierInfo: {
              sessionId: res.verifierSessionId,
              endPoint: res.endPoint,
            },
          }),
        );
      }
    } catch (error: any) {
      console.log(error, 'error===');
      setLoading(false);
      const _error = verifyErrorHandler(error);
      message.error(_error);
    }
  }, [currentGuardian, guardianType, originChainId, dispatch, setLoading, recaptchaType]);

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

  return (
    <div className={clsx('verifier-page-wrapper', isNotLessThan768 || 'popup-page')}>
      {currentGuardian?.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
      <div className="flex-row-center login-account-wrapper">
        <VerifierPair
          guardianType={currentGuardian?.guardianType}
          verifierSrc={currentGuardian?.verifier?.imageUrl}
          verifierName={currentGuardian?.verifier?.name}
        />
        <span className="login-account">{currentGuardian?.guardianAccount || ''}</span>
      </div>
      <div className="send-tip">
        {!isFromLoginOrRegister && 'Please contact your guardians, and enter '}
        <span>{t('sendCodeTip1', { codeCount: DIGIT_CODE.length })}</span>
        <span className="account">{currentGuardian?.guardianAccount}</span>
        <span>{`. `}</span>
        {t('sendCodeTip2', { minute: DIGIT_CODE.expiration })}
      </div>
      <div className="password-wrapper">
        <PasscodeInput
          value={pinVal}
          length={DIGIT_CODE.length}
          seperated
          plain
          onChange={(v) => setPinVal(v)}
          onFill={onFinish}
        />
        <Button
          type="text"
          disabled={!!timer}
          onClick={resendCode}
          className={clsx('text-center resend-btn', timer && 'resend-after-btn')}>
          {timer ? t('Resend after', { timer }) : t('Resend')}
        </Button>
      </div>
    </div>
  );
}
