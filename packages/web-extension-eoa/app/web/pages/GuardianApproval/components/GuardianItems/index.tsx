import { setCurrentGuardianAction, setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { OperationTypeEnum, VerifyStatus } from '@portkey-wallet/types/verifier';
import { Button } from 'antd';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { verification } from 'utils/api';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import './index.less';
import { useSocialVerify } from 'pages/GuardianApproval/hooks/useSocialVerify';
import singleMessage from 'utils/singleMessage';
import { usePromptLocationParams, useNavigateState } from 'hooks/router';
import {
  FromPageEnum,
  TGuardianItemLocationSearch,
  TGuardianItemLocationState,
  TVerifierAccountLocationState,
} from 'types/router';

interface GuardianItemProps {
  disabled?: boolean;
  isExpired?: boolean;
  item: UserGuardianStatus;
  loginAccount?: LoginInfo;
  targetChainId?: ChainId;
}

const AllowedGuardianPageArr = [
  FromPageEnum.guardiansAdd,
  FromPageEnum.guardiansEdit,
  FromPageEnum.guardiansDel,
  FromPageEnum.guardiansLoginGuardian,
];

export default function GuardianItems({ disabled, item, isExpired, loginAccount, targetChainId }: GuardianItemProps) {
  const { t } = useTranslation();
  const { opGuardian } = useGuardiansInfo();
  const { setLoading } = useLoading();
  const { locationParams } = usePromptLocationParams<TGuardianItemLocationState, TGuardianItemLocationSearch>();
  const dispatch = useAppDispatch();
  const navigate = useNavigateState<TVerifierAccountLocationState>();
  const originChainId = useOriginChainId();

  const isSocialLogin = useMemo(
    () =>
      item.guardianType === LoginType.Google ||
      item.guardianType === LoginType.Apple ||
      item.guardianType === LoginType.Twitter ||
      item.guardianType === LoginType.Facebook ||
      item.guardianType === LoginType.Telegram,
    [item.guardianType],
  );

  const operationType: OperationTypeEnum = useMemo(() => {
    const from = locationParams.previousPage;
    switch (from) {
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
        return OperationTypeEnum.communityRecovery;
    }
  }, [locationParams.previousPage, opGuardian?.isLoginAccount]);
  console.log('operationType====', operationType);

  const guardianSendCode = useCallback(
    async (item: UserGuardianItem) => {
      try {
        dispatch(
          setLoginAccountAction({
            guardianAccount: item.guardianAccount,
            loginType: item.guardianType,
          }),
        );
        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: item?.guardianAccount,
            type: LoginType[item.guardianType],
            verifierId: item?.verifier?.id || '',
            chainId: originChainId,
            operationType,
            operationDetails: locationParams?.operationDetails,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              ...item,
              verifierInfo: {
                sessionId: result.verifierSessionId,
                endPoint: result.endPoint,
              },
              isInitStatus: true,
            }),
          );
          dispatch(
            setUserGuardianItemStatus({
              key: item.key,
              status: VerifyStatus.Verifying,
            }),
          );
          navigate('/setting/guardians/verifier-account', { state: locationParams });
        }
      } catch (error: any) {
        console.log('---guardian-sendCode-error', error);
        setLoading(false);
        singleMessage.error(verifyErrorHandler(error));
      }
    },
    [dispatch, originChainId, operationType, setLoading, navigate, locationParams],
  );

  const SendCode = useCallback(
    async (item: UserGuardianItem) => {
      const from = locationParams.previousPage;
      try {
        setLoading(true);

        if (AllowedGuardianPageArr.includes(from)) {
          guardianSendCode(item);
          return;
        }
        if (!loginAccount || !LoginType[loginAccount.loginType] || !loginAccount.guardianAccount) {
          throw 'User registration information is invalid, please fill in the registration method again';
        }

        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: item?.guardianAccount,
            type: LoginType[item.guardianType],
            verifierId: item.verifier?.id || '',
            chainId: originChainId,
            operationType,
            targetChainId: targetChainId,
            operationDetails: locationParams.operationDetails,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              ...item,
              verifierInfo: {
                sessionId: result.verifierSessionId,
                endPoint: result.endPoint,
              },
              isInitStatus: true,
            }),
          );
          dispatch(
            setUserGuardianItemStatus({
              key: item.key,
              status: VerifyStatus.Verifying,
            }),
          );
          if (from === FromPageEnum.removeManage) {
            return navigate('/setting/wallet-security/manage-devices/verifier-account', { state: locationParams });
          }
          if (from === FromPageEnum.setTransferLimit) {
            return navigate('/setting/wallet-security/payment-security/verifier-account', { state: locationParams });
          }
          return navigate('/login/verifier-account', { state: { previousPage: FromPageEnum.login } });
        }
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        const _error = handleErrorMessage(error);
        singleMessage.error(_error);
      }
    },
    [
      locationParams,
      setLoading,
      loginAccount,
      originChainId,
      operationType,
      targetChainId,
      guardianSendCode,
      dispatch,
      navigate,
    ],
  );

  const socialVerify = useSocialVerify();
  const verifyingHandler = useCallback(
    async (item: UserGuardianItem) => {
      if (isSocialLogin) {
        const verifiedInfo = await socialVerify({
          operateGuardian: item,
          operationType,
          originChainId,
          loginAccount,
          targetChainId,
          operationDetails: locationParams.operationDetails,
        });
        verifiedInfo && dispatch(setUserGuardianItemStatus(verifiedInfo));
        return;
      }
      const from = locationParams.previousPage;
      dispatch(setCurrentGuardianAction({ ...item, isInitStatus: false }));
      if (AllowedGuardianPageArr.includes(from)) {
        navigate('/setting/guardians/verifier-account', { state: locationParams });
      } else if (from === FromPageEnum.removeManage) {
        navigate('/setting/wallet-security/manage-devices/verifier-account', { state: locationParams });
      } else if (from === FromPageEnum.setTransferLimit) {
        navigate('/setting/wallet-security/payment-security/verifier-account', { state: locationParams });
      } else {
        navigate('/login/verifier-account', { state: { previousPage: FromPageEnum.login } });
      }
    },
    [
      isSocialLogin,
      socialVerify,
      operationType,
      originChainId,
      loginAccount,
      dispatch,
      locationParams,
      navigate,
      targetChainId,
    ],
  );

  const accountShow = useCallback((guardian: UserGuardianItem) => {
    switch (guardian.guardianType) {
      case LoginType.Email:
      case LoginType.Phone:
        return <div className="account-text account-text-one-row">{guardian.guardianAccount}</div>;
      case LoginType.Google:
        return (
          <div className="account-text account-text-two-row">
            <div className="name">{guardian.firstName}</div>
            <div className="detail">{guardian.thirdPartyEmail}</div>
          </div>
        );
      case LoginType.Apple:
        return (
          <div className="account-text account-text-two-row">
            <div className="name">{guardian.firstName}</div>
            <div className="detail">{guardian.isPrivate ? '******' : guardian.thirdPartyEmail}</div>
          </div>
        );
      case LoginType.Telegram:
      case LoginType.Facebook:
      case LoginType.Twitter:
        return (
          <div className="account-text account-text-two-row">
            <div className="name">{guardian.firstName}</div>
            <div className="detail">{'******'}</div>
          </div>
        );
      default:
        return <div className="account-text account-text-one-row">{guardian.guardianAccount}</div>;
    }
  }, []);

  return (
    <li className={clsx('flex-between-center verifier-item', disabled && 'verifier-item-disabled')}>
      {item.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
      <div className="flex-between-center verifier-item-main">
        <VerifierPair
          guardian={item}
          guardianType={item.guardianType}
          verifierSrc={item.verifier?.imageUrl}
          verifierName={item?.verifier?.name}
        />
        {accountShow(item)}
      </div>
      {isExpired && item.status !== VerifyStatus.Verified ? (
        <Button className="expired" type="text" disabled>
          {t('Expired')}
        </Button>
      ) : (
        <>
          {(!item.status || item.status === VerifyStatus.NotVerified) && !isSocialLogin && (
            <Button className="not-verified" type="primary" onClick={() => SendCode(item)}>
              {t('Send')}
            </Button>
          )}
          {(item.status === VerifyStatus.Verifying || (!item.status && isSocialLogin)) && (
            <Button type="primary" className="verifying" onClick={() => verifyingHandler(item)}>
              {t('Verify')}
            </Button>
          )}
          {item.status === VerifyStatus.Verified && (
            <Button className="verified" type="text" disabled>
              {t('Confirmed')}
            </Button>
          )}
        </>
      )}
    </li>
  );
}
