import { useAppDispatch, useLoginInfo, useGuardiansInfo } from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { OperationTypeEnum, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import { useLocationState, useNavigateState } from 'hooks/router';
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
import {
  TVerifierAccountLocationState,
  FromPageEnum,
  TGuardianApprovalLocationState,
  TAddGuardianLocationState,
} from 'types/router';
import { getOperationDetails } from '@portkey-wallet/utils/operation.util';

const AllowedGuardianPageArr = [
  FromPageEnum.guardiansAdd,
  FromPageEnum.guardiansDel,
  FromPageEnum.guardiansEdit,
  FromPageEnum.guardiansLoginGuardian,
];
export default function VerifierAccount() {
  const { loginAccount } = useLoginInfo();
  const { userGuardianStatus, currentGuardian, opGuardian, userGuardiansList } = useGuardiansInfo();
  const navigate = useNavigateState<TGuardianApprovalLocationState | TAddGuardianLocationState>();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<TVerifierAccountLocationState>();
  const { isNotLessThan768 } = useCommonState();
  const { walletInfo } = useCurrentWallet();
  const { address: managerAddress } = useCurrentWalletInfo();
  const isBigScreenPrompt = useMemo(() => {
    const bigScreenAllowedArr = [
      FromPageEnum.guardiansAdd,
      FromPageEnum.guardiansDel,
      FromPageEnum.guardiansEdit,
      FromPageEnum.guardiansLoginGuardian,
      FromPageEnum.removeManage,
      FromPageEnum.setTransferLimit,
    ];
    return isNotLessThan768 ? (state?.previousPage ? bigScreenAllowedArr.includes(state?.previousPage) : false) : false;
  }, [isNotLessThan768, state]);
  const targetChainId: ChainId | undefined = useMemo(() => state.targetChainId, [state]);
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult(`${state.previousPage}`);

  const onSuccessInGuardian = useCallback(
    async (res: VerifierInfo) => {
      if (!currentGuardian) return;
      const { guardianIdentifier } = handleVerificationDoc(res.verificationDoc ?? '');
      dispatch(
        setUserGuardianItemStatus({
          key: currentGuardian.key,
          status: VerifyStatus.Verified,
          signature: res.signature,
          verificationDoc: res.verificationDoc,
          identifierHash: guardianIdentifier,
        }),
      );
      navigate('/setting/guardians/guardian-approval', { state });
    },
    [currentGuardian, dispatch, navigate, state],
  );

  const onSuccessInRemoveOtherManage = useCallback(
    (res: VerifierInfo) => {
      if (!currentGuardian) return;
      const { guardianIdentifier } = handleVerificationDoc(res.verificationDoc ?? '');
      dispatch(
        setUserGuardianItemStatus({
          key: currentGuardian.key,
          status: VerifyStatus.Verified,
          signature: res.signature,
          verificationDoc: res.verificationDoc,
          identifierHash: guardianIdentifier,
        }),
      );
      navigate('/setting/wallet-security/payment-security/guardian-approval', { state });
    },
    [currentGuardian, dispatch, navigate, state],
  );

  const onSuccessInSetTransferLimit = useCallback(
    (res: VerifierInfo) => {
      if (!currentGuardian) return;
      const { guardianIdentifier } = handleVerificationDoc(res.verificationDoc ?? '');
      dispatch(
        setUserGuardianItemStatus({
          key: currentGuardian.key,
          status: VerifyStatus.Verified,
          signature: res.signature,
          verificationDoc: res.verificationDoc,
          identifierHash: guardianIdentifier,
        }),
      );
      navigate('/setting/wallet-security/manage-devices/guardian-approval', { state });
    },
    [currentGuardian, dispatch, navigate, state],
  );

  const onSuccess = useCallback(
    async (res: VerifierInfo) => {
      const from = state.previousPage;
      if (from === FromPageEnum.register) {
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
      if (from == FromPageEnum.login) {
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
          navigate('/login/guardian-approval', {
            state: {
              operationDetails: getOperationDetails(OperationTypeEnum.communityRecovery, {
                verifyManagerAddress: managerAddress,
              }),
            },
          });
        }
        return;
      }
      if (from && AllowedGuardianPageArr.includes(from)) {
        onSuccessInGuardian(res);
        singleMessage.success('Verified Successful');
        return;
      }
      if (from === FromPageEnum.removeManage) {
        onSuccessInRemoveOtherManage(res);
        return;
      }
      if (from === FromPageEnum.setTransferLimit) {
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
    const fromPage = state.previousPage;
    if (fromPage === FromPageEnum.register) {
      return navigate('/register/start/create');
    }
    if (fromPage === FromPageEnum.login) {
      return navigate('/login/guardian-approval', {
        state: {
          operationDetails: getOperationDetails(OperationTypeEnum.communityRecovery, {
            verifyManagerAddress: managerAddress,
          }),
        },
      });
    }
    if (fromPage === FromPageEnum.guardiansAdd && !userGuardianStatus?.[opGuardian?.key || '']?.signature) {
      return navigate('/setting/guardians/add', {
        state: {
          previousPage: 'back',
        },
      });
    }
    if (fromPage === FromPageEnum.guardiansLoginGuardian && !userGuardianStatus?.[opGuardian?.key || '']?.signature) {
      if (state.extra === 'edit') {
        navigate('/setting/guardians/edit');
      } else {
        navigate('/setting/guardians/view');
      }
      return;
    }
    if (fromPage && AllowedGuardianPageArr.includes(fromPage)) {
      return navigate('/setting/guardians/guardian-approval', { state });
    }
    if (fromPage === FromPageEnum.setTransferLimit) {
      return navigate(`/setting/wallet-security/payment-security/guardian-approval`, { state });
    }
    navigate(-1);
  }, [managerAddress, navigate, opGuardian?.key, state, userGuardianStatus]);

  const isInitStatus = useMemo(() => {
    if (state.previousPage === FromPageEnum.register) return true;
    return !!currentGuardian?.isInitStatus;
  }, [currentGuardian, state]);

  const operationType: OperationTypeEnum = useMemo(() => {
    const fromPage = state.previousPage;
    switch (fromPage) {
      case FromPageEnum.register:
        return OperationTypeEnum.register;
      case FromPageEnum.login:
        return OperationTypeEnum.communityRecovery;
      case FromPageEnum.guardiansEdit:
        return OperationTypeEnum.editGuardian;
      case FromPageEnum.guardiansDel:
        return OperationTypeEnum.deleteGuardian;
      case FromPageEnum.guardiansAdd:
        return OperationTypeEnum.addGuardian;
      case FromPageEnum.guardiansLoginGuardian:
        return opGuardian?.isLoginAccount ? OperationTypeEnum.unsetLoginAccount : OperationTypeEnum.setLoginAccount;
      case FromPageEnum.removeManage:
        return OperationTypeEnum.removeOtherManager;
      case FromPageEnum.setTransferLimit:
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
          operationDetails={state.operationDetails}
        />
      </div>
    ),
    [currentGuardian, isInitStatus, loginAccount, onSuccess, operationType, targetChainId, state],
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
