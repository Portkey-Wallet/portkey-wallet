import { Button } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoginInfo, useGuardiansInfo, useCommonState } from 'store/Provider/hooks';
import { VerifyStatus } from '@portkey-wallet/types/verifier';
import { useNavigate, useLocation } from 'react-router';
import { UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { getApprovalCount } from '@portkey-wallet/utils/guardian';
import clsx from 'clsx';
import CommonTooltip from 'components/CommonTooltip';
import { useTranslation } from 'react-i18next';
import GuardianItems from './components/GuardianItems';
import { useRecovery } from './hooks/useRecovery';
import { useRemoveOtherManage } from './hooks/useRemoveOtherManage';
import GuardianApprovalPrompt from './Prompt';
import GuardianApprovalPopup from './Popup';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useOnManagerAddressAndQueryResult } from 'hooks/useOnManagerAddressAndQueryResult';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import qs from 'query-string';
import './index.less';
import { useSetTransferLimit } from './hooks/useSetTransferLimit';
import { ChainId } from '@portkey-wallet/types';

export default function GuardianApproval() {
  const { userGuardianStatus, guardianExpiredTime, opGuardian, preGuardian } = useGuardiansInfo();
  const { address: managerAddress } = useCurrentWalletInfo();
  const { loginAccount } = useLoginInfo();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const navigate = useNavigate();
  const { state, search } = useLocation();
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
  const { t } = useTranslation();
  const isBigScreenPrompt: boolean = useMemo(() => {
    const isNotFromLoginAndRegister = !!(
      query &&
      (query.includes('guardian') || query.includes('removeManage') || query.includes('setTransferLimit'))
    );
    return isNotLessThan768 ? isNotFromLoginAndRegister : false;
  }, [isNotLessThan768, query]);
  const targetChainId: ChainId | undefined = useMemo(() => {
    if (query && query.indexOf('setTransferLimit') !== -1) {
      const state = query.split('_')[1];
      const _params = JSON.parse(state || '{}');
      return _params.targetChainId;
    }
    return undefined;
  }, [query]);
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult(query);

  const userVerifiedList = useMemo(() => {
    const tempVerifiedList = Object.values(userGuardianStatus ?? {});
    let filterVerifiedList: UserGuardianStatus[] = tempVerifiedList;
    if (query === 'guardians/edit') {
      filterVerifiedList = tempVerifiedList.filter((item) => item.key !== preGuardian?.key);
    } else if (['guardians/del', 'guardians/add'].includes(query)) {
      filterVerifiedList = tempVerifiedList.filter((item) => item.key !== opGuardian?.key);
    }
    return filterVerifiedList;
  }, [opGuardian?.key, preGuardian?.key, query, userGuardianStatus]);

  const approvalLength = useMemo(() => {
    return getApprovalCount(userVerifiedList.length);
  }, [userVerifiedList.length]);

  const alreadyApprovalLength = useMemo(
    () => userVerifiedList.filter((item) => item?.status === VerifyStatus.Verified).length,
    [userVerifiedList],
  );

  const handleGuardianRecovery = useRecovery();

  const handleRemoveOtherManage = useRemoveOtherManage();
  const handleSetTransferLimit = useSetTransferLimit();

  const recoveryWallet = useCallback(async () => {
    if (query && query.indexOf('guardians') !== -1) {
      handleGuardianRecovery();
    } else if (query && query.indexOf('removeManage') !== -1) {
      handleRemoveOtherManage();
    } else if (query && query.indexOf('setTransferLimit') !== -1) {
      handleSetTransferLimit();
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
    handleSetTransferLimit,
    managerAddress,
    navigate,
    onManagerAddressAndQueryResult,
    query,
  ]);

  useEffect(() => {
    if (!guardianExpiredTime) return setIsExpired(false);
    const timeGap = (guardianExpiredTime ?? 0) - Date.now();
    if (timeGap <= 0) return setIsExpired(true);

    const timer = setInterval(() => {
      const timeGap = (guardianExpiredTime ?? 0) - Date.now();
      if (timeGap <= 0) return setIsExpired(true);
      setIsExpired(false);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [guardianExpiredTime]);

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
    } else if (query && query.indexOf('setTransferLimit') !== -1) {
      const state = query.split('_')[1];
      navigate(`/setting/wallet-security/payment-security/transfer-settings-edit`, { state: JSON.parse(state) });
    } else {
      navigate('/register/start');
    }
  }, [navigate, query]);

  const renderContent = useMemo(
    () => (
      <div className="common-content1 guardian-approval-content flex-1 flex-column-between">
        <div>
          <div className="title">{t('Guardian Approval')}</div>
          <p className="description">{isExpired ? t('Expired') : t('Expire after 1 hour')}</p>
          <div className="flex-between-center approve-count">
            <span className="flex-row-center">
              {t("Guardians' approval")}
              <CommonTooltip placement="top" title={t('guardianApprovalTip')} />
            </span>
            <div>
              <span className="already-approval">{alreadyApprovalLength}</span>
              <span className="all-approval">{`/${approvalLength}`}</span>
            </div>
          </div>
          <ul className={clsx('verifier-content', !isNotLessThan768 && 'popup-verifier-content')}>
            {userVerifiedList?.map((item) => (
              <GuardianItems
                key={item.key}
                disabled={alreadyApprovalLength >= approvalLength && item.status !== VerifyStatus.Verified}
                isExpired={isExpired}
                item={item}
                loginAccount={loginAccount}
                targetChainId={targetChainId}
              />
            ))}
          </ul>
        </div>
        {!isExpired && (
          <div className={clsx(isPrompt ? 'recovery-wallet-btn-wrap' : 'btn-wrap')}>
            <Button
              type="primary"
              className="recovery-wallet-btn"
              disabled={alreadyApprovalLength <= 0 || alreadyApprovalLength !== approvalLength}
              onClick={recoveryWallet}>
              {t('Confirm')}
            </Button>
          </div>
        )}
      </div>
    ),
    [
      alreadyApprovalLength,
      approvalLength,
      isExpired,
      isNotLessThan768,
      isPrompt,
      loginAccount,
      recoveryWallet,
      t,
      userVerifiedList,
      targetChainId,
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
