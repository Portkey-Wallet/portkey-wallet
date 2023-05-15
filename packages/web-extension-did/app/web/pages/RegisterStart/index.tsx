import CustomSvg from 'components/CustomSvg';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useNavigate } from 'react-router';
import { useCurrentNetworkInfo, useIsMainnet, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useLoading, useLoginInfo, useUserInfo } from 'store/Provider/hooks';
import { setCAInfoType, setOriginChainId } from '@portkey-wallet/store/store-ca/wallet/actions';
import { NetworkType } from '@portkey-wallet/types';
import CommonSelect from 'components/CommonSelect1';
import { useChangeNetwork } from 'hooks/useChangeNetwork';
import i18n from 'i18n';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { setLoginAccountAction, setWalletInfoAction } from 'store/reducers/loginCache/actions';
import { resetGuardians } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import { DefaultChainId, OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import useChangeNetworkText from 'hooks/useChangeNetworkText';
import CustomModal from 'pages/components/CustomModal';
import { IconType } from 'types/icon';
import { CreateWalletType, DIDWalletInfo, SignInSuccess, SignUpAndLogin } from '@portkey/did-ui-react';
import { countryCodeList } from '@portkey-wallet/constants/constants-ca/country';
import { ChainId } from '@portkey/types';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import LoginModal from './components/LoginModal';
import './index.less';

export default function RegisterStart() {
  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();
  const changeNetwork = useChangeNetwork();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const fetchUserVerifier = useGuardianList();
  const changeNetworkModalText = useChangeNetworkText();
  const isMainnet = useIsMainnet();
  const [open, setOpen] = useState<boolean>();
  const [createType, setCreateType] = useState<CreateWalletType>('Login');

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

  const saveState = useCallback(
    (data: LoginInfo) => {
      dispatch(setLoginAccountAction(data));
    },
    [dispatch],
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

  const signInSuccessRef = useRef<SignInSuccess>();

  const finished = useCallback(async () => {
    try {
      setLoading(true);
      if (!signInSuccessRef.current) throw 'Missing info when finshed';
      const info = signInSuccessRef.current;
      const token = info.authenticationInfo?.googleAccessToken || info.authenticationInfo?.appleIdToken;
      const data: LoginInfo = {
        guardianAccount: info.identifier,
        loginType: LoginType[info.accountType],
        createType: 'login',
      };
      if (token)
        data.authenticationInfo = {
          [info.identifier]: token,
        };
      if (info.isLoginIdentifier) {
        dispatch(setOriginChainId(info.chainId));
        saveState(data);
        dispatch(resetGuardians());
        await fetchUserVerifier({ guardianIdentifier: info.identifier });
        navigate('/login/guardian-approval');
      } else {
        dispatch(setOriginChainId(DefaultChainId));
        saveState(data);
        dispatch(resetGuardians());
        navigate('/register/select-verifier');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(handleErrorMessage(error));
    }
  }, [dispatch, fetchUserVerifier, navigate, saveState, setLoading]);

  const onSuccess = useCallback(
    async (info: SignInSuccess) => {
      signInSuccessRef.current = info;
      if (info.isLoginIdentifier && createType !== 'Login') {
        setLoading(false);
        return setOpen(true);
      }
      if (!info.isLoginIdentifier && createType !== 'SignUp') {
        setLoading(false);
        return setOpen(true);
      }
      finished();
    },
    [createType, finished, setLoading],
  );

  const onOriginChainIdChange = useCallback(
    (chainId?: ChainId | undefined) => {
      chainId && dispatch(setOriginChainId(chainId));
    },
    [dispatch],
  );

  const { passwordSeed: pin } = useUserInfo();

  const onLoginFinishWithoutPin = useCallback(
    (info: Omit<DIDWalletInfo, 'pin'>) => {
      const { caInfo, chainId, walletInfo, accountInfo } = info || {};
      if (caInfo && walletInfo && chainId) {
        const managerInfo = {
          managerUniqueId: accountInfo.managerUniqueId,
          loginAccount: accountInfo.guardianIdentifier,
          type: LoginType[accountInfo.accountType],
          verificationType: VerificationType.addManager,
        };
        if (pin) {
          try {
            dispatch(
              setCAInfoType({
                caInfo: {
                  originChainId: chainId,
                  managerInfo,
                },
                pin,
              }),
            );
            navigate('/success-page/login');
          } catch (error: any) {
            message.error(error);
          }
        } else {
          dispatch(setOriginChainId(chainId));
          dispatch(
            setWalletInfoAction({
              walletInfo: walletInfo,
              caWalletInfo: {
                originChainId: chainId,
                managerInfo,
                [chainId]: caInfo,
              },
            }),
          );
          navigate('/login/set-pin/scan');
        }
      }
    },
    [dispatch, navigate, pin],
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
          <div className="register-start-inner">
            <SignUpAndLogin
              phoneCountry={phoneCountry}
              onError={onSDKError}
              isShowScan
              defaultChainId={DefaultChainId}
              isErrorTip
              onSuccess={onSuccess}
              onSignTypeChange={setCreateType}
              onChainIdChange={onOriginChainIdChange}
              onLoginFinishWithoutPin={onLoginFinishWithoutPin}
              termsOfService={`${OfficialWebsite}/terms-of-service`}
            />
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
      <LoginModal
        open={open}
        type={createType}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          if (!signInSuccessRef.current) return setOpen(false);
          const createType = signInSuccessRef.current.isLoginIdentifier ? 'Login' : 'SignUp';
          setCreateType(createType);
          finished();
        }}
      />
    </div>
  );
}
