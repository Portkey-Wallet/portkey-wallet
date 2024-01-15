import { useNavigate } from 'react-router';
import { useAppDispatch, useLoginInfo, useGuardiansInfo } from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { OperationTypeEnum, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
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
import { useLocationState } from 'hooks/router';
import { TVerifierAccountLocationState, VerifierAccountFromPageEnum } from 'types/router';

const AllowedGuardianPageArr = [
  VerifierAccountFromPageEnum.guardiansAdd,
  VerifierAccountFromPageEnum.guardiansDel,
  VerifierAccountFromPageEnum.guardiansEdit,
  VerifierAccountFromPageEnum.guardiansLoginGuardian,
];
export default function VerifierAccount() {
  const { loginAccount } = useLoginInfo();
  const { userGuardianStatus, currentGuardian, opGuardian, userGuardiansList } = useGuardiansInfo();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<TVerifierAccountLocationState>();
  const { isNotLessThan768 } = useCommonState();
  const { walletInfo } = useCurrentWallet();
  const { address: managerAddress } = useCurrentWalletInfo();
  const isBigScreenPrompt = useMemo(() => {
    const bigScreenAllowedArr = [
      VerifierAccountFromPageEnum.guardiansAdd,
      VerifierAccountFromPageEnum.guardiansDel,
      VerifierAccountFromPageEnum.guardiansEdit,
      VerifierAccountFromPageEnum.guardiansLoginGuardian,
      VerifierAccountFromPageEnum.removeManage,
      VerifierAccountFromPageEnum.setTransferLimit,
    ];
    return isNotLessThan768 ? bigScreenAllowedArr.includes(state.from) : false;
  }, [isNotLessThan768, state]);
  const targetChainId: ChainId | undefined = useMemo(() => state.targetChainId, [state]);
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult(`${state.from}`);

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
      const from = state.from;
      if (from === VerifierAccountFromPageEnum.register) {
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
        return;
      }
      if (from == VerifierAccountFromPageEnum.login) {
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
        return;
      }
      if (AllowedGuardianPageArr.includes(from)) {
        onSuccessInGuardian(res);
        singleMessage.success('Verified Successful');
        return;
      }
      if (from === VerifierAccountFromPageEnum.removeManage) {
        onSuccessInRemoveOtherManage(res);
        return;
      }
      if (from === VerifierAccountFromPageEnum.setTransferLimit) {
        onSuccessInSetTransferLimit(res);
        return;
      }
      singleMessage.error('Router state error');
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
    const fromPage = state.from;
    if (fromPage === VerifierAccountFromPageEnum.register) {
      return navigate('/register/start/create');
    }
    if (fromPage === VerifierAccountFromPageEnum.login) {
      return navigate('/login/guardian-approval');
    }
    if (
      fromPage === VerifierAccountFromPageEnum.guardiansAdd &&
      !userGuardianStatus?.[opGuardian?.key || '']?.signature
    ) {
      return navigate('/setting/guardians/add', { state: 'back' });
    }
    if (
      fromPage === VerifierAccountFromPageEnum.guardiansLoginGuardian &&
      !userGuardianStatus?.[opGuardian?.key || '']?.signature
    ) {
      if (state.extra === 'edit') {
        navigate('/setting/guardians/edit');
      } else {
        navigate('/setting/guardians/view');
      }
      return;
    }
    if (AllowedGuardianPageArr.includes(fromPage)) {
      return navigate('/setting/guardians/guardian-approval', { state: state });
    }
    if (fromPage === VerifierAccountFromPageEnum.setTransferLimit) {
      return navigate(`/setting/wallet-security/payment-security/guardian-approval`, { state: state });
    }
    navigate(-1);
  }, [navigate, opGuardian?.key, state, userGuardianStatus]);

  const isInitStatus = useMemo(() => {
    if (state.from === VerifierAccountFromPageEnum.register) return true;
    return !!currentGuardian?.isInitStatus;
  }, [currentGuardian, state]);

  const operationType: OperationTypeEnum = useMemo(() => {
    const fromPage = state.from;
    switch (fromPage) {
      case VerifierAccountFromPageEnum.register:
        return OperationTypeEnum.register;
      case VerifierAccountFromPageEnum.login:
        return OperationTypeEnum.communityRecovery;
      case VerifierAccountFromPageEnum.guardiansEdit:
        return OperationTypeEnum.editGuardian;
      case VerifierAccountFromPageEnum.guardiansDel:
        return OperationTypeEnum.deleteGuardian;
      case VerifierAccountFromPageEnum.guardiansAdd:
        return OperationTypeEnum.addGuardian;
      case VerifierAccountFromPageEnum.guardiansLoginGuardian:
        return opGuardian?.isLoginAccount ? OperationTypeEnum.unsetLoginAccount : OperationTypeEnum.setLoginAccount;
      case VerifierAccountFromPageEnum.removeManage:
        return OperationTypeEnum.removeOtherManager;
      case VerifierAccountFromPageEnum.setTransferLimit:
        return OperationTypeEnum.modifyTransferLimit;
      default:
        return OperationTypeEnum.unknown;
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
