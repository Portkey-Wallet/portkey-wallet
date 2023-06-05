import { useNavigate } from 'react-router';
import VerifierPage from 'pages/components/VerifierPage';
import { useAppDispatch, useLoginInfo, useGuardiansInfo, useUserInfo, useLoading } from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { message } from 'antd';
import { setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { RecaptchaType, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import useLocationState from 'hooks/useLocationState';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import { GuardianMth } from 'types/guardians';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { setRegisterVerifierAction } from 'store/reducers/loginCache/actions';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import aes from '@portkey-wallet/utils/aes';
import { handleVerificationDoc } from '@portkey-wallet/utils/guardian';
import useGuardianList from 'hooks/useGuardianList';
import VerifierAccountPrompt from './Prompt';
import VerifierAccountPopup from './Popup';
import './index.less';
import { useOnManagerAddressAndQueryResult } from 'hooks/useOnManagerAddressAndQueryResult';
import { useCommonState } from 'store/Provider/hooks';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';

export default function VerifierAccount() {
  const { loginAccount } = useLoginInfo();
  const { userGuardianStatus, currentGuardian, opGuardian } = useGuardiansInfo();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<
    'register' | 'login' | 'guardians/add' | 'guardians/edit' | 'guardians/del' | 'guardians/setLoginAccount'
  >();
  const { isNotLessThan768 } = useCommonState();
  const { walletInfo } = useCurrentWallet();
  const currentNetwork = useCurrentNetworkInfo();
  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const { setLoading } = useLoading();
  const { passwordSeed } = useUserInfo();
  const getGuardianList = useGuardianList();
  const isBigScreenPrompt = useMemo(
    () => (isNotLessThan768 ? state.includes('guardian') || state.includes('removeManage') : false),
    [isNotLessThan768, state],
  );
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult('register');

  const onSuccessInGuardian = useCallback(
    async (res: VerifierInfo) => {
      if (state === 'guardians/setLoginAccount') {
        try {
          setLoading(true);
          const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
          if (!currentChain?.endPoint || !privateKey) return message.error('set login account error');
          const result = await handleGuardian({
            rpcUrl: currentChain.endPoint,
            chainType: currentNetwork.walletType,
            address: currentChain.caContractAddress,
            privateKey,
            paramsOption: {
              method: GuardianMth.SetGuardianTypeForLogin,
              params: {
                caHash: walletInfo?.caHash,
                guardian: {
                  type: currentGuardian?.guardianType,
                  verifierId: currentGuardian?.verifier?.id,
                  identifierHash: currentGuardian?.identifierHash,
                },
              },
            },
          });
          console.log('setLoginAccount', result);
          getGuardianList({ caHash: walletInfo.caHash });
          setLoading(false);
          navigate('/setting/guardians/view');
        } catch (error: any) {
          setLoading(false);
          message.error(contractErrorHandler(error));
          console.log('---set login account error', error);
        }
      } else {
        if (!currentGuardian) return;
        const { guardianIdentifier } = handleVerificationDoc(res.verificationDoc);
        dispatch(
          setUserGuardianItemStatus({
            key: currentGuardian.key,
            status: VerifyStatus.Verified,
            signature: res.signature,
            verificationDoc: res.verificationDoc,
            identifierHash: guardianIdentifier,
          }),
        );
        navigate('/setting/guardians/guardian-approval', { state: state });
      }
    },
    [
      currentChain,
      currentGuardian,
      currentNetwork.walletType,
      dispatch,
      getGuardianList,
      navigate,
      passwordSeed,
      setLoading,
      state,
      walletInfo,
    ],
  );

  const onSuccessInRemoveOtherManage = useCallback(
    (res: VerifierInfo) => {
      if (!currentGuardian) return;
      const { guardianIdentifier } = handleVerificationDoc(res.verificationDoc);
      dispatch(
        setUserGuardianItemStatus({
          key: currentGuardian.key,
          status: VerifyStatus.Verified,
          signature: res.signature,
          verificationDoc: res.verificationDoc,
          identifierHash: guardianIdentifier,
        }),
      );
      navigate('/setting/wallet-security/manage-devices/guardian-approval', { state: state });
    },
    [currentGuardian, dispatch, navigate, state],
  );

  const onSuccess = useCallback(
    async (res: VerifierInfo) => {
      if (state === 'register') {
        dispatch(setRegisterVerifierAction(res));
        const result = await InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS).send();
        if (walletInfo.address && result.data.privateKey) {
          onManagerAddressAndQueryResult(result.data.privateKey, res);
        } else {
          navigate('/login/set-pin/register');
        }
      } else if (state == 'login') {
        if (!currentGuardian) return;
        dispatch(
          setUserGuardianItemStatus({
            key: currentGuardian.key,
            status: VerifyStatus.Verified,
            signature: res.signature,
            verificationDoc: res.verificationDoc,
          }),
        );
        navigate('/login/guardian-approval');
      } else if (state?.indexOf('guardians') !== -1) {
        onSuccessInGuardian(res);
        message.success('Verified Successful');
      } else if (state?.indexOf('removeManage') !== -1) {
        onSuccessInRemoveOtherManage(res);
      } else {
        message.error('Router state error');
      }
    },
    [
      state,
      dispatch,
      walletInfo.address,
      onManagerAddressAndQueryResult,
      navigate,
      currentGuardian,
      onSuccessInGuardian,
      onSuccessInRemoveOtherManage,
    ],
  );

  const handleBack = useCallback(() => {
    if (state === 'register') {
      navigate('/register/select-verifier');
    } else if (state === 'login') {
      navigate('/login/guardian-approval');
    } else if (state === 'guardians/add' && !userGuardianStatus?.[opGuardian?.key || '']?.signature) {
      navigate('/setting/guardians/add', { state: 'back' });
    } else if (state === 'guardians/setLoginAccount') {
      navigate('/setting/guardians/view');
    } else if (state.indexOf('guardians') !== -1) {
      navigate('/setting/guardians/guardian-approval', { state: state });
    } else {
      navigate(-1);
    }
  }, [navigate, opGuardian?.key, state, userGuardianStatus]);

  const isInitStatus = useMemo(() => {
    if (state === 'register') return true;
    return !!currentGuardian?.isInitStatus;
  }, [currentGuardian, state]);

  const recaptchaType = useMemo(() => {
    if (state === 'register') {
      return RecaptchaType.register;
    } else if (state === 'login') {
      return RecaptchaType.communityRecovery;
    }
    return RecaptchaType.optGuardian;
  }, [state]);

  const renderContent = useMemo(
    () => (
      <div className="common-content1 verifier-account-content">
        <VerifierPage
          loginAccount={loginAccount}
          isInitStatus={isInitStatus}
          currentGuardian={currentGuardian}
          guardianType={loginAccount?.loginType}
          onSuccess={onSuccess}
          recaptchaType={recaptchaType}
        />
      </div>
    ),
    [currentGuardian, isInitStatus, loginAccount, onSuccess, recaptchaType],
  );

  const props = useMemo(
    () => ({
      onBack: handleBack,
      renderContent,
    }),
    [handleBack, renderContent],
  );

  return isNotLessThan768 ? (
    <VerifierAccountPrompt {...props} isBigScreenPrompt={isBigScreenPrompt} />
  ) : (
    <VerifierAccountPopup {...props} />
  );
}
