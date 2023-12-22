import { setCurrentGuardianAction, setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { OperationTypeEnum, VerifyStatus } from '@portkey-wallet/types/verifier';
import { Button, message } from 'antd';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { verification } from 'utils/api';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import qs from 'query-string';
import { ChainId } from '@portkey-wallet/types';
import './index.less';
import { useSocialVerify } from 'pages/GuardianApproval/hooks/useSocialVerify';

interface GuardianItemProps {
  disabled?: boolean;
  isExpired?: boolean;
  item: UserGuardianStatus;
  loginAccount?: LoginInfo;
  targetChainId?: ChainId;
}
export default function GuardianItems({ disabled, item, isExpired, loginAccount, targetChainId }: GuardianItemProps) {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { state, search } = useLocation();
  const query = useMemo(() => {
    if (search) {
      const { detail } = qs.parse(search);
      return detail;
    } else {
      return state;
    }
  }, [search, state]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const originChainId = useOriginChainId();

  const isSocialLogin = useMemo(
    () => item.guardianType === LoginType.Google || item.guardianType === LoginType.Apple,
    [item.guardianType],
  );

  const operationType: OperationTypeEnum = useMemo(() => {
    switch (query) {
      case 'guardians/edit':
        return OperationTypeEnum.editGuardian;
      case 'guardians/del':
        return OperationTypeEnum.deleteGuardian;
      default:
        if (query && query.indexOf('guardians/add') !== -1) {
          return OperationTypeEnum.addGuardian;
        }
        if (query && query?.indexOf('removeManage') !== -1) {
          return OperationTypeEnum.removeOtherManager;
        } else if (query && query?.indexOf('setTransferLimit') !== -1) {
          return OperationTypeEnum.modifyTransferLimit;
        }
        return OperationTypeEnum.communityRecovery;
    }
  }, [query]);
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
          navigate('/setting/guardians/verifier-account', { state: query });
        }
      } catch (error: any) {
        console.log('---guardian-sendCode-error', error);
        setLoading(false);
        message.error(verifyErrorHandler(error));
      }
    },
    [dispatch, originChainId, operationType, setLoading, navigate, query],
  );

  const SendCode = useCallback(
    async (item: UserGuardianItem) => {
      try {
        setLoading(true);

        if (query && query.indexOf('guardians') !== -1) {
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
          if (query && query.indexOf('removeManage') !== -1) {
            return navigate('/setting/wallet-security/manage-devices/verifier-account', { state: query });
          }
          if (query && query.indexOf('setTransferLimit') !== -1) {
            return navigate('/setting/wallet-security/payment-security/verifier-account', { state: query });
          }
          return navigate('/login/verifier-account', { state: 'login' });
        }
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        const _error = handleErrorMessage(error);
        message.error(_error);
      }
    },
    [
      setLoading,
      query,
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
        });
        verifiedInfo && dispatch(setUserGuardianItemStatus(verifiedInfo));
        return;
      }

      dispatch(setCurrentGuardianAction({ ...item, isInitStatus: false }));
      if (query?.includes('guardians')) {
        navigate('/setting/guardians/verifier-account', { state: query });
      } else if (query?.includes('removeManage')) {
        navigate('/setting/wallet-security/manage-devices/verifier-account', { state: query });
      } else if (query?.includes('setTransferLimit')) {
        navigate('/setting/wallet-security/payment-security/verifier-account', { state: query });
      } else {
        navigate('/login/verifier-account', { state: 'login' });
      }
    },
    [isSocialLogin, socialVerify, operationType, originChainId, loginAccount, dispatch, query, navigate, targetChainId],
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
    }
  }, []);

  return (
    <li className={clsx('flex-between-center verifier-item', disabled && 'verifier-item-disabled')}>
      {item.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
      <div className="flex-between-center verifier-item-main">
        <VerifierPair
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
