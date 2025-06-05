import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { setUserGuardianSessionIdAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { verification } from 'utils/api';
import { useCurrentWalletInfo, useOriginChainId, useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCommonState } from 'store/Provider/hooks';
import { useLocation } from 'react-router';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { CodeVerifyUI, PortkeyStyleProvider } from '@portkey/did-ui-react';
import { AccountType } from '@portkey/services';
import { ChainId } from '@portkey-wallet/types';
import singleMessage from 'utils/singleMessage';
import { useLatestRef } from '@portkey-wallet/hooks';
import clsx from 'clsx';
import './index.less';

const MAX_TIMER = 60;

interface VerifierPageProps {
  operationType: OperationTypeEnum;
  operationDetails?: string;
  loginAccount?: LoginInfo;
  currentGuardian?: UserGuardianItem;
  guardianType?: LoginType;
  isInitStatus?: boolean;
  targetChainId?: ChainId;
  onSuccess?: (res: { verificationDoc: string; signature: string; verifierId: string }) => void;
}

interface ICodeVerifyUIInterface {
  setTimer: (timer: number) => void;
}

export default function VerifierPage({
  operationType,
  currentGuardian,
  guardianType,
  isInitStatus,
  targetChainId,
  operationDetails,
  onSuccess,
}: VerifierPageProps) {
  const { isNotLessThan768 } = useCommonState();
  const { pathname } = useLocation();
  const [isFromLoginOrRegister, setIsFromLoginOrRegister] = useState(true);
  const [pinVal, setPinVal] = useState<string>();
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();
  const uiRef = useRef<ICodeVerifyUIInterface>();
  const verifyManagerAddress = useVerifyManagerAddress();
  const latestVerifyManagerAddress = useLatestRef(verifyManagerAddress);
  const { caHash } = useCurrentWalletInfo();
  const [checking, setChecking] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    setIsFromLoginOrRegister(pathname.includes('register') || pathname.includes('login'));
    console.log('isFromLoginOrRegister', isFromLoginOrRegister);
  }, [isFromLoginOrRegister, pathname]);

  const onFinish = useCallback(
    async (code: string) => {
      try {
        console.log(code);
        if (code && code.length === 6) {
          if (!guardianType && guardianType !== 0) return singleMessage.error('Missing guardiansType');
          if (!currentGuardian?.verifierInfo) throw 'Missing verifierInfo!!!';
          setChecking(true);
          const _operationDetails = operationDetails ? JSON.parse(operationDetails) : {};
          const res = await verification.checkVerificationCode({
            params: {
              type: LoginType[currentGuardian?.guardianType as LoginType],
              guardianIdentifier: currentGuardian.guardianAccount.replaceAll(' ', ''),
              verifierSessionId: currentGuardian.verifierInfo.sessionId,
              verificationCode: code,
              verifierId: currentGuardian.verifier?.id || '',
              chainId: originChainId,
              operationType,
              targetChainId: targetChainId,
              caHash,
              operationDetails: JSON.stringify({
                ..._operationDetails,
                manager: latestVerifyManagerAddress.current,
                caHash,
              }),
            },
          });

          setChecking(false);
          if (res.signature) return onSuccess?.({ ...res, verifierId: currentGuardian.verifier?.id || '' });

          if (res?.error?.message) {
            setErr(res.error.message);
          } else {
            setErr('Invalid code');
          }
          setPinVal('');
        }
      } catch (error: any) {
        console.log(error, 'error====');
        setChecking(false);
        setPinVal('');
        const _error = verifyErrorHandler(error);
        setErr(_error);
      }
    },
    [
      guardianType,
      currentGuardian,
      setChecking,
      operationDetails,
      originChainId,
      operationType,
      targetChainId,
      caHash,
      latestVerifyManagerAddress,
      onSuccess,
    ],
  );

  const errorMsg = useMemo(() => {
    switch (err) {
      case 'Invalid code':
        return 'Incorrect code, please try again.';
      case 'Too Many Retries':
        return 'Too many retries. Please request a new verification code to continue.';
      case 'Timeout':
        return 'The code has expired. Please resend it.';
      case '':
        return '';
      default:
        return err;
    }
  }, [err]);

  const resendCode = useCallback(async () => {
    try {
      if (!currentGuardian?.guardianAccount) throw 'Missing loginGuardianType';
      if (!guardianType && guardianType !== 0) throw 'Missing guardiansType';
      setChecking(true);
      const res = await verification.sendVerificationCode({
        params: {
          guardianIdentifier: currentGuardian.guardianAccount.replaceAll(' ', ''),
          type: LoginType[currentGuardian.guardianType],
          verifierId: currentGuardian.verifier?.id || '',
          chainId: originChainId,
          operationType,
          targetChainId: targetChainId,
          operationDetails,
        },
      });
      setChecking(false);
      if (res.verifierSessionId) {
        uiRef.current?.setTimer(MAX_TIMER);
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
      setChecking(false);
      const _error = verifyErrorHandler(error);
      singleMessage.error(_error);
    }
  }, [
    currentGuardian,
    guardianType,
    setChecking,
    originChainId,
    operationType,
    targetChainId,
    operationDetails,
    dispatch,
  ]);

  return currentGuardian?.verifier ? (
    <PortkeyStyleProvider>
      <CodeVerifyUI
        ref={uiRef}
        className={clsx(isNotLessThan768 ? '' : 'popup-page')}
        verifier={currentGuardian.verifier as any}
        guardianIdentifier={currentGuardian?.guardianAccount || ''}
        isCountdownNow={isInitStatus}
        isLoginGuardian={currentGuardian?.isLoginAccount}
        accountType={LoginType[currentGuardian?.guardianType as LoginType] as AccountType}
        code={pinVal}
        error={!!err}
        errorMsg={errorMsg}
        isLoading={checking}
        tipExtra={'Please contact your guardians, and enter '}
        onReSend={resendCode}
        onCodeFinish={onFinish}
        onCodeChange={(v) => {
          setErr('');
          setPinVal(v);
        }}
      />
    </PortkeyStyleProvider>
  ) : (
    <div></div>
  );
}
