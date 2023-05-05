import CustomSvg from 'components/CustomSvg';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useNavigate, useParams } from 'react-router';
import ScanCard from './components/ScanCard';
import { useCurrentNetworkInfo, useIsMainnet, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { setOriginChainId } from '@portkey-wallet/store/store-ca/wallet/actions';
import { NetworkType } from '@portkey-wallet/types';
import CommonSelect from 'components/CommonSelect1';
import { useChangeNetwork } from 'hooks/useChangeNetwork';
import i18n from 'i18n';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { resetGuardians } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { handleErrorCode, handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { getGoogleUserInfo, parseAppleIdentityToken } from '@portkey-wallet/utils/authentication';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useGetRegisterInfo } from '@portkey-wallet/hooks/hooks-ca/guardian';
import { DefaultChainId, OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import useChangeNetworkText from 'hooks/useChangeNetworkText';
import CustomModal from 'pages/components/CustomModal';
import { IconType } from 'types/icon';
import {
  SignUpBase,
  LoginBase,
  SocialLoginFinishHandler,
  GuardianInputInfo,
  ISocialLoginConfig,
} from '@portkey/did-ui-react';
import { countryCodeList } from '@portkey-wallet/constants/constants-ca/country';

import './index.less';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';

export default function RegisterStart() {
  const { type } = useParams();
  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();
  const changeNetwork = useChangeNetwork();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const fetchUserVerifier = useGuardianList();
  const changeNetworkModalText = useChangeNetworkText();
  const isMainnet = useIsMainnet();

  const networkList = useNetworkList();

  const netWorkIcon: Record<NetworkType, IconType> = useMemo(
    () => ({
      MAIN: 'Aelf',
      TESTNET: 'elf-icon',
    }),
    [],
  );

  const selectItems = useMemo(
    () =>
      networkList?.map((item) => ({
        value: item.networkType,
        icon: netWorkIcon[item.networkType],
        label: item.name,
        disabled: !item.isActive,
      })),
    [netWorkIcon, networkList],
  );

  const networkChange = useCallback(
    (value: NetworkType) => {
      const network = networkList.find((item) => item.networkType === value);
      if (network) {
        const { title, content } = changeNetworkModalText(value);
        CustomModal({
          type: 'confirm',
          content: (
            <div className="change-network-modal">
              <div className="title">
                {title}
                <br />
                {`aelf ${isMainnet ? 'Testnet' : 'Mainnet'}`}
              </div>
              <div className="content">{content}</div>
            </div>
          ),
          onOk: () => {
            changeNetwork(network);
          },
          okText: 'Confirm',
        });
      }
    },
    [changeNetwork, changeNetworkModalText, networkList, isMainnet],
  );

  const isHasAccount = useRef<boolean>();

  const getRegisterInfo = useGetRegisterInfo();

  const validateIdentifier = useCallback(
    async (identifier?: string) => {
      let isLoginAccount = false;
      try {
        const { originChainId } = await getRegisterInfo({
          loginGuardianIdentifier: identifier,
        });
        const checkResult = await getHolderInfo({
          chainId: originChainId,
          guardianIdentifier: (identifier as string).replaceAll(' ', ''),
        });
        if (checkResult.guardianList?.guardians?.length > 0) {
          isLoginAccount = true;
        }
      } catch (error: any) {
        const code = handleErrorCode(error);
        if (code?.toString() === '3002') {
          isLoginAccount = false;
        } else {
          throw handleErrorMessage(error || 'GetHolderInfo error');
        }
      }
      isHasAccount.current = isLoginAccount;
    },
    [getRegisterInfo],
  );

  const saveState = useCallback(
    (data: LoginInfo) => {
      dispatch(setLoginAccountAction(data));
    },
    [dispatch],
  );

  const onSignFinish = useCallback(
    (data: LoginInfo) => {
      setLoading(false);
      saveState(data);
      dispatch(resetGuardians());
      navigate('/register/select-verifier');
    },
    [dispatch, navigate, saveState, setLoading],
  );

  const onLoginFinish = useCallback(
    async (loginInfo: LoginInfo) => {
      try {
        setLoading(true);
        saveState({ ...loginInfo, createType: 'login' });
        dispatch(resetGuardians());
        await fetchUserVerifier({ guardianIdentifier: loginInfo.guardianAccount });
        setLoading(false);
        navigate('/login/guardian-approval');
      } catch (error) {
        const errMsg = handleErrorMessage(error, 'login error');
        message.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, fetchUserVerifier, navigate, saveState, setLoading],
  );

  const onInputFinish = useCallback(
    async (loginInfo: LoginInfo) => {
      if (isHasAccount?.current) {
        const { originChainId } = await getRegisterInfo({
          loginGuardianIdentifier: loginInfo.guardianAccount,
        });
        dispatch(setOriginChainId(originChainId));
        return onLoginFinish(loginInfo);
      }
      dispatch(setOriginChainId(DefaultChainId));
      return onSignFinish(loginInfo);
    },
    [dispatch, getRegisterInfo, onLoginFinish, onSignFinish],
  );

  const _onInputFinish = useCallback(
    (data: GuardianInputInfo) => {
      let authenticationInfo;
      if (data.accountType === LoginType[LoginType.Google]) {
        const assesToken = data?.authenticationInfo?.googleAccessToken;
        if (assesToken) authenticationInfo = { [data.identifier]: assesToken };
      } else if (data.accountType === LoginType[LoginType.Apple]) {
        const idToken = data?.authenticationInfo?.appleIdToken;
        if (idToken) authenticationInfo = { [data.identifier]: idToken };
      }
      const info = {
        guardianAccount: data.identifier,
        loginType: LoginType[data.accountType],
        authenticationInfo,
      };
      onInputFinish(info);
    },
    [onInputFinish],
  );

  const onSocialFinish: SocialLoginFinishHandler = useCallback(
    async ({ type, data }) => {
      try {
        if (!data) throw 'Action error';
        if (type === 'Google') {
          const userInfo = await getGoogleUserInfo(data?.accessToken);
          if (!userInfo?.id) throw userInfo;
          await validateIdentifier(userInfo.id);
          onInputFinish?.({
            guardianAccount: userInfo.id, // account
            loginType: LoginType[type],
            authenticationInfo: { [userInfo.id]: data?.accessToken },
            createType: isHasAccount.current ? 'login' : 'register',
          });
        } else if (type === 'Apple') {
          const userInfo = parseAppleIdentityToken(data?.accessToken);
          console.log(userInfo, data, 'onSocialSignFinish');
          if (userInfo) {
            await validateIdentifier(userInfo.userId);
            onInputFinish({
              guardianAccount: userInfo.userId, // account
              loginType: LoginType.Apple,
              authenticationInfo: { [userInfo.userId]: data?.accessToken },
              createType: isHasAccount.current ? 'login' : 'register',
            });
          } else {
            throw 'Authorization failed';
          }
        } else {
          message.error(`LoginType:${type} is not support`);
        }
      } catch (error) {
        setLoading(false);
        const msg = handleErrorMessage(error);
        message.error(msg);
      }
    },
    [onInputFinish, setLoading, validateIdentifier],
  );
  // phone country code
  const { countryCode } = useLoginInfo();

  const phoneCountry = useMemo(
    () => ({
      countryList: countryCodeList,
      country: countryCode.country.country,
    }),
    [countryCode.country.country],
  );

  const onSDKError = useCallback((error: any) => {
    console.log(error, 'error===onSDKError');
  }, []);

  // TODO will delete
  const socialLoginHandler = useCallback(
    async (v: ISocialLogin) => {
      setLoading(true);
      const result: any = await socialLoginAction(v, currentNetwork.networkType);
      console.log(result, 'result===socialLoginHandler');
      if (result.error) {
        setLoading(false);
        return { error: Error(result.message) };
      }
      return {
        data: { ...result.data, accessToken: result.data.access_token },
        error: result.error,
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentNetwork.networkType],
  );

  const socialLogin: ISocialLoginConfig = useMemo(
    () => ({
      Google: {
        clientId: '',
        customLoginHandler: () => socialLoginHandler('Google'),
      },
      Apple: {
        clientId: '',
        customLoginHandler: () => socialLoginHandler('Apple'),
      },
    }),
    [socialLoginHandler],
  );

  return (
    <div>
      <RegisterHeader />
      <div className="flex-between register-start-content">
        <div className="text-content">
          <CustomSvg type="PortKey" />
          <h1>{i18n.t('Welcome to Portkey') as string}</h1>
        </div>
        <div>
          <div className="register-start-inner">
            {type === 'create' && (
              <SignUpBase
                phoneCountry={phoneCountry}
                socialLogin={socialLogin}
                validateEmail={validateIdentifier}
                validatePhone={validateIdentifier}
                termsOfServiceUrl={`${OfficialWebsite}/terms-of-service`}
                onError={onSDKError}
                onInputFinish={_onInputFinish}
                onBack={() => navigate('/register/start')}
                onSocialSignFinish={onSocialFinish}
              />
            )}
            {type === 'scan' && <ScanCard />}
            {(!type || type === 'login') && (
              <LoginBase
                socialLogin={socialLogin}
                phoneCountry={phoneCountry}
                isShowScan
                validateEmail={validateIdentifier}
                validatePhone={validateIdentifier}
                termsOfServiceUrl={`${OfficialWebsite}/terms-of-service`}
                onInputFinish={_onInputFinish}
                onStep={(v) => navigate(`/register/start/${v === 'LoginByScan' ? 'scan' : 'create'}`)}
                onSocialLoginFinish={onSocialFinish}
                // onNetworkChange={onNetworkChange}
                onError={onSDKError}
              />
            )}
          </div>

          <div className="network-list-wrapper">
            <CommonSelect
              className="network-list-select"
              value={currentNetwork.networkType}
              items={selectItems}
              onChange={networkChange}
              showArrow={false}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
