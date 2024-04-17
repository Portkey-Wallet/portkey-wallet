import { useCallback, useMemo } from 'react';
import AccountCancelationPrompt from './Prompt';
import AccountCancelationPopup from './Popup';
import { useNavigateState } from 'hooks/router';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ACCOUNT_CANCELATION_WARNING } from '@portkey-wallet/constants/constants-ca/wallet';
import singleMessage from 'utils/singleMessage';
import {
  checkIsValidateDeletionAccount,
  sendRevokeVerifyCodeAsync,
  deleteLoginAccount,
} from '@portkey-wallet/utils/deleteAccount';
import { handleErrorMessage } from '@portkey-wallet/utils';
import CustomModal from 'pages/components/CustomModal';
import { useCommonState, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import useGuardianList from 'hooks/useGuardianList';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { SOCIAL_GUARDIAN_TYPE } from '@portkey-wallet/constants/constants-ca/contact';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import getSeed from 'utils/getSeed';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import useLogOut from 'hooks/useLogout';
import { FromPageEnum, TVerifyAccountCancelLocationState } from 'types/router';
import CancelBody from '../components/AccountCancelationBody';
import './index.less';

export interface IAccountCancelationProps {
  headerTitle?: string;
  renderContent: JSX.Element;
  goBack?: () => void;
}

export default function AccountCancelation() {
  const navigate = useNavigateState<TVerifyAccountCancelLocationState>();
  const { isNotLessThan768 } = useCommonState();
  const { caHash, address: managerAddress, managerInfo } = useCurrentWalletInfo();
  const { setLoading } = useLoading();
  const getGuardianList = useGuardianList();
  const { userGuardiansList } = useGuardiansInfo();
  const uniqueGuardian = useMemo(() => userGuardiansList?.[0], [userGuardiansList]);
  const currentNetwork = useCurrentNetwork();
  const originChainId = useOriginChainId();
  const originChainInfo = useCurrentChain(originChainId);
  const logout = useLogOut();

  useEffectOnce(() => {
    getGuardianList({ caHash });
  });

  const handleCheck = useCallback(async () => {
    try {
      if (!caHash || !managerAddress) return false;
      const list = await checkIsValidateDeletionAccount();
      if (list.length > 0) {
        const showList = list.length > 1 ? list.map((item, index) => `${index + 1}. ${item}`) : list;
        CustomModal({
          content: (
            <div className="account-cancelation-alert-modal">
              <div className="title">Account Detection</div>
              <div className="content condition-content flex-column">
                {showList.map((item, i) => (
                  <div className="condition-item" key={`condition_${i}`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ),
          onCancel: () => false,
          onOk: () => false,
        });
      }
      return true;
    } catch (error) {
      console.log('===check account cancelation error', error);
      singleMessage.error(handleErrorMessage(error));
      return false;
    }
  }, [caHash, managerAddress]);

  const handleSendCode = useCallback(async () => {
    try {
      const _type = LoginType[uniqueGuardian?.guardianType as LoginType];

      const res = await sendRevokeVerifyCodeAsync({
        guardianIdentifier: uniqueGuardian?.guardianAccount ?? '',
        chainId: originChainId,
        type: _type as keyof typeof LoginType,
      });
      if (res.verifierSessionId) {
        navigate('/setting/wallet/account-cancelation-code', {
          state: {
            previousPage: FromPageEnum.accountCancelation,
            verifierSessionId: res.verifierSessionId,
          },
        });
      }
    } catch (error) {
      console.log('===deletion account send code error', error);
      singleMessage.error(handleErrorMessage(error));
    }
  }, [navigate, originChainId, uniqueGuardian?.guardianAccount, uniqueGuardian?.guardianType]);

  const handleSocialAccountCancel = useCallback(async () => {
    try {
      setLoading(true);
      const _type = LoginType[uniqueGuardian?.guardianType as LoginType];
      const result = await socialLoginAction(_type as ISocialLogin, currentNetwork);
      const access_token = result?.data?.access_token;
      if (!access_token) throw 'Auth Error';
      if (access_token !== managerInfo?.loginAccount) {
        throw 'Account does not match';
      }
      if (!originChainInfo) throw 'Missing chainInfo, please check';
      const { privateKey } = await getSeed();
      if (!privateKey) throw 'Missing pin, please check';
      const contract = new ExtensionContractBasic({
        privateKey,
        rpcUrl: originChainInfo.endPoint,
        contractAddress: originChainInfo.defaultToken.address,
      });
      await deleteLoginAccount({
        removeManagerParams: {
          caContract: contract,
          managerAddress,
          caHash: caHash as string,
        },
        deleteParams: {
          type: _type as keyof typeof LoginType,
          chainId: originChainId,
          token: access_token,
        },
      });
      logout();
    } catch (error) {
      setLoading(false);
      console.log('===account cancelation error', error);
      singleMessage.error(handleErrorMessage(error));
    }
  }, [
    caHash,
    currentNetwork,
    logout,
    managerAddress,
    managerInfo?.loginAccount,
    originChainId,
    originChainInfo,
    setLoading,
    uniqueGuardian?.guardianType,
  ]);

  const handleAccountCancel = useCallback(() => {
    if (SOCIAL_GUARDIAN_TYPE.includes(uniqueGuardian?.guardianType as LoginType)) {
      // social guardian
      handleSocialAccountCancel();
    } else {
      // email guardian
      CustomModal({
        type: 'confirm',
        content: (
          <p>
            {`${uniqueGuardian?.verifier?.name} will send a verification code to `}
            <strong>{uniqueGuardian?.guardianAccount}</strong>
            {` to verify your email address`}
          </p>
        ),
        onOk: handleSendCode,
        okText: 'Confirm',
      });
    }
  }, [
    handleSendCode,
    handleSocialAccountCancel,
    uniqueGuardian?.guardianAccount,
    uniqueGuardian?.guardianType,
    uniqueGuardian?.verifier?.name,
  ]);

  const onConfirm = useCallback(async () => {
    // 1. check
    const checkValid = await handleCheck();
    if (!checkValid) return;

    // 2. warn tip
    CustomModal({
      type: 'confirm',
      content: (
        <div>
          <div className="title">Warning</div>
          <div className="content">{ACCOUNT_CANCELATION_WARNING}</div>
        </div>
      ),
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleAccountCancel,
    });
  }, [handleAccountCancel, handleCheck]);

  const props: IAccountCancelationProps = useMemo(
    () => ({
      headerTitle: 'Account Cancelation',
      goBack: () => navigate('/setting/wallet/wallet-name'),
      renderContent: <CancelBody onConfirm={onConfirm} />,
    }),
    [navigate, onConfirm],
  );

  return isNotLessThan768 ? <AccountCancelationPrompt {...props} /> : <AccountCancelationPopup {...props} />;
}
