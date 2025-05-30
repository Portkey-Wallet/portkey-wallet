import { Button } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoginInfo, useGuardiansInfo, useCommonState } from 'store/Provider/hooks';
import { VerifyStatus } from '@portkey-wallet/types/verifier';
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
import { usePromptLocationParams, useNavigateState } from 'hooks/router';
import {
  FromPageEnum,
  TAddGuardianLocationState,
  TGuardianApprovalLocationSearch,
  TGuardianApprovalLocationState,
  TTransferSettingEditLocationState,
} from 'types/router';
import './index.less';
import { useSetTransferLimit } from './hooks/useSetTransferLimit';

const AllowedGuardianPageArr = [
  FromPageEnum.guardiansAdd,
  FromPageEnum.guardiansDel,
  FromPageEnum.guardiansEdit,
  FromPageEnum.guardiansLoginGuardian,
];

export default function GuardianApproval() {
  const { userGuardianStatus, guardianExpiredTime, opGuardian, preGuardian } = useGuardiansInfo();
  const { address: managerAddress } = useCurrentWalletInfo();
  const { loginAccount } = useLoginInfo();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const navigate = useNavigateState<TAddGuardianLocationState | TTransferSettingEditLocationState>();
  const { locationParams } = usePromptLocationParams<TGuardianApprovalLocationState, TGuardianApprovalLocationSearch>();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const isBigScreenPrompt: boolean = useMemo(() => {
    const from = locationParams.previousPage;
    const isNotFromLoginAndRegister = !!(
      from &&
      (AllowedGuardianPageArr.includes(from) ||
        from === FromPageEnum.removeManage ||
        from === FromPageEnum.setTransferLimit)
    );
    return isNotLessThan768 ? isNotFromLoginAndRegister : false;
  }, [isNotLessThan768, locationParams.previousPage]);
  const targetChainId: ChainId | undefined = useMemo(
    () => locationParams.targetChainId || undefined,
    [locationParams.targetChainId],
  );
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult(`${locationParams.previousPage}`);

  const userVerifiedList = useMemo(() => {
    const tempGuardianList = Object.values(userGuardianStatus ?? {});
    let filterGuardianList: UserGuardianStatus[] = tempGuardianList;
    const from = locationParams.previousPage;
    if (FromPageEnum.guardiansEdit === from) {
      filterGuardianList = tempGuardianList.filter((item) => item.key !== preGuardian?.key);
    } else if (FromPageEnum.guardiansDel === from) {
      filterGuardianList = tempGuardianList.filter(
        (item) => item.key !== preGuardian?.key && item.key !== opGuardian?.key,
      );
    } else if (from && [FromPageEnum.guardiansAdd, FromPageEnum.guardiansLoginGuardian].includes(from)) {
      filterGuardianList = tempGuardianList.filter((item) => item.key !== opGuardian?.key);
    }
    return filterGuardianList;
  }, [locationParams.previousPage, opGuardian?.key, preGuardian?.key, userGuardianStatus]);

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
    const from = locationParams.previousPage;
    if (from && AllowedGuardianPageArr.includes(from)) {
      console.log('recoveryWallet guardians', '');
      handleGuardianRecovery();
    } else if (from === FromPageEnum.removeManage) {
      handleRemoveOtherManage();
    } else if (from === FromPageEnum.setTransferLimit) {
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
    locationParams.previousPage,
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
    const from = locationParams.previousPage;
    if (from) {
      if (AllowedGuardianPageArr.includes(from)) {
        if ([FromPageEnum.guardiansDel, FromPageEnum.guardiansEdit].includes(from)) {
          navigate(`/setting/guardians/edit`);
          return;
        } else if (from === FromPageEnum.guardiansAdd) {
          navigate('/setting/guardians/add', { state: { previousPage: 'back' } });
          return;
        } else if (from === FromPageEnum.guardiansLoginGuardian) {
          if (locationParams.extra === 'edit') {
            navigate('/setting/guardians/edit');
          } else {
            navigate('/setting/guardians/view');
          }
          return;
        }
      }
      if (from === FromPageEnum.removeManage) {
        navigate(`/setting/wallet-security/manage-devices/${locationParams.manageAddress}`);
        return;
      }
      if (from === FromPageEnum.setTransferLimit) {
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
      t,
      isExpired,
      alreadyApprovalLength,
      approvalLength,
      isNotLessThan768,
      userVerifiedList,
      isPrompt,
      recoveryWallet,
      loginAccount,
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
