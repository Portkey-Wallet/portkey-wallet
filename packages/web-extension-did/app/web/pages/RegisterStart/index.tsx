import CustomSvg from 'components/CustomSvg';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useNavigate, useParams } from 'react-router';
import LoginCard from './components/LoginCard';
import ScanCard from './components/ScanCard';
import SignCard from './components/SignCard';
import { useCurrentNetworkInfo, useIsMainnet, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
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
import { SocialLoginFinishHandler } from 'types/wallet';
import { getGoogleUserInfo, parseAppleIdentityToken } from '@portkey-wallet/utils/authentication';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useGetRegisterInfo } from '@portkey-wallet/hooks/hooks-ca/guardian';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import useChangeNetworkText from 'hooks/useChangeNetworkText';
import CustomModal from 'pages/components/CustomModal';
import { IconType } from 'types/icon';
import LoginModal from './components/LoginModal';
import './index.less';

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
  const [open, setOpen] = useState<boolean>();

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
      dispatch(setOriginChainId(DefaultChainId));
      saveState(data);
      dispatch(resetGuardians());
      navigate('/register/select-verifier');
      setLoading(false);
    },
    [dispatch, navigate, saveState, setLoading],
  );

  const onLoginFinish = useCallback(
    async (loginInfo: LoginInfo) => {
      try {
        setLoading(true);
        const { originChainId } = await getRegisterInfo({
          loginGuardianIdentifier: loginInfo.guardianAccount,
        });
        dispatch(setOriginChainId(originChainId));
        saveState({ ...loginInfo, createType: 'login' });
        dispatch(resetGuardians());
        await fetchUserVerifier({ guardianIdentifier: loginInfo.guardianAccount });
        setLoading(false);
        navigate('/login/guardian-approval');
      } catch (error) {
        console.log(error, 'onLoginFinish====error');
        const errMsg = handleErrorMessage(error, 'login error');
        message.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, fetchUserVerifier, getRegisterInfo, navigate, saveState, setLoading],
  );
  const loginInfoRef = useRef<LoginInfo>();
  const onInputFinish = useCallback(
    async (loginInfo: LoginInfo) => {
      loginInfoRef.current = loginInfo;
      if (isHasAccount?.current) {
        if (type === 'create') {
          setLoading(false);
          return setOpen(true);
        } else return onLoginFinish(loginInfo);
      }
      if (type === 'create') return onSignFinish(loginInfo);
      else {
        setLoading(false);
        return setOpen(true);
      }
    },
    [onLoginFinish, onSignFinish, setLoading, type],
  );

  const onSocialFinish: SocialLoginFinishHandler = useCallback(
    async ({ type, data }) => {
      try {
        if (!data) throw 'Action error';
        setLoading(true);
        if (type === 'Google') {
          const userInfo = await getGoogleUserInfo(data?.access_token);
          if (!userInfo?.id) throw userInfo;
          await validateIdentifier(userInfo.id);
          onInputFinish?.({
            guardianAccount: userInfo.id, // account
            loginType: LoginType[type],
            authenticationInfo: { [userInfo.id]: data?.access_token },
            createType: isHasAccount.current ? 'login' : 'register',
          });
        } else if (type === 'Apple') {
          const userInfo = parseAppleIdentityToken(data?.access_token);
          console.log(userInfo, data, 'onSocialSignFinish');
          if (userInfo) {
            await validateIdentifier(userInfo.userId);
            onInputFinish({
              guardianAccount: userInfo.userId, // account
              loginType: LoginType.Apple,
              authenticationInfo: { [userInfo.userId]: data?.access_token },
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
        console.log(error, 'error===onSocialSignFinish');
        const msg = handleErrorMessage(error);
        message.error(msg);
      }
    },
    [onInputFinish, setLoading, validateIdentifier],
  );

  return (
    <div id="register-start-wrapper">
      <RegisterHeader />
      <div className="flex-between register-start-content">
        <div className="text-content">
          <CustomSvg type="PortKey" />
          <h1>{i18n.t('Welcome to Portkey') as string}</h1>
        </div>
        <div>
          {type === 'create' && (
            <SignCard
              validatePhone={validateIdentifier}
              validateEmail={validateIdentifier}
              onFinish={onInputFinish}
              onSocialSignFinish={onSocialFinish}
            />
          )}
          {type === 'scan' && <ScanCard />}
          {(!type || type === 'login') && (
            <LoginCard
              validatePhone={validateIdentifier}
              validateEmail={validateIdentifier}
              onFinish={onInputFinish}
              onSocialLoginFinish={onSocialFinish}
            />
          )}
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
      <LoginModal
        open={open}
        type={type}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          if (!loginInfoRef.current) return setOpen(false);
          if (isHasAccount?.current) return onLoginFinish(loginInfoRef.current);
          onSignFinish(loginInfoRef.current);
        }}
      />
    </div>
  );
}
