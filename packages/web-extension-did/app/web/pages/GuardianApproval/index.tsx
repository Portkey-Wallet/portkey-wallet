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
import { useGuardianRecovery } from './hooks/useRecovery';
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
  const query = useMemo(() => {
    if (search) {
      const { detail } = qs.parse(search);
      return detail;
    } else {
      return state;
    }
  }, [search, state]);
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
      const i = query.indexOf('_');
      const state = query.substring(i + 1);
      const _params = JSON.parse(state || '{}');
      return _params.targetChainId;
    }
    return undefined;
  }, [query]);
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult(query);

  const userVerifiedList = useMemo(() => {
    const tempGuardianList = Object.values(userGuardianStatus ?? {});
    let filterGuardianList: UserGuardianStatus[] = tempGuardianList;
    const _query = query?.split('_')[0];

    if (query === 'guardians/edit') {
      filterGuardianList = tempGuardianList.filter((item) => item.key !== preGuardian?.key);
    } else if (['guardians/del', 'guardians/add', 'guardians/loginGuardian'].includes(_query)) {
      filterGuardianList = tempGuardianList.filter((item) => item.key !== opGuardian?.key);
    }
    return filterGuardianList;
  }, [opGuardian?.key, preGuardian?.key, query, userGuardianStatus]);

  const approvalLength = useMemo(() => {
    return getApprovalCount(userVerifiedList.length);
  }, [userVerifiedList.length]);

  const alreadyApprovalLength = useMemo(() => {
    return userVerifiedList.filter((item) => item?.status === VerifyStatus.Verified).length;
  }, [userVerifiedList]);

  const handleGuardianRecovery = useGuardianRecovery();

  const handleRemoveOtherManage = useRemoveOtherManage();
  const handleSetTransferLimit = useSetTransferLimit(targetChainId);

  const recoveryWallet = useCallback(async () => {
    if (query && query?.indexOf('guardians') !== -1) {
      console.log('recoveryWallet guardians', '');
      handleGuardianRecovery();
    } else if (query && query?.indexOf('removeManage') !== -1) {
      handleRemoveOtherManage();
    } else if (query && query.indexOf('setTransferLimit') !== -1) {
      handleSetTransferLimit();
    } else {
      const res = await InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS).send();
      if (managerAddress && res.data.privateKey) {
        onManagerAddressAndQueryResult({ pin: res.data.privateKey });
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

  const isExpiredLogic = useCallback(() => {
    const timeGap = (guardianExpiredTime ?? 0) - Date.now();
    if (timeGap <= 0) return true;
    return false;
  }, [guardianExpiredTime]);

  useEffect(() => {
    if (!guardianExpiredTime) return setIsExpired(false);
    setIsExpired(isExpiredLogic());

    const timer = setInterval(() => {
      setIsExpired(isExpiredLogic());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [guardianExpiredTime, isExpiredLogic]);

  useEffect(() => {
    if (alreadyApprovalLength >= approvalLength && !isExpired) recoveryWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyApprovalLength, approvalLength, isExpired]);

  const handleBack = useCallback(() => {
    if (query) {
      if (query.indexOf('guardians') !== -1) {
        if (['guardians/del', 'guardians/edit'].includes(query)) {
          navigate(`/setting/guardians/edit`);
          return;
        } else if (query.indexOf('guardians/add') !== -1) {
          navigate('/setting/guardians/add', { state: 'back' });
          return;
        } else if (query.indexOf('guardians/loginGuardian') !== -1) {
          const i = query.indexOf('_');
          const _extra = query.substring(i + 1);
          if (_extra === 'edit') {
            navigate('/setting/guardians/edit');
          } else {
            navigate('/setting/guardians/view');
          }
          return;
        }
      }
      if (query.indexOf('removeManage') !== -1) {
        const i = query.indexOf('_');
        const manageAddress = query.substring(i + 1);
        navigate(`/setting/wallet-security/manage-devices/${manageAddress}`);
        return;
      }
      if (query.indexOf('setTransferLimit') !== -1) {
        const i = query.indexOf('_');
        const state = query.substring(i + 1);
        navigate(`/setting/wallet-security/payment-security/transfer-settings-edit`, { state: JSON.parse(state) });
        return;
      }
      console.log('===guardian approval back error', query);
      return;
    }

    // default back
    navigate('/register/start');
  }, [navigate, query]);

  const renderContent = useMemo(
    () => (
      <div className="common-content1 guardian-approval-content flex-1 flex-column-between">
        <div>
          <div className="title">{t('Guardian Approval')}</div>
          <p className="description">
            {isExpired ? t('Expired. Please initiate social recovery again.') : t('Expire after 1 hour')}
          </p>
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
