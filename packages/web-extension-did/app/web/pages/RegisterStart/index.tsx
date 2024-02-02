import CustomSvg from 'components/CustomSvg';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useParams } from 'react-router';
import LoginCard from './components/LoginCard';
import ScanCard from './components/ScanCard';
import SignCard from './components/SignCard';
import { useCurrentNetworkInfo, useIsMainnet, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { createNewTmpWallet, setOriginChainId } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import CommonSelect from 'components/CommonSelect1';
import { useChangeNetwork } from 'hooks/useChangeNetwork';
import i18n from 'i18n';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { resetGuardians, setUserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { handleErrorCode, handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { Button } from 'antd';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { SocialLoginFinishHandler } from 'types/wallet';
import {
  getGoogleUserInfo,
  parseAppleIdentityToken,
  parseFacebookToken,
  parseTelegramToken,
  parseTwitterToken,
} from '@portkey-wallet/utils/authentication';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useGetRegisterInfo } from '@portkey-wallet/hooks/hooks-ca/guardian';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import useChangeNetworkText from 'hooks/useChangeNetworkText';
import CustomModal from 'pages/components/CustomModal';
import { IconType } from 'types/icon';
import LoginModal from './components/LoginModal';
import './index.less';
import { request } from '@portkey-wallet/api/api-did';
import useCheckVerifier from 'hooks/useVerifier';
import CommonModal from 'components/CommonModal';
import { useTranslation } from 'react-i18next';
import { OperationTypeEnum, VerifierItem, VerifyStatus } from '@portkey-wallet/types/verifier';
import { AssignVerifierLoading } from '@portkey-wallet/constants/constants-ca/wallet';
import { useSocialVerify } from 'pages/GuardianApproval/hooks/useSocialVerify';
import { getStoreState } from 'store/utils/getStore';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { verification } from 'utils/api';
import { setCurrentGuardianAction, setUserGuardianItemStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TVerifierAccountLocationState } from 'types/router';

export default function RegisterStart() {
  const { type } = useParams();
  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();
  const changeNetwork = useChangeNetwork();
  const navigate = useNavigateState<TVerifierAccountLocationState>();
  const { setLoading } = useLoading();
  const fetchUserVerifier = useGuardianList();
  const changeNetworkModalText = useChangeNetworkText();
  const isMainnet = useIsMainnet();
  const [open, setOpen] = useState<boolean>();
  const { t } = useTranslation();

  const networkList = useNetworkList();

  const netWorkIcon: Record<NetworkType, IconType> = useMemo(
    () => ({
      MAINNET: 'Aelf',
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
      // update page data
      loginAccountRef.current = data;
      setLoginAccount(data);
      // update store data
      dispatch(setLoginAccountAction(data));
    },
    [dispatch],
  );

  const [openSendVerifyCode, setOpenSendVerifyCode] = useState<boolean>(false);
  const [verifierItem, setVerifierItem] = useState<VerifierItem>({
    id: '',
    name: '',
    imageUrl: '',
  });
  const loginAccountRef = useRef<LoginInfo>();
  const [loginAccount, setLoginAccount] = useState<LoginInfo>();
  const [checkAuth, sendVerifyCodeHandler] = useCheckVerifier();

  // According to the login type, execute different verifier judgment logic
  const confirmRegisterOrLogin = useCallback(
    async (data: LoginInfo, verifierItem: VerifierItem) => {
      switch (data?.loginType) {
        case LoginType.Apple:
        case LoginType.Google:
        case LoginType.Telegram:
        case LoginType.Twitter:
        case LoginType.Facebook:
          checkAuth(verifierItem, data);
          break;
        default:
          setOpenSendVerifyCode(true);
          break;
      }
    },
    [checkAuth],
  );

  const onSignFinish = useCallback(
    async (data: LoginInfo) => {
      dispatch(createNewTmpWallet());
      dispatch(setOriginChainId(DefaultChainId));
      saveState(data);
      dispatch(resetGuardians());

      setLoading(true, AssignVerifierLoading);

      await sleep(2000);

      dispatch(createNewTmpWallet);

      // Get the assigned verifier data from the backend api and guaranteed loading display 2s
      try {
        const verifierReq = await request.verify.getVerifierServer({
          params: {
            chainId: DefaultChainId,
          },
        });
        setLoading(false);

        setVerifierItem(verifierReq);
        confirmRegisterOrLogin(data, verifierReq);
      } catch (error) {
        setLoading(false);
        singleMessage.error(handleErrorMessage(error, 'Get verifier failed'));
        throw handleErrorMessage(error, 'Get verifier failed');
      }
    },
    [confirmRegisterOrLogin, dispatch, saveState, setLoading],
  );

  const sendVerifyCode = useCallback(
    async (item: UserGuardianItem, originChainId: ChainId) => {
      try {
        setLoading(true);

        if (
          !loginAccountRef.current ||
          !LoginType[loginAccountRef.current.loginType] ||
          !loginAccountRef.current.guardianAccount
        ) {
          throw 'User registration information is invalid, please fill in the registration method again';
        }

        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: item?.guardianAccount,
            type: LoginType[item.guardianType],
            verifierId: item.verifier?.id || '',
            chainId: originChainId,
            operationType: OperationTypeEnum.communityRecovery,
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

          navigate('/login/verifier-account', {
            state: {
              previousPage: FromPageEnum.login,
            },
          });
        }
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        const _error = handleErrorMessage(error);
        singleMessage.error(_error);
      }
    },
    [dispatch, navigate, setLoading],
  );

  const socialVerify = useSocialVerify();
  const onLoginFinish = useCallback(
    async (loginInfo: LoginInfo) => {
      try {
        setLoading(true);
        dispatch(createNewTmpWallet());
        const { originChainId } = await getRegisterInfo({
          loginGuardianIdentifier: loginInfo.guardianAccount,
        });
        dispatch(setOriginChainId(originChainId));
        saveState({ ...loginInfo, createType: 'login' });
        dispatch(resetGuardians());
        await fetchUserVerifier({ guardianIdentifier: loginInfo.guardianAccount });

        const userGuardianStatus = getStoreState().guardians.userGuardianStatus;
        const userGuardianStatusList = Object.values(userGuardianStatus ?? {});
        // Google and Apple login-accounts will automatically login
        const autoVerifiedList = userGuardianStatusList
          .filter(
            (guardian) =>
              guardian.isLoginAccount &&
              guardian.guardianAccount === loginInfo.guardianAccount &&
              [LoginType.Google, LoginType.Apple, LoginType.Telegram, LoginType.Twitter, LoginType.Facebook].includes(
                guardian.guardianType,
              ),
          )
          .map((item) =>
            socialVerify({
              operateGuardian: item,
              originChainId,
              loginAccount: loginInfo,
              operationType: OperationTypeEnum.communityRecovery,
            }),
          );
        if (!userGuardianStatus) throw "Can't get user guardianlist";

        const _userGuardianStatus = { ...userGuardianStatus };
        (await Promise.all(autoVerifiedList)).forEach((guardian) => {
          const key = guardian?.key;

          if (!key) return;
          const userGuardian = _userGuardianStatus[key];

          if (guardian && userGuardian) {
            _userGuardianStatus[key] = { ...userGuardian, ...guardian };
          }
        });

        dispatch(setUserGuardianStatus(_userGuardianStatus));

        if (
          userGuardianStatusList.length === 1 &&
          [LoginType.Email, LoginType.Phone].includes(userGuardianStatusList[0].guardianType)
        ) {
          await sendVerifyCode(userGuardianStatusList[0], originChainId);
        } else {
          navigate('/login/guardian-approval');
        }
        setLoading(false);
      } catch (error) {
        console.log(error, 'onLoginFinish====error');
        const errMsg = handleErrorMessage(error, 'login error');
        singleMessage.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, fetchUserVerifier, getRegisterInfo, navigate, saveState, sendVerifyCode, setLoading, socialVerify],
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
        let userId = '';
        if (type === 'Google') {
          const userInfo = await getGoogleUserInfo(data?.access_token);
          userId = userInfo.id;
        } else if (type === 'Apple') {
          const userInfo = parseAppleIdentityToken(data?.access_token);
          userId = userInfo?.userId || '';
        } else if (type === 'Telegram') {
          const userInfo = parseTelegramToken(data?.access_token);
          if (!userInfo) throw 'Telegram auth error';
          userId = userInfo?.userId;
        } else if (type === 'Twitter') {
          const userInfo = parseTwitterToken(data?.access_token);
          if (!userInfo) throw 'Twitter auth error';
          const { userId: _userId } = userInfo;
          userId = _userId;
        } else if (type === 'Facebook') {
          const userInfo = await parseFacebookToken(data?.access_token);
          if (!userInfo) throw 'Telegram auth error';
          const { userId: _userId } = userInfo;
          userId = _userId;
        } else {
          throw `LoginType:${type} is not support`;
        }
        if (!userId) throw 'Authorization failed';

        await validateIdentifier(userId);

        onInputFinish?.({
          guardianAccount: userId, // account
          loginType: LoginType[type],
          authenticationInfo: { [userId]: data?.access_token },
          createType: isHasAccount.current ? 'login' : 'register',
        });
      } catch (error) {
        setLoading(false);
        console.log(error, 'error===onSocialSignFinish');
        const msg = handleErrorMessage(error);
        singleMessage.error(msg);
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
          setOpen(false);
        }}
      />
      {loginAccount && (
        <CommonModal
          className="verify-confirm-modal"
          closable={false}
          open={openSendVerifyCode}
          width={320}
          onCancel={() => setOpenSendVerifyCode(false)}>
          <p className="modal-content">
            {`${t('verificationCodeTip1', { verifier: verifierItem?.name })} `}
            <strong>{loginAccount.guardianAccount}</strong>
            {` ${t('verificationCodeTip2', { type: LoginType[loginAccount.loginType] })}`}
          </p>
          <div className="btn-wrapper">
            <Button onClick={() => setOpenSendVerifyCode(false)}>{t('Cancel')}</Button>
            <Button type="primary" onClick={() => sendVerifyCodeHandler(verifierItem, loginAccountRef.current)}>
              {t('Confirm')}
            </Button>
          </div>
        </CommonModal>
      )}
    </div>
  );
}
