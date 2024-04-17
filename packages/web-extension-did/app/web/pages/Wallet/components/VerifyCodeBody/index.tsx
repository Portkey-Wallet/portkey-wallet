import { CodeVerifyUI, PortkeyStyleProvider } from '@portkey/did-ui-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useCommonState, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { sendRevokeVerifyCodeAsync } from '@portkey-wallet/utils/deleteAccount';
import { AccountType } from '@portkey/services';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { ICodeFinishParams } from 'pages/Wallet/VerifyAccountCancelation';
import { useLocationState } from 'hooks/router';
import { TVerifyAccountCancelLocationState } from 'types/router';

const MAX_TIMER = 60;
interface ICodeVerifyUIInterface {
  setTimer: (timer: number) => void;
}

export interface IVerifyCodeBody {
  onCodeFinish: (params: ICodeFinishParams) => any;
}
export default function VerifyCodeBody({ onCodeFinish }: IVerifyCodeBody) {
  const { state } = useLocationState<TVerifyAccountCancelLocationState>();
  const [code, setCode] = useState<string>();
  const [sessionId, setSessionId] = useState<string>(state?.verifierSessionId || '');
  const uiRef = useRef<ICodeVerifyUIInterface>();
  const { isNotLessThan768 } = useCommonState();
  const { managerInfo } = useCurrentWalletInfo();
  const { userGuardiansList } = useGuardiansInfo();
  const { setLoading } = useLoading();
  const originChainId = useOriginChainId();
  const uniqueGuardian = useMemo(
    () => userGuardiansList?.find((item) => item.guardianAccount === managerInfo?.loginAccount),
    [managerInfo?.loginAccount, userGuardiansList],
  );

  const onReSend = useCallback(async () => {
    try {
      setLoading(true);
      const _type = LoginType[uniqueGuardian?.guardianType as LoginType];
      const res = await sendRevokeVerifyCodeAsync({
        guardianIdentifier: uniqueGuardian?.guardianAccount ?? '',
        chainId: originChainId,
        type: _type as keyof typeof LoginType,
      });
      setLoading(false);
      if (res.verifierSessionId) {
        setSessionId(res.verifierSessionId);
        uiRef.current?.setTimer(MAX_TIMER);
      }
    } catch (error) {
      console.log('===onReSend deletionSendCode error', error);
      setLoading(false);
      singleMessage.error(handleErrorMessage(error));
    }
  }, [setLoading, uniqueGuardian?.guardianType, uniqueGuardian?.guardianAccount, originChainId]);

  const handleCodeFinish = useCallback(
    (code: string) => {
      onCodeFinish({ code, verifierSessionId: sessionId });
    },
    [onCodeFinish, sessionId],
  );

  return (
    <div className="account-cancel-code-body">
      <PortkeyStyleProvider>
        <CodeVerifyUI
          ref={uiRef}
          className={isNotLessThan768 ? '' : 'popup-page'}
          verifier={uniqueGuardian?.verifier as any}
          guardianIdentifier={managerInfo?.loginAccount ?? ''}
          // isCountdownNow={isInitStatus}
          isLoginGuardian={uniqueGuardian?.isLoginAccount}
          accountType={LoginType[uniqueGuardian?.guardianType as LoginType] as AccountType}
          code={code}
          // tipExtra={!isFromLoginOrRegister && 'Please contact your guardians, and enter '}
          onReSend={onReSend}
          onCodeFinish={handleCodeFinish}
          onCodeChange={setCode}
        />
      </PortkeyStyleProvider>
    </div>
  );
}
