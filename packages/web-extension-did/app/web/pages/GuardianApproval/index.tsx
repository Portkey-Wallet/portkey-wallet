import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoginInfo, useGuardiansInfo, useCommonState, useAppDispatch, useLoading } from 'store/Provider/hooks';
import { VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import { useNavigate, useLocation } from 'react-router';
import { useRecovery } from './hooks/useRecovery';
import { useRemoveOtherManage } from './hooks/useRemoveOtherManage';
import GuardianApprovalPrompt from './Prompt';
import GuardianApprovalPopup from './Popup';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useOnManagerAddressAndQueryResult } from 'hooks/useOnManagerAddressAndQueryResult';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import qs from 'query-string';
import {
  GuardianList,
  OnErrorFunc,
  UserGuardianStatus,
  handleErrorMessage,
  handleVerificationDoc,
} from '@portkey/did-ui-react';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import type { AccountType } from '@portkey/services';
import './index.less';
import { setCurrentGuardianAction, setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { useVerifyToken } from 'hooks/authentication';
import clsx from 'clsx';

export default function GuardianApproval() {
  const { userGuardianStatus, guardianExpiredTime, opGuardian, preGuardian } = useGuardiansInfo();
  const { address: managerAddress } = useCurrentWalletInfo();
  const { loginAccount } = useLoginInfo();
  const navigate = useNavigate();
  const { state, search } = useLocation();
  const originChainId = useOriginChainId();
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (search) {
      const { detail } = qs.parse(search);
      setQuery(detail);
    } else {
      setQuery(state);
    }
  }, [query, search, state]);
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const isBigScreenPrompt: boolean = useMemo(() => {
    const isNotFromLoginAndRegister = !!(query && (query.includes('guardian') || query.includes('removeManage')));
    return isNotLessThan768 ? isNotFromLoginAndRegister : false;
  }, [isNotLessThan768, query]);
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult(query);

  const userVerifiedList = useMemo(() => {
    const tempVerifiedList: UserGuardianStatus[] = Object.values(userGuardianStatus ?? {}).map((guardian) => ({
      ...guardian,
      identifier: guardian.guardianAccount ?? '',
      guardianType: LoginType[guardian.guardianType] as AccountType,
    }));
    let filterVerifiedList = tempVerifiedList;
    if (query === 'guardians/edit') {
      filterVerifiedList = tempVerifiedList.filter((item) => item.key !== preGuardian?.key);
    } else if (['guardians/del', 'guardians/add'].includes(query)) {
      filterVerifiedList = tempVerifiedList.filter((item) => item.key !== opGuardian?.key);
    }
    return filterVerifiedList;
  }, [opGuardian?.key, preGuardian?.key, query, userGuardianStatus]);

  const { setLoading } = useLoading();

  const handleGuardianRecovery = useRecovery();

  const handleRemoveOtherManage = useRemoveOtherManage();

  const recoveryWallet = useCallback(async () => {
    if (query && query.indexOf('guardians') !== -1) {
      handleGuardianRecovery();
    } else if (query && query.indexOf('removeManage') !== -1) {
      handleRemoveOtherManage();
    } else {
      const res = await InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS).send();
      if (managerAddress && res.data.privateKey) {
        onManagerAddressAndQueryResult(res.data.privateKey);
      } else {
        navigate('/login/set-pin/login');
      }
    }
  }, [
    handleGuardianRecovery,
    handleRemoveOtherManage,
    managerAddress,
    navigate,
    onManagerAddressAndQueryResult,
    query,
  ]);

  const handleBack = useCallback(() => {
    if (query && query.indexOf('guardians') !== -1) {
      if (['guardians/del', 'guardians/edit'].includes(query)) {
        navigate(`/setting/guardians/edit`);
      } else if ('guardians/add' === query) {
        navigate('/setting/guardians/add', { state: 'back' });
      }
    } else if (query && query.indexOf('removeManage') !== -1) {
      const manageAddress = query.split('_')[1];
      navigate(`/setting/wallet-security/manage-devices/${manageAddress}`);
    } else {
      navigate('/register/start');
    }
  }, [navigate, query]);

  const dispatch = useAppDispatch();

  const onSendCodeHandler = useCallback(
    (result: UserGuardianStatus) => {
      const currentGuardian: UserGuardianItem = {
        ...result,
        guardianAccount: result.identifier as string,
        isInitStatus: true,
        guardianType: LoginType[result.guardianType],
        identifierHash: result.identifierHash ?? '',
        salt: result.salt ?? '',
      };
      dispatch(setCurrentGuardianAction(currentGuardian));
      dispatch(
        setUserGuardianItemStatus({
          key: result.key,
          status: VerifyStatus.Verifying,
        }),
      );
      if (query?.includes('guardians')) {
        navigate('/setting/guardians/verifier-account', { state: query });
      } else if (query && query.indexOf('removeManage') !== -1) {
        navigate('/setting/wallet-security/manage-devices/verifier-account', { state: query });
      } else {
        navigate('/login/verifier-account', { state: 'login' });
      }
    },
    [dispatch, navigate, query],
  );

  const verifyToken = useVerifyToken();

  const socialVerifyHandler = useCallback(
    async (item: UserGuardianStatus) => {
      try {
        setLoading(true);
        const result = await verifyToken(LoginType[item.guardianType], {
          accessToken: loginAccount?.authenticationInfo?.[item.identifier as string],
          id: item.identifier || '',
          verifierId: item.verifier?.id,
          chainId: originChainId,
        });
        const verifierInfo: VerifierInfo = { ...result, verifierId: item?.verifier?.id };
        const { guardianIdentifier } = handleVerificationDoc(verifierInfo.verificationDoc);
        dispatch(
          setUserGuardianItemStatus({
            key: item.key,
            signature: verifierInfo.signature,
            verificationDoc: verifierInfo.verificationDoc,
            status: VerifyStatus.Verified,
            identifierHash: guardianIdentifier,
          }),
        );
      } catch (error) {
        const msg = handleErrorMessage(error);
        message.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, loginAccount, originChainId, setLoading, verifyToken],
  );

  const onVerifyingHandler = useCallback(
    async (item: UserGuardianStatus) => {
      const isSocialLogin = item.guardianType === 'Google' || item.guardianType === 'Apple';

      if (isSocialLogin) return socialVerifyHandler(item);
      dispatch(
        setCurrentGuardianAction({
          ...item,
          guardianAccount: item.identifier || '',
          guardianType: LoginType[item.guardianType],
          isInitStatus: false,
          identifierHash: item.identifierHash || '',
          salt: item.salt || '',
        }),
      );
      if (query?.includes('guardians')) {
        navigate('/setting/guardians/verifier-account', { state: query });
      } else if (query?.includes('removeManage')) {
        navigate('/setting/wallet-security/manage-devices/verifier-account', { state: query });
      } else {
        navigate('/login/verifier-account', { state: 'login' });
      }
    },
    [dispatch, navigate, query, socialVerifyHandler],
  );

  const onGuardianListError: OnErrorFunc = useCallback((error) => {
    console.log('onGuardianListError:', error);
  }, []);

  const renderContent = useMemo(
    () => (
      <GuardianList
        chainId={originChainId}
        expiredTime={guardianExpiredTime}
        guardianList={userVerifiedList}
        isErrorTip
        className={clsx(isPrompt && 'guardian-list-prompt')}
        onSend={onSendCodeHandler}
        onVerifying={onVerifyingHandler}
        onConfirm={recoveryWallet}
        onError={onGuardianListError}
      />
    ),
    [
      guardianExpiredTime,
      isPrompt,
      onGuardianListError,
      onSendCodeHandler,
      onVerifyingHandler,
      originChainId,
      recoveryWallet,
      userVerifiedList,
    ],
  );

  const props = useMemo(
    () => ({
      onBack: handleBack,
      renderContent,
    }),
    [handleBack, renderContent],
  );

  return isNotLessThan768 ? (
    <GuardianApprovalPrompt {...props} isBigScreenPrompt={isBigScreenPrompt} />
  ) : (
    <GuardianApprovalPopup {...props} />
  );
}
