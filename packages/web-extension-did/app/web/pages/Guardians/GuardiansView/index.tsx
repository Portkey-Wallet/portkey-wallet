import { Button, message, Switch } from 'antd';
import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import { useAppDispatch, useGuardiansInfo, useLoading, useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import { useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import {
  setCurrentGuardianAction,
  setOpGuardianAction,
  setPreGuardianAction,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { GuardianMth } from 'types/guardians';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import useGuardianList from 'hooks/useGuardianList';
import { verification } from 'utils/api';
import aes from '@portkey-wallet/utils/aes';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { getGoogleUserInfo, parseAppleIdentityToken } from '@portkey-wallet/utils/authentication';
import { request } from '@portkey-wallet/api/api-did';
import GuardianViewPrompt from './Prompt';
import GuardianViewPopup from './Popup';
import CustomModal from '../../components/CustomModal';
import { useCommonState } from 'store/Provider/hooks';
import AccountShow from '../components/AccountShow';
import { guardianIconMap } from '../utils';
import './index.less';
import { RecaptchaType } from '@portkey-wallet/types/verifier';

export default function GuardiansView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getGuardianList = useGuardianList();
  const { currentGuardian, opGuardian, userGuardiansList } = useGuardiansInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();
  const editable = useMemo(() => Object.keys(userGuardiansList ?? {}).length > 1, [userGuardiansList]);
  const isPhoneType = useMemo(() => opGuardian?.guardianType === LoginType.Phone, [opGuardian?.guardianType]);
  const { currentNetwork: curNet } = useWalletInfo();

  useEffect(() => {
    getGuardianList({ caHash: walletInfo.caHash });
  }, [getGuardianList, walletInfo.caHash]);

  useEffect(() => {
    const temp = userGuardiansList?.filter((guardian) => guardian.key === opGuardian?.key) || [];
    if (temp.length > 0) {
      dispatch(setCurrentGuardianAction(temp[0]));
      dispatch(setOpGuardianAction(temp[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGuardiansList]);

  const handleSocialVerify = useCallback(
    async (v: ISocialLogin) => {
      setLoading(true);
      const result = await socialLoginAction(v, curNet);
      const data = result.data;
      if (!data) throw 'Action error';
      const verifySocialParams = {
        verifierId: opGuardian?.verifier?.id,
        chainId: currentChain?.chainId || originChainId,
        accessToken: data?.access_token,
      };
      if (v === 'Google') {
        await getGoogleUserInfo(data?.access_token);
        // const userInfo = await getGoogleUserInfo(data?.access_token);
        // const { firstName, email, id } = userInfo;
        setLoading(true);
        await request.verify.verifyGoogleToken({
          params: verifySocialParams,
        });
      } else if (v === 'Apple') {
        parseAppleIdentityToken(data?.access_token);
        // const userInfo = parseAppleIdentityToken(data?.access_token);
        // const { email, userId } = userInfo;
        setLoading(true);
        await request.verify.verifyAppleToken({
          params: verifySocialParams,
        });
      }

      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!currentChain?.endPoint || !privateKey) return message.error('unset login account error');
      const curRes = await handleGuardian({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey: privateKey,
        paramsOption: {
          method: GuardianMth.SetGuardianTypeForLogin,
          params: {
            caHash: walletInfo?.caHash,
            guardian: {
              type: currentGuardian?.guardianType,
              verifierId: currentGuardian?.verifier?.id,
              identifierHash: currentGuardian?.identifierHash,
            },
          },
        },
      });
      console.log('SetLoginAccount', curRes);
      getGuardianList({ caHash: walletInfo.caHash });
      setLoading(false);
    },
    [
      curNet,
      opGuardian?.verifier?.id,
      currentChain?.chainId,
      currentChain?.endPoint,
      currentChain?.caContractAddress,
      originChainId,
      walletInfo.AESEncryptPrivateKey,
      walletInfo.caHash,
      passwordSeed,
      currentNetwork.walletType,
      currentGuardian?.guardianType,
      currentGuardian?.verifier?.id,
      currentGuardian?.identifierHash,
      getGuardianList,
      setLoading,
    ],
  );

  const verifyHandler = useCallback(async () => {
    try {
      if (opGuardian?.isLoginAccount) {
        const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
        if (!currentChain?.endPoint || !privateKey) return message.error('unset login account error');
        setLoading(true);
        const result = await handleGuardian({
          rpcUrl: currentChain.endPoint,
          chainType: currentNetwork.walletType,
          address: currentChain.caContractAddress,
          privateKey: privateKey,
          paramsOption: {
            method: GuardianMth.UnsetGuardianTypeForLogin,
            params: {
              caHash: walletInfo?.caHash,
              guardian: {
                type: currentGuardian?.guardianType,
                verifierId: currentGuardian?.verifier?.id,
                identifierHash: currentGuardian?.identifierHash,
              },
            },
          },
        });
        console.log('unSetLoginAccount', result);
        getGuardianList({ caHash: walletInfo.caHash });
        setLoading(false);
      } else {
        dispatch(
          setLoginAccountAction({
            guardianAccount: opGuardian?.guardianAccount as string,
            loginType: opGuardian?.guardianType as LoginType,
          }),
        );
        if (LoginType.Apple === opGuardian?.guardianType) {
          handleSocialVerify('Apple');
          return;
        } else if (LoginType.Google === opGuardian?.guardianType) {
          handleSocialVerify('Google');
          return;
        }
        setLoading(true);

        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: opGuardian?.guardianAccount as string,
            type: LoginType[opGuardian?.guardianType as LoginType],
            verifierId: opGuardian?.verifier?.id || '',
            chainId: originChainId,
            operationType: RecaptchaType.optGuardian,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(
            setCurrentGuardianAction({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...opGuardian!,
              verifierInfo: {
                sessionId: result.verifierSessionId,
                endPoint: result.endPoint,
              },
              isInitStatus: true,
            }),
          );
          navigate('/setting/guardians/verifier-account', { state: 'guardians/setLoginAccount' });
        }
      }
    } catch (error: any) {
      setLoading(false);
      message.error(contractErrorHandler(error?.error || error) || error?.type);
      console.log('---setLoginAccount-error---', error);
    }
  }, [
    currentChain,
    currentGuardian,
    currentNetwork,
    dispatch,
    getGuardianList,
    handleSocialVerify,
    navigate,
    originChainId,
    opGuardian,
    passwordSeed,
    setLoading,
    walletInfo,
  ]);

  const switchHandler = useCallback(() => {
    if (opGuardian?.guardianType === LoginType.Apple) {
      handleSocialVerify('Apple');
    } else if (opGuardian?.guardianType === LoginType.Google) {
      handleSocialVerify('Google');
    } else {
      CustomModal({
        type: 'confirm',
        okText: 'Confirm',
        content: (
          <p>
            {`${opGuardian?.verifier?.name ?? ''} will send a verification code to `}
            <strong>{opGuardian?.guardianAccount}</strong>
            {` to verify your ${isPhoneType ? 'phone number' : 'email address'}.`}
          </p>
        ),
        onOk: verifyHandler,
      });
    }
  }, [
    handleSocialVerify,
    isPhoneType,
    opGuardian?.guardianAccount,
    opGuardian?.guardianType,
    opGuardian?.verifier?.name,
    verifyHandler,
  ]);

  const checkSwitch = useThrottleCallback(
    async (status: boolean) => {
      if (status) {
        const isLogin = Object.values(userGuardiansList ?? {}).some(
          (item: UserGuardianItem) => item.isLoginAccount && item.guardianAccount === currentGuardian?.guardianAccount,
        );
        if (isLogin) {
          switchHandler();
          return;
        }
        try {
          await getHolderInfo({
            chainId: originChainId,
            guardianIdentifier: opGuardian?.guardianAccount,
          });
          CustomModal({
            type: 'info',
            okText: 'Close',
            content: <>{t('This account address is already a login account and cannot be used')}</>,
          });
        } catch (error: any) {
          if (error?.error?.code?.toString() === '3002') {
            switchHandler();
          } else {
            const _err = error?.error?.message || 'GetHolderInfo error';
            message.error(_err);
            throw _err;
          }
        }
      } else {
        let loginAccountNum = 0;
        userGuardiansList?.forEach((item) => {
          if (item.isLoginAccount) loginAccountNum++;
        });
        if (loginAccountNum > 1) {
          verifyHandler();
        } else {
          CustomModal({
            type: 'info',
            okText: 'Close',
            content: <>{t('This guardian is the only login account and cannot be turned off')}</>,
          });
        }
      }
    },
    [
      currentGuardian?.guardianAccount,
      opGuardian?.guardianAccount,
      originChainId,
      switchHandler,
      t,
      userGuardiansList,
      verifyHandler,
    ],
  );

  const onBack = useCallback(() => {
    navigate('/setting/guardians');
  }, [navigate]);

  const headerTitle = useMemo(() => 'Guardians', []);

  const renderContent = useMemo(
    () => (
      <div className="guardian-view-content flex-column-between flex-1">
        <div>
          <div className="input-content">
            <div className="input-item">
              <div className="label">{`Guardian ${LoginType[opGuardian?.guardianType || 0]}`}</div>
              <div className="control">
                <CustomSvg type={guardianIconMap[opGuardian?.guardianType || 0]} />
                <AccountShow guardian={opGuardian} />
              </div>
            </div>
            <div className="input-item">
              <div className="label">{t('Verifier')}</div>
              <div className="control">
                <BaseVerifierIcon src={opGuardian?.verifier?.imageUrl} fallback={opGuardian?.verifier?.name[0]} />
                <span className="name">{opGuardian?.verifier?.name ?? ''}</span>
              </div>
            </div>
          </div>
          <div className="login-content">
            <span className="label">{t('Login account')}</span>
            <span className="value">{t('The login account will be able to log in and control all your assets')}</span>
            <div className="status-wrap">
              <Switch className="login-switch" checked={opGuardian?.isLoginAccount} onChange={checkSwitch} />
              <span className="status">{opGuardian?.isLoginAccount ? 'Open' : 'Close'}</span>
            </div>
          </div>
        </div>
        <div className="btn-wrap" style={{ display: editable ? '' : 'none' }}>
          <Button
            onClick={() => {
              dispatch(setPreGuardianAction(opGuardian));
              navigate('/setting/guardians/edit');
            }}
            type="primary">
            {t('Edit')}
          </Button>
        </div>
      </div>
    ),
    [dispatch, editable, checkSwitch, navigate, opGuardian, t],
  );

  const props = useMemo(
    () => ({
      headerTitle,
      renderContent,
      onBack,
    }),
    [headerTitle, onBack, renderContent],
  );

  return isNotLessThan768 ? <GuardianViewPrompt {...props} /> : <GuardianViewPopup {...props} />;
}
