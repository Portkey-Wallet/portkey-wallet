import { useCallback, useMemo } from 'react';
import AccountCancelationPrompt from './Prompt';
import AccountCancelationPopup from './Popup';
import { useNavigateState } from 'hooks/router';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ACCOUNT_CANCELATION_WARNING } from '@portkey-wallet/constants/constants-ca/wallet';
import singleMessage from 'utils/singleMessage';
import {
  checkIsValidateDeletionAccount,
  deleteLoginAccount,
  getSocialLoginAccountToken,
} from '@portkey-wallet/utils/deleteAccount';
import { handleErrorMessage } from '@portkey-wallet/utils';
import CustomModal from 'pages/components/CustomModal';
import { useCommonState, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import useGuardianList from 'hooks/useGuardianList';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { SOCIAL_GUARDIAN_TYPE } from '@portkey-wallet/constants/constants-ca/contact';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import getSeed from 'utils/getSeed';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import useLogOut from 'hooks/useLogout';
import { FromPageEnum, TVerifyAccountCancelLocationState } from 'types/router';
import CancelBody from '../components/AccountCancelationBody';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { verification } from 'utils/api';
import { useAuthSocialAccountInfo } from 'hooks/authentication';
import './index.less';

export interface IAccountCancelationProps {
  headerTitle?: string;
  renderContent: JSX.Element;
  goBack?: () => void;
}

export default function AccountCancelation() {
  const navigate = useNavigateState<TVerifyAccountCancelLocationState>();
  const { isNotLessThan768 } = useCommonState();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const { setLoading } = useLoading();
  const getGuardianList = useGuardianList();
  const { userGuardiansList } = useGuardiansInfo();
  const uniqueGuardian = useMemo(() => userGuardiansList?.[0], [userGuardiansList]);
  const uniqueGuardianType = useMemo(
    () => LoginType[uniqueGuardian?.guardianType ?? '0'],
    [uniqueGuardian?.guardianType],
  );
  const originChainId = useOriginChainId();
  const originChainInfo = useCurrentChain(originChainId);
  const getAuthSocialAccountInfo = useAuthSocialAccountInfo(uniqueGuardianType as ISocialLogin);
  const logout = useLogOut();
  const showGuardianType = useMemo(
    () =>
      SOCIAL_GUARDIAN_TYPE.includes(uniqueGuardian?.guardianType ?? LoginType.Email)
        ? `${uniqueGuardianType} account`
        : uniqueGuardianType,
    [uniqueGuardian?.guardianType, uniqueGuardianType],
  );

  useEffectOnce(() => {
    getGuardianList({ caHash });
  });

  const handleCheck = useCallback(async () => {
    try {
      if (!caHash || !managerAddress) return false;
      const list = await checkIsValidateDeletionAccount(uniqueGuardianType);
      if (list.length > 0) {
        CustomModal({
          content: (
            <div className="account-cancelation-alert-modal">
              <div className="title">Account Detection</div>
              <div className="content condition-content flex-column">
                {list.map((item, i) => (
                  <div className="condition-item" key={`condition_${i}`}>
                    {item.replace(/LOGIN_ACCOUNT/g, showGuardianType)}
                  </div>
                ))}
              </div>
            </div>
          ),
          onCancel: () => false,
          onOk: () => false,
        });
        return false;
      }
      return true;
    } catch (error) {
      console.log('===check account cancelation error', error);
      singleMessage.error(handleErrorMessage(error));
      return false;
    }
  }, [caHash, managerAddress, showGuardianType, uniqueGuardianType]);

  const handleSendCode = useCallback(async () => {
    try {
      setLoading(true);
      const res = await verification.sendVerificationCode({
        params: {
          guardianIdentifier: uniqueGuardian?.guardianAccount ?? '',
          type: uniqueGuardianType,
          verifierId: uniqueGuardian?.verifier?.id,
          chainId: originChainId,
          operationType: OperationTypeEnum.revokeAccount,
        },
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
    } finally {
      setLoading(false);
    }
  }, [
    navigate,
    originChainId,
    setLoading,
    uniqueGuardian?.guardianAccount,
    uniqueGuardian?.verifier?.id,
    uniqueGuardianType,
  ]);

  const handleSocialAccountCancel = useCallback(async () => {
    try {
      setLoading(true);
      const access_token = await getSocialLoginAccountToken({
        currentLoginAccount: uniqueGuardian?.guardianAccount ?? '',
        getAccountUserInfoFunc: getAuthSocialAccountInfo,
      });
      if (!originChainInfo) throw 'Missing chainInfo, please check';
      const { privateKey } = await getSeed();
      if (!privateKey) throw 'Missing pin, please check';
      const contract = new ExtensionContractBasic({
        privateKey,
        rpcUrl: originChainInfo.endPoint,
        contractAddress: originChainInfo.caContractAddress,
      });
      await deleteLoginAccount({
        removeManagerParams: {
          caContract: contract,
          managerAddress,
          caHash: caHash as string,
        },
        deleteParams: {
          type: uniqueGuardianType,
          chainId: originChainId,
          token: access_token,
          verifierId: uniqueGuardian?.verifier?.id ?? '',
          guardianIdentifier: uniqueGuardian?.guardianAccount,
        },
      });
      logout();
    } catch (error) {
      console.log('===account cancelation error', error);
      singleMessage.error(handleErrorMessage(error ?? 'Account cancelation error'));
    } finally {
      setLoading(false);
    }
  }, [
    caHash,
    getAuthSocialAccountInfo,
    logout,
    managerAddress,
    originChainId,
    originChainInfo,
    setLoading,
    uniqueGuardian?.guardianAccount,
    uniqueGuardian?.verifier?.id,
    uniqueGuardianType,
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
    const checkValid = await handleCheck();
    if (!checkValid) return;
    handleAccountCancel();
  }, [handleAccountCancel, handleCheck]);

  useEffectOnce(() => {
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
      onCancel: () => navigate('/setting/wallet/wallet-name'),
    });
  });

  const props: IAccountCancelationProps = useMemo(
    () => ({
      headerTitle: 'Account Cancelation',
      goBack: () => navigate('/setting/wallet/wallet-name'),
      renderContent: <CancelBody onConfirm={onConfirm} showGuardianType={showGuardianType} />,
    }),
    [navigate, onConfirm, showGuardianType],
  );

  return isNotLessThan768 ? <AccountCancelationPrompt {...props} /> : <AccountCancelationPopup {...props} />;
}
