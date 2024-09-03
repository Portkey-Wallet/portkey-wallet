import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { useTranslation } from 'react-i18next';
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

const MAX_TIMER = 60;

enum VerificationError {
  InvalidCode = 'Invalid code',
  codeExpired = 'The code has expired. Please resend it.',
}

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
  const { setLoading } = useLoading();
  const { isNotLessThan768 } = useCommonState();
  const { pathname } = useLocation();
  const [isFromLoginOrRegister, setIsFromLoginOrRegister] = useState(true);
  const [pinVal, setPinVal] = useState<string>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();
  const uiRef = useRef<ICodeVerifyUIInterface>();
  const verifyManagerAddress = useVerifyManagerAddress();
  const latestVerifyManagerAddress = useLatestRef(verifyManagerAddress);
  const { caHash } = useCurrentWalletInfo();

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
          setLoading(true);
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

          setLoading(false);
          if (res.signature) return onSuccess?.({ ...res, verifierId: currentGuardian.verifier?.id || '' });

          if (res?.error?.message) {
            singleMessage.error(t(res.error.message));
          } else {
            singleMessage.error(t(VerificationError.InvalidCode));
          }
          setPinVal('');
        }
      } catch (error: any) {
        console.log(error, 'error====');
        setLoading(false);
        setPinVal('');
        const _error = verifyErrorHandler(error);
        singleMessage.error(_error);
      }
    },
    [
      guardianType,
      currentGuardian,
      setLoading,
      operationDetails,
      originChainId,
      operationType,
      targetChainId,
      caHash,
      latestVerifyManagerAddress,
      onSuccess,
      t,
    ],
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
          operationType,
          targetChainId: targetChainId,
          operationDetails,
        },
      });
      setLoading(false);
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
      setLoading(false);
      const _error = verifyErrorHandler(error);
      singleMessage.error(_error);
    }
  }, [
    currentGuardian,
    guardianType,
    setLoading,
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
        className={isNotLessThan768 ? '' : 'popup-page'}
        verifier={currentGuardian.verifier as any}
        guardianIdentifier={currentGuardian?.guardianAccount || ''}
        isCountdownNow={isInitStatus}
        isLoginGuardian={currentGuardian?.isLoginAccount}
        accountType={LoginType[currentGuardian?.guardianType as LoginType] as AccountType}
        code={pinVal}
        tipExtra={!isFromLoginOrRegister && 'Please contact your guardians, and enter '}
        onReSend={resendCode}
        onCodeFinish={onFinish}
        onCodeChange={setPinVal}
      />
    </PortkeyStyleProvider>
  ) : (
    <div></div>
  );
}
