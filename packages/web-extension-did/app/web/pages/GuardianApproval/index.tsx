import { Button } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoginInfo, useGuardiansInfo, useCommonState } from 'store/Provider/hooks';
import { VerifyStatus } from '@portkey-wallet/types/verifier';
import { useNavigate } from 'react-router';
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
import { ChainId } from '@portkey-wallet/types';
import { useLocationParams } from 'hooks/router';
import {
  GuardianApprovalFromPageEnum,
  TGuardianApprovalLocationSearch,
  TGuardianApprovalLocationState,
} from 'types/router';
import './index.less';
import { useSetTransferLimit } from './hooks/useSetTransferLimit';

const AllowedGuardianPageArr = [
  GuardianApprovalFromPageEnum.guardiansAdd,
  GuardianApprovalFromPageEnum.guardiansDel,
  GuardianApprovalFromPageEnum.guardiansEdit,
  GuardianApprovalFromPageEnum.guardiansLoginGuardian,
];

export default function GuardianApproval() {
  const { userGuardianStatus, guardianExpiredTime, opGuardian, preGuardian } = useGuardiansInfo();
  const { address: managerAddress } = useCurrentWalletInfo();
  const { loginAccount } = useLoginInfo();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const navigate = useNavigate();
  const { locationParams } = useLocationParams<TGuardianApprovalLocationState, TGuardianApprovalLocationSearch>();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const isBigScreenPrompt: boolean = useMemo(() => {
    const from = locationParams.from;
    const isNotFromLoginAndRegister = !!(
      from &&
      (AllowedGuardianPageArr.includes(from) ||
        from === GuardianApprovalFromPageEnum.removeManage ||
        from === GuardianApprovalFromPageEnum.setTransferLimit)
    );
    return isNotLessThan768 ? isNotFromLoginAndRegister : false;
  }, [isNotLessThan768, locationParams.from]);
  const targetChainId: ChainId | undefined = useMemo(
    () => locationParams.targetChainId || undefined,
    [locationParams.targetChainId],
  );
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult(`${locationParams.from}`);

  const userVerifiedList = useMemo(() => {
    const tempGuardianList = Object.values(userGuardianStatus ?? {});
    let filterGuardianList: UserGuardianStatus[] = tempGuardianList;
    const from = locationParams.from;
    if (from === GuardianApprovalFromPageEnum.guardiansEdit) {
      filterGuardianList = tempGuardianList.filter((item) => item.key !== preGuardian?.key);
    } else if (
      [
        GuardianApprovalFromPageEnum.guardiansAdd,
        GuardianApprovalFromPageEnum.guardiansDel,
        GuardianApprovalFromPageEnum.guardiansLoginGuardian,
      ].includes(from)
    ) {
      filterGuardianList = tempGuardianList.filter((item) => item.key !== opGuardian?.key);
    }
    return filterGuardianList;
  }, [locationParams.from, opGuardian?.key, preGuardian?.key, userGuardianStatus]);

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
    const from = locationParams.from;
    if (AllowedGuardianPageArr.includes(from)) {
      console.log('recoveryWallet guardians', '');
      handleGuardianRecovery();
    } else if (from === GuardianApprovalFromPageEnum.removeManage) {
      handleRemoveOtherManage();
    } else if (from === GuardianApprovalFromPageEnum.setTransferLimit) {
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
    locationParams.from,
    managerAddress,
    navigate,
    onManagerAddressAndQueryResult,
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
    const from = locationParams.from;
    if (from) {
      if (AllowedGuardianPageArr.includes(from)) {
        if ([GuardianApprovalFromPageEnum.guardiansDel, GuardianApprovalFromPageEnum.guardiansEdit].includes(from)) {
          navigate(`/setting/guardians/edit`);
          return;
        } else if (from === GuardianApprovalFromPageEnum.guardiansAdd) {
          navigate('/setting/guardians/add', { state: 'back' });
          return;
        } else if (from === GuardianApprovalFromPageEnum.guardiansLoginGuardian) {
          if (locationParams.extra === 'edit') {
            navigate('/setting/guardians/edit');
          } else {
            navigate('/setting/guardians/view');
          }
          return;
        }
      }
      if (from === GuardianApprovalFromPageEnum.removeManage) {
        navigate(`/setting/wallet-security/manage-devices/${locationParams.manageAddress}`);
        return;
      }
      if (from === GuardianApprovalFromPageEnum.setTransferLimit) {
        // TODO state
        navigate(`/setting/wallet-security/payment-security/transfer-settings-edit`, {
          state: locationParams,
        });
        return;
      }
      console.log('===guardian approval back error', locationParams);
      return;
    }

    // default back
    navigate('/register/start');
  }, [locationParams, navigate]);

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
