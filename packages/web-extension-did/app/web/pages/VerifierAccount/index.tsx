import { useNavigate } from 'react-router';
import { useAppDispatch, useLoginInfo, useGuardiansInfo } from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { OperationTypeEnum, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import useLocationState from 'hooks/useLocationState';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { setRegisterVerifierAction } from 'store/reducers/loginCache/actions';
import { handleVerificationDoc } from '@portkey-wallet/utils/guardian';
import VerifierAccountPrompt from './Prompt';
import VerifierAccountPopup from './Popup';
import './index.less';
import { useOnManagerAddressAndQueryResult } from 'hooks/useOnManagerAddressAndQueryResult';
import { useCommonState } from 'store/Provider/hooks';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import VerifierPage from 'pages/components/VerifierPage';
import { ChainId } from '@portkey-wallet/types';
import singleMessage from 'utils/singleMessage';

export default function VerifierAccount() {
  const { loginAccount } = useLoginInfo();
  const { userGuardianStatus, currentGuardian, opGuardian, userGuardiansList } = useGuardiansInfo();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<
    | 'register'
    | 'login'
    | 'guardians/add'
    | 'guardians/edit'
    | 'guardians/del'
    | 'guardians/loginGuardian'
    | 'removeManage'
    | 'setTransferLimit'
  >();
  const { isNotLessThan768 } = useCommonState();
  const { walletInfo } = useCurrentWallet();
  const { address: managerAddress } = useCurrentWalletInfo();
  const isBigScreenPrompt = useMemo(
    () =>
      isNotLessThan768
        ? state.includes('guardian') || state.includes('removeManage') || state.includes('setTransferLimit')
        : false,
    [isNotLessThan768, state],
  );
  const targetChainId: ChainId | undefined = useMemo(() => {
    if (state && state.indexOf('setTransferLimit') !== -1) {
      const i = state.indexOf('_');
      const params = state.substring(i + 1);
      const _params = JSON.parse(params || '{}');
      return _params.targetChainId;
    }
    return undefined;
  }, [state]);
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult(state);

  const onSuccessInGuardian = useCallback(
    async (res: VerifierInfo) => {
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
    },
    [currentGuardian, dispatch, navigate, state],
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
      navigate('/setting/wallet-security/payment-security/guardian-approval', { state: state });
    },
    [currentGuardian, dispatch, navigate, state],
  );

  const onSuccessInSetTransferLimit = useCallback(
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
          onManagerAddressAndQueryResult({
            pin: result.data.privateKey,
            verifierParams: res,
          });
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
        if (userGuardiansList?.length === 1) {
          const checkRes = await InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS).send();
          if (managerAddress && checkRes.data.privateKey) {
            onManagerAddressAndQueryResult({
              pin: checkRes.data.privateKey,
              verifierParams: res,
              currentGuardian: currentGuardian,
            });
          } else {
            navigate('/login/set-pin/login');
          }
        } else {
          navigate('/login/guardian-approval');
        }
      } else if (state?.indexOf('guardians') !== -1) {
        onSuccessInGuardian(res);
        singleMessage.success('Verified Successful');
      } else if (state?.indexOf('removeManage') !== -1) {
        onSuccessInRemoveOtherManage(res);
      } else if (state?.indexOf('setTransferLimit') !== -1) {
        onSuccessInSetTransferLimit(res);
      } else {
        singleMessage.error('Router state error');
      }
    },
    [
      state,
      dispatch,
      walletInfo.address,
      onManagerAddressAndQueryResult,
      navigate,
      currentGuardian,
      userGuardiansList?.length,
      managerAddress,
      onSuccessInGuardian,
      onSuccessInRemoveOtherManage,
      onSuccessInSetTransferLimit,
    ],
  );

  const handleBack = useCallback(() => {
    if (state === 'register') {
      navigate('/register/start/create');
    } else if (state === 'login') {
      navigate('/login/guardian-approval');
    } else if (state.indexOf('guardians/add') !== -1 && !userGuardianStatus?.[opGuardian?.key || '']?.signature) {
      navigate('/setting/guardians/add', { state: 'back' });
    } else if (
      state.indexOf('guardians/loginGuardian') !== -1 &&
      !userGuardianStatus?.[opGuardian?.key || '']?.signature
    ) {
      const i = state.indexOf('_');
      const _extra = state.substring(i + 1);
      if (_extra === 'edit') {
        navigate('/setting/guardians/edit');
      } else {
        navigate('/setting/guardians/view');
      }
    } else if (state.indexOf('guardians') !== -1) {
      navigate('/setting/guardians/guardian-approval', { state: state });
    } else if (state.indexOf('setTransferLimit') !== -1) {
      navigate(`/setting/wallet-security/payment-security/guardian-approval`, { state: state });
    } else {
      navigate(-1);
    }
  }, [navigate, opGuardian?.key, state, userGuardianStatus]);

  const isInitStatus = useMemo(() => {
    if (state === 'register') return true;
    return !!currentGuardian?.isInitStatus;
  }, [currentGuardian, state]);

  const operationType: OperationTypeEnum = useMemo(() => {
    switch (state) {
      case 'register':
        return OperationTypeEnum.register;
      case 'login':
        return OperationTypeEnum.communityRecovery;
      case 'guardians/edit':
        return OperationTypeEnum.editGuardian;
      case 'guardians/del':
        return OperationTypeEnum.deleteGuardian;
      default:
        if (state && state?.indexOf('removeManage') !== -1) {
          return OperationTypeEnum.removeOtherManager;
        } else if (state && state?.indexOf('setTransferLimit') !== -1) {
          return OperationTypeEnum.modifyTransferLimit;
        } else if (state && state?.indexOf('guardians/add') !== -1) {
          return OperationTypeEnum.addGuardian;
        } else if (state && state?.indexOf('guardians/loginGuardian') !== -1) {
          return opGuardian?.isLoginAccount ? OperationTypeEnum.unsetLoginAccount : OperationTypeEnum.setLoginAccount;
        } else {
          return OperationTypeEnum.unknown;
        }
    }
  }, [opGuardian?.isLoginAccount, state]);

  const renderContent = useMemo(
    () => (
      <div className="common-content1 verifier-account-content">
        <VerifierPage
          loginAccount={loginAccount}
          isInitStatus={isInitStatus}
          currentGuardian={currentGuardian}
          guardianType={loginAccount?.loginType}
          onSuccess={onSuccess}
          operationType={operationType}
          targetChainId={targetChainId}
        />
      </div>
    ),
    [currentGuardian, isInitStatus, loginAccount, onSuccess, operationType, targetChainId],
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
