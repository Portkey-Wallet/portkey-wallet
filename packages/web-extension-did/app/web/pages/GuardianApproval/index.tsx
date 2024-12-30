import { Progress } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoginInfo, useGuardiansInfo, useCommonState, useAppDispatch } from 'store/Provider/hooks';
import { VerifyStatus } from '@portkey-wallet/types/verifier';
import { UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { getApprovalCount } from '@portkey-wallet/utils/guardian';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import GuardianItems from './components/GuardianItems';
import { useGuardianRecovery } from './hooks/useRecovery';
import { useRemoveOtherManage } from './hooks/useRemoveOtherManage';
// import GuardianApprovalPrompt from './Prompt';
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
import { ZERO } from '@portkey-wallet/constants/misc';
import {
  resetGuardianExpiredTime,
  // resetUserGuardianStatus,
  resetUserGuardianStatusState,
  setOpGuardianAction,
  setPreGuardianAction,
  // setUserGuardianStatus,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import CircleLoading from 'components/CircleLoading';
import { CommonButton } from '@portkey/did-ui-react';
import { useLocation } from 'react-router-dom';
import RegisterHeader from 'pages/components/RegisterHeader';

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
  const dispatch = useAppDispatch();
  const navigate = useNavigateState<TAddGuardianLocationState | TTransferSettingEditLocationState>();
  const { locationParams } = usePromptLocationParams<TGuardianApprovalLocationState, TGuardianApprovalLocationSearch>();
  const { pathname } = useLocation();
  const isFromLogin = useMemo(() => pathname.includes('login'), [pathname]);
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  // const isBigScreenPrompt: boolean = useMemo(() => {
  //   const from = locationParams.previousPage;
  //   const isNotFromLoginAndRegister = !!(
  //     from &&
  //     (AllowedGuardianPageArr.includes(from) ||
  //       from === FromPageEnum.removeManage ||
  //       from === FromPageEnum.setTransferLimit)
  //   );
  //   return isNotLessThan768 ? isNotFromLoginAndRegister : false;
  // }, [isNotLessThan768, locationParams.previousPage]);
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
        navigate(`/setting/wallet-security/payment-security/transfer-settings`, {
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

  const renderContent = useMemo(() => {
    const loginAccountList = userVerifiedList.filter((i) => i.isLoginAccount);
    const otherAccountList = userVerifiedList.filter((i) => !i.isLoginAccount);
    return (
      <div className={clsx('guardian-approval-content', 'flex-1', 'margin-top-16', isExpired && 'flex-column-between')}>
        {isExpired && <CustomSvgV3 fillColor="#F1A282" className="margin-top-16" type="error" />}
        <div className="title margin-top-16">{t(isExpired ? 'Guardian Approval Expired' : 'Guardian Approval')}</div>
        <p className="description margin-top-16">
          {isExpired
            ? t('Your guardian approvals have expired. Please request new approvals to continue or cancel the process.')
            : t('Complete the required guardian approvals below. Note: approvals expire after 1 hour.')}
        </p>
        {isExpired ? (
          <>
            <div className="flex-1"></div>
            <CommonButton
              type="primary"
              className="recovery-wallet-btn"
              onClick={() => {
                setIsExpired(false);
                dispatch(setOpGuardianAction());
                dispatch(setPreGuardianAction());
                dispatch(resetGuardianExpiredTime());
                dispatch(resetUserGuardianStatusState());
              }}>
              {t('Try Again')}
            </CommonButton>
            <CommonButton
              type="outline"
              className="recovery-wallet-btn margin-top-16"
              onClick={() => navigate('/register/start')}>
              {t('Cancel')}
            </CommonButton>
          </>
        ) : (
          <>
            <div className="flex-between-center approve-count">
              <div className="width-100-percent">
                <div className="flex-row-center">
                  <span className="all-approval">{`${alreadyApprovalLength} / ${approvalLength} completed`}</span>
                  <span>{alreadyApprovalLength === approvalLength ? <CustomSvgV3 type="check" /> : null}</span>
                </div>
                <Progress
                  percent={
                    alreadyApprovalLength
                      ? ZERO.plus(alreadyApprovalLength).div(approvalLength).times(100).toNumber()
                      : alreadyApprovalLength
                  }
                />
              </div>
            </div>
            {alreadyApprovalLength === approvalLength ? (
              <div className="flex-center">
                <CircleLoading width={32} />
              </div>
            ) : (
              <ul className={clsx('verifier-content', !isNotLessThan768 && 'popup-verifier-content')}>
                <div className="guardian-items-title">Login account{loginAccountList.length > 1 ? '(s)' : null}</div>
                {loginAccountList?.map((item) => (
                  <GuardianItems
                    key={item.key}
                    disabled={alreadyApprovalLength >= approvalLength && item.status !== VerifyStatus.Verified}
                    isExpired={isExpired}
                    item={item}
                    loginAccount={loginAccount}
                    targetChainId={targetChainId}
                  />
                ))}
                {otherAccountList.length > 0 ? (
                  <>
                    <div className="guardian-items-title">
                      Other guardian{loginAccountList.length > 1 ? '(s)' : null}
                    </div>
                    {otherAccountList?.map((item) => (
                      <GuardianItems
                        key={item.key}
                        disabled={alreadyApprovalLength >= approvalLength && item.status !== VerifyStatus.Verified}
                        isExpired={isExpired}
                        item={item}
                        loginAccount={loginAccount}
                        targetChainId={targetChainId}
                      />
                    ))}
                  </>
                ) : null}
              </ul>
            )}
          </>
        )}
      </div>
    );
  }, [
    userVerifiedList,
    isExpired,
    t,
    alreadyApprovalLength,
    approvalLength,
    isNotLessThan768,
    dispatch,
    navigate,
    loginAccount,
    targetChainId,
  ]);

  const props = useMemo(
    () => ({
      onBack: handleBack,
      renderContent,
    }),
    [handleBack, renderContent],
  );

  return isFromLogin ? (
    <div>
      <RegisterHeader />
      <div className="guardian-approve-login-page">
        <GuardianApprovalPopup {...props} />
      </div>
    </div>
  ) : (
    <GuardianApprovalPopup {...props} />
  );

  // return isNotLessThan768 ? (
  //   <GuardianApprovalPrompt {...props} isBigScreenPrompt={isBigScreenPrompt} />
  // ) : (
  //   <GuardianApprovalPopup {...props} />
  // );
}
