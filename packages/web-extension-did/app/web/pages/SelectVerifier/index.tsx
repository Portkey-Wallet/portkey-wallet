import { setCurrentGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { message } from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useGuardiansInfo, useLoginInfo } from 'store/Provider/hooks';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { setRegisterVerifierAction } from 'store/reducers/loginCache/actions';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { VerifierSelect } from '@portkey/did-ui-react';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import './index.less';

interface ConfirmResultInfo {
  verifier: VerifierItem;
  verifierSessionId?: string;
  verificationDoc?: string;
  signature?: string;
}

export default function SelectVerifier() {
  const { loginAccount } = useLoginInfo();
  const { verifierMap } = useGuardiansInfo();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();

  const onConfirm = useCallback(
    async (result: ConfirmResultInfo) => {
      console.log(result, 'result==onConfirm');
      if (!loginAccount)
        return message.error('User registration information is invalid, please fill in the registration method again');
      if (result.verifierSessionId) {
        const _key = `${loginAccount.guardianAccount}&${result.verifier.name}`;
        dispatch(
          setCurrentGuardianAction({
            isLoginAccount: true,
            verifier: result.verifier,
            guardianAccount: loginAccount.guardianAccount,
            guardianType: loginAccount.loginType,
            verifierInfo: {
              sessionId: result.verifierSessionId,
            },
            key: _key,
            identifierHash: '',
            salt: '',
          }),
        );
        navigate('/register/verifier-account', { state: 'register' });
      } else if (result.verificationDoc && result.signature) {
        dispatch(
          setRegisterVerifierAction({
            verifierId: result.verifier.id,
            verificationDoc: result.verificationDoc,
            signature: result.signature,
          }),
        );
        navigate('/login/set-pin/register');
      } else {
        message.error('Verification failed, please try again later');
      }
    },
    [dispatch, loginAccount, navigate],
  );

  const authorized = useMemo(
    () => loginAccount?.authenticationInfo?.[loginAccount?.guardianAccount || ''],
    [loginAccount?.authenticationInfo, loginAccount?.guardianAccount],
  );

  const verifierList = useMemo(() => Object.values(verifierMap ?? {}), [verifierMap]);

  return (
    <div className="common-page ">
      <PortKeyTitle leftElement leftCallBack={() => navigate('/register/start')} />

      <VerifierSelect
        className="select-verifier-wrapper"
        chainId={originChainId}
        verifierList={verifierList}
        sandboxId={'portkey-ui-sandbox'}
        isErrorTip
        guardianIdentifier={loginAccount?.guardianAccount || ''}
        accountType={LoginType[loginAccount?.loginType as LoginType] as any}
        appleIdToken={authorized}
        googleAccessToken={authorized}
        onConfirm={onConfirm}
        onError={(err) => {
          console.log(err, 'VerifierSelect===');
        }}
      />
    </div>
  );
}
