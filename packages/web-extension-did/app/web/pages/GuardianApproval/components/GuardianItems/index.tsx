import { setCurrentGuardianAction, setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { ApprovalType, RecaptchaType, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import { Button, message } from 'antd';
import clsx from 'clsx';
import VerifierPair from 'components/VerifierPair';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { verification } from 'utils/api';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useVerifyToken } from 'hooks/authentication';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleVerificationDoc } from '@portkey-wallet/utils/guardian';
import qs from 'query-string';
import './index.less';

interface GuardianItemProps {
  disabled?: boolean;
  isExpired?: boolean;
  item: UserGuardianStatus;
  loginAccount?: LoginInfo;
}
export default function GuardianItems({ disabled, item, isExpired, loginAccount }: GuardianItemProps) {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const originChainId = useOriginChainId();

  const isSocialLogin = useMemo(
    () => item.guardianType === LoginType.Google || item.guardianType === LoginType.Apple,
    [item.guardianType],
  );

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
            operationType: RecaptchaType.optGuardian,
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
    [setLoading, dispatch, navigate, query, originChainId],
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

        let approvalType = ApprovalType.communityRecovery;
        if (query && query.indexOf('removeManage') !== -1) {
          approvalType = ApprovalType.removeOtherManager;
        }

        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: item?.guardianAccount,
            type: LoginType[item.guardianType],
            verifierId: item.verifier?.id || '',
            chainId: originChainId,
            operationType:
              approvalType === ApprovalType.communityRecovery
                ? RecaptchaType.communityRecovery
                : RecaptchaType.optGuardian,
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
          if (approvalType === ApprovalType.removeOtherManager) {
            navigate('/setting/wallet-security/manage-devices/verifier-account', { state: query });
          } else {
            navigate('/login/verifier-account', { state: 'login' });
          }
        }
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        const _error = handleErrorMessage(error);
        message.error(_error);
      }
    },
    [query, loginAccount, originChainId, setLoading, guardianSendCode, dispatch, navigate],
  );

  const verifyToken = useVerifyToken();

  const socialVerifyHandler = useCallback(
    async (item: UserGuardianItem) => {
      try {
        setLoading(true);
        const result = await verifyToken(item.guardianType, {
          accessToken: loginAccount?.authenticationInfo?.[item.guardianAccount],
          id: item.guardianAccount,
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

  const verifyingHandler = useCallback(
    async (item: UserGuardianItem) => {
      if (isSocialLogin) return socialVerifyHandler(item);
      dispatch(setCurrentGuardianAction({ ...item, isInitStatus: false }));
      if (query?.includes('guardians')) {
        navigate('/setting/guardians/verifier-account', { state: query });
      } else if (query?.includes('removeManage')) {
        navigate('/setting/wallet-security/manage-devices/verifier-account', { state: query });
      } else {
        navigate('/login/verifier-account', { state: 'login' });
      }
    },
    [dispatch, isSocialLogin, navigate, socialVerifyHandler, query],
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
