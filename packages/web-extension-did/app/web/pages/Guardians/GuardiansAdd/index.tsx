import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
  setUserGuardianItemStatus,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import { Input, Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useGuardiansInfo, useLoading, useWalletInfo } from 'store/Provider/hooks';
import { EmailReg } from '@portkey-wallet/utils/reg';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import CustomSelect from 'pages/components/CustomSelect';
import useGuardianList from 'hooks/useGuardianList';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { StoreUserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { useTranslation } from 'react-i18next';
import { verification } from 'utils/api';
import PhoneInput from '../components/PhoneInput';
import { EmailError } from '@portkey-wallet/utils/check';
import { guardianTypeList, phoneInit, socialInit } from 'constants/guardians';
import { IGuardianType, IPhoneInput, ISocialInput } from 'types/guardians';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import {
  getGoogleUserInfo,
  parseAppleIdentityToken,
  parseFacebookToken,
  parseTelegramToken,
  parseTwitterToken,
} from '@portkey-wallet/utils/authentication';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { request } from '@portkey-wallet/api/api-did';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { handleVerificationDoc } from '@portkey-wallet/utils/guardian';
import { OperationTypeEnum, VerifyStatus } from '@portkey-wallet/types/verifier';
import verificationApiConfig from '@portkey-wallet/api/api-did/verification';
import GuardianAddPrompt from './Prompt';
import GuardianAddPopup from './Popup';
import CustomModal from '../../components/CustomModal';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import { getVerifierStatusMap, guardianAccountIsExist } from '../utils';
import OptionTip from '../components/SelectOptionTip';
import { guardianExistTip, verifierExistTip } from '@portkey-wallet/constants/constants-ca/guardian';
import singleMessage from 'utils/singleMessage';
import { usePromptLocationParams, useNavigateState } from 'hooks/router';
import {
  FromPageEnum,
  TAddGuardianLocationSearch,
  TAddGuardianLocationState,
  TGuardianApprovalLocationState,
  TVerifierAccountLocationState,
} from 'types/router';
import BaseGuardianTypeIcon from 'components/BaseGuardianTypeIcon';
import { useLoginModeList } from 'hooks/loginModal';
import { LOGIN_TYPE_LABEL_MAP } from '@portkey-wallet/constants/verifier';
import './index.less';

export default function AddGuardian() {
  const navigate = useNavigateState<TVerifierAccountLocationState | TGuardianApprovalLocationState>();
  const { t } = useTranslation();
  const { locationParams } = usePromptLocationParams<TAddGuardianLocationState, TAddGuardianLocationSearch>();
  const { verifierMap, userGuardiansList, opGuardian } = useGuardiansInfo();
  const verifierStatusMap = useMemo(
    () => getVerifierStatusMap(verifierMap, userGuardiansList),
    [userGuardiansList, verifierMap],
  );
  const guardiansSaveRef = useRef({ verifierMap, userGuardiansList });
  guardiansSaveRef.current = { verifierMap, userGuardiansList };
  const [guardianType, setGuardianType] = useState<LoginType>();
  const [verifierVal, setVerifierVal] = useState<string>();
  const [verifierName, setVerifierName] = useState<string>();
  const [emailVal, setEmailVal] = useState<string>();
  const [phoneValue, setPhoneValue] = useState<IPhoneInput>();
  const [socialValue, setSocialVale] = useState<ISocialInput>();
  const [accountErr, setAccountErr] = useState<string>();
  const [verifierExist, setVerifierExist] = useState<boolean>(false);
  const [curKey, setCurKey] = useState<string>('');
  const [accountShow, setAccountShow] = useState<string>('');
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const userGuardianList = useGuardianList();
  const { isNotLessThan768 } = useCommonState();
  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const { currentNetwork } = useWalletInfo();
  const accelerateChainId = useMemo(
    () => locationParams?.accelerateChainId || originChainId,
    [locationParams?.accelerateChainId, originChainId],
  );
  const loginModeList = useLoginModeList();
  const selectGuardianList = useMemo(() => {
    return loginModeList
      ?.map((i) => guardianTypeList.find((v) => LOGIN_TYPE_LABEL_MAP[v.value] === i.type?.value))
      .filter((i) => !!i) as IGuardianType[];
  }, [loginModeList]);

  const disabled = useMemo(() => {
    let check = true;
    if (verifierVal) {
      switch (guardianType) {
        case LoginType.Email: {
          check = !emailVal;
          break;
        }
        case LoginType.Phone: {
          check = !phoneValue?.phoneNumber;
          break;
        }
        case LoginType.Apple:
        case LoginType.Telegram:
        case LoginType.Twitter:
        case LoginType.Facebook:
        case LoginType.Google: {
          check = !(socialValue?.id || socialValue?.value);
          break;
        }
        default:
          check = true;
      }
    }
    return check || verifierExist || !!accountErr;
  }, [
    verifierVal,
    verifierExist,
    accountErr,
    guardianType,
    emailVal,
    phoneValue?.phoneNumber,
    socialValue?.id,
    socialValue?.value,
  ]);

  const selectVerifierItem = useMemo(() => verifierMap?.[verifierVal || ''], [verifierMap, verifierVal]);

  const verifierOptions = useMemo(
    () =>
      Object.values(verifierStatusMap ?? {})?.map((item) => ({
        value: item.id,
        children: (
          <div className={clsx(['flex', 'select-option', item.isUsed && 'no-use'])}>
            <BaseVerifierIcon fallback={item.name[0]} src={item.imageUrl} />
            <span className="title">{item.name}</span>
          </div>
        ),
        disabled: item.isUsed,
      })),
    [verifierStatusMap],
  );

  const guardianTypeOptions = useMemo(
    () =>
      (selectGuardianList.length ? selectGuardianList : guardianTypeList)?.map((item) => ({
        value: item.value,
        children: (
          <div className="flex select-option">
            <BaseGuardianTypeIcon type={item.icon} />
            <span className="title">{item.label}</span>
          </div>
        ),
      })),
    [selectGuardianList],
  );

  const isPhoneType = useMemo(() => guardianType === LoginType.Phone, [guardianType]);

  useEffect(() => {
    let key = '',
      tempAccount = '';
    switch (guardianType) {
      case LoginType.Email: {
        key = `${emailVal}&${verifierVal}`;
        tempAccount = `${emailVal}`;
        break;
      }
      case LoginType.Phone: {
        key = `+${phoneValue?.code}${phoneValue?.phoneNumber}&${verifierVal}`;
        tempAccount = `+${phoneValue?.code} ${phoneValue?.phoneNumber}`;
        break;
      }
      case LoginType.Apple:
      case LoginType.Telegram:
      case LoginType.Twitter:
      case LoginType.Facebook:
      case LoginType.Google: {
        key = `${socialValue?.id}&${verifierVal}`;
        tempAccount = `${socialValue?.value}`;
        break;
      }
    }
    setAccountShow(tempAccount);
    setCurKey(key);
  }, [emailVal, guardianType, phoneValue, socialValue, verifierVal]);

  useEffectOnce(() => {
    if (locationParams?.previousPage && opGuardian) {
      setGuardianType(opGuardian.guardianType);
      setVerifierVal(opGuardian.verifier?.id);
      setVerifierName(opGuardian.verifier?.name);

      switch (opGuardian.guardianType) {
        case LoginType.Email:
          setEmailVal(opGuardian.guardianAccount);
          break;
        case LoginType.Phone:
          setPhoneValue(opGuardian.phone || phoneInit);
          break;
        case LoginType.Google:
        case LoginType.Apple:
        case LoginType.Telegram:
        case LoginType.Twitter:
        case LoginType.Facebook:
          setSocialVale(opGuardian.social);
          break;
      }
    }
  });

  const guardianTypeChange = useCallback((value: LoginType) => {
    setVerifierExist(false);
    setGuardianType(value);
    setEmailVal('');
    setPhoneValue(phoneInit);
    setSocialVale(socialInit);
    setAccountErr('');
  }, []);

  const verifierChange = useCallback(
    (value: string) => {
      setVerifierVal(value);
      setVerifierName(verifierMap?.[value]?.name);
      setVerifierExist(false);
    },
    [verifierMap],
  );

  const handleEmailInputChange = useCallback((v: string) => {
    setAccountErr('');
    setVerifierExist(false);
    setEmailVal(v);
  }, []);

  const handlePhoneInputChange = useCallback(({ code, phoneNumber }: IPhoneInput) => {
    setPhoneValue({ code, phoneNumber });
  }, []);

  const handleSocialAuth = useCallback(
    async (v: ISocialLogin) => {
      try {
        setLoading(true);
        const result = await socialLoginAction(v, currentNetwork);
        const data = result.data;
        if (!data) throw 'auth error';
        if (v === 'Google') {
          const userInfo = await getGoogleUserInfo(data?.access_token);
          const { firstName, email, id } = userInfo;
          setSocialVale({ name: firstName, value: email, id, accessToken: data?.access_token });
        } else if (v === 'Apple') {
          const userInfo = parseAppleIdentityToken(data?.access_token);
          if (userInfo) {
            const appleUserExtraInfo = await request.verify.getAppleUserExtraInfo({
              url: `${verificationApiConfig.getAppleUserExtraInfo.target}/${userInfo.userId}`,
            });
            const { email, userId } = userInfo;
            const { firstName, isPrivate } = appleUserExtraInfo;
            setSocialVale({
              name: firstName,
              value: email,
              id: userId,
              accessToken: data?.access_token,
              isPrivate: isPrivate,
            });
          }
        } else if (v === 'Telegram') {
          const userInfo = parseTelegramToken(data?.access_token);
          if (!userInfo) throw 'Telegram auth error';
          const { firstName, userId } = userInfo;
          setSocialVale({
            name: firstName,
            value: '',
            id: userId,
            accessToken: data?.access_token,
            isPrivate: true,
          });
        } else if (v === 'Twitter') {
          const userInfo = parseTwitterToken(data?.access_token);
          if (!userInfo) throw 'Twitter auth error';
          const { firstName, userId, accessToken } = userInfo;
          setSocialVale({
            name: firstName,
            value: '',
            id: userId,
            accessToken,
            isPrivate: true,
          });
        } else if (v === 'Facebook') {
          const userInfo = await parseFacebookToken(data?.access_token);
          if (!userInfo) throw 'Telegram auth error';
          const { firstName, userId, accessToken } = userInfo;
          setSocialVale({
            name: firstName,
            value: '',
            id: userId,
            accessToken,
            isPrivate: true,
          });
        } else {
          singleMessage.error(`type:${v} is not support`);
        }
        if (result.error) throw result.message ?? result.Error;
      } catch (error) {
        setLoading(false);
        const msg = handleErrorMessage(error);
        singleMessage.error(msg);
      }
      setLoading(false);
    },
    [currentNetwork, setLoading],
  );

  const handleClearSocialAccount = useCallback(() => {
    setSocialVale(socialInit);
    setAccountErr('');
  }, []);

  const renderSocialGuardianAccount = useCallback(
    (v: ISocialLogin) => (
      <div className="social">
        {socialValue?.id ? (
          <div className="flex-column social-input detail">
            <span className="name">{socialValue.name}</span>
            <span className="email">{socialValue.isPrivate ? '******' : socialValue.value}</span>
            <CustomSvg type="Close4" onClick={handleClearSocialAccount} />
          </div>
        ) : (
          <div className="flex social-input click" onClick={() => handleSocialAuth(v)}>
            <span className="click-text">{`Click Add ${v} Account`}</span>
          </div>
        )}
      </div>
    ),
    [handleClearSocialAccount, handleSocialAuth, socialValue],
  );

  const renderGuardianAccount = useMemo(
    () => ({
      [LoginType.Email]: {
        element: (
          <Input
            className="login-input"
            value={emailVal}
            placeholder={t('Enter email')}
            onChange={(e) => {
              handleEmailInputChange(e.target.value);
            }}
          />
        ),
        label: t('Guardian Email'),
      },
      [LoginType.Phone]: {
        element: (
          <PhoneInput code={phoneValue?.code} phoneNumber={phoneValue?.phoneNumber} onChange={handlePhoneInputChange} />
        ),
        label: t('Guardian Phone'),
      },
      [LoginType.Google]: {
        element: renderSocialGuardianAccount('Google'),
        label: t('Guardian Google'),
      },
      [LoginType.Apple]: {
        element: renderSocialGuardianAccount('Apple'),
        label: t('Guardian Apple'),
      },
      [LoginType.Telegram]: {
        element: renderSocialGuardianAccount('Telegram'),
        label: t('Guardian Telegram'),
      },
      [LoginType.Twitter]: {
        element: renderSocialGuardianAccount('Twitter'),
        label: t('Guardian Twitter'),
      },
      [LoginType.Facebook]: {
        element: renderSocialGuardianAccount('Facebook'),
        label: t('Guardian Facebook'),
      },
    }),
    [
      emailVal,
      handleEmailInputChange,
      handlePhoneInputChange,
      phoneValue?.code,
      phoneValue?.phoneNumber,
      renderSocialGuardianAccount,
      t,
    ],
  );

  const handleCommonVerify = useCallback(
    async (guardianAccount: string) => {
      try {
        dispatch(
          setLoginAccountAction({
            guardianAccount,
            loginType: guardianType as LoginType,
          }),
        );
        setLoading(true);
        dispatch(resetUserGuardianStatus());
        await userGuardianList({ caHash: walletInfo.caHash });

        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: guardianAccount,
            type: LoginType[guardianType as LoginType],
            verifierId: selectVerifierItem?.id || '',
            chainId: currentChain?.chainId || originChainId,
            operationType: OperationTypeEnum.addGuardian,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          const newGuardian: StoreUserGuardianItem = {
            isLoginAccount: false,
            verifier: selectVerifierItem,
            guardianAccount,
            guardianType: guardianType as LoginType,
            verifierInfo: {
              sessionId: result.verifierSessionId,
              endPoint: result.endPoint,
            },
            key: curKey,
            isInitStatus: true,
            identifierHash: '',
            salt: '',
            phone: phoneValue,
            social: socialValue,
          };
          dispatch(setCurrentGuardianAction(newGuardian));
          dispatch(setOpGuardianAction(newGuardian));
          navigate('/setting/guardians/verifier-account', {
            state: {
              previousPage: FromPageEnum.guardiansAdd,
              accelerateChainId: accelerateChainId,
            },
          });
        }
      } catch (error) {
        setLoading(false);
        console.log('---add-guardian-send-code', error);
        const _error = handleErrorMessage(error);
        singleMessage.error(_error);
      }
    },
    [
      dispatch,
      guardianType,
      setLoading,
      userGuardianList,
      walletInfo.caHash,
      selectVerifierItem,
      currentChain?.chainId,
      originChainId,
      curKey,
      phoneValue,
      socialValue,
      navigate,
      accelerateChainId,
    ],
  );

  const handleSocialVerify = useCallback(async () => {
    try {
      setLoading(true);
      dispatch(resetUserGuardianStatus());
      await userGuardianList({ caHash: walletInfo.caHash });
      dispatch(
        setLoginAccountAction({
          guardianAccount: walletInfo.managerInfo?.loginAccount || '',
          loginType: walletInfo.managerInfo?.type || LoginType.Email,
        }),
      );
      const newGuardian: StoreUserGuardianItem = {
        isLoginAccount: false,
        verifier: selectVerifierItem,
        guardianAccount: socialValue?.id || '',
        guardianType: guardianType as LoginType,
        firstName: socialValue?.name,
        thirdPartyEmail: socialValue?.value,
        key: curKey,
        isInitStatus: true,
        identifierHash: '',
        salt: '',
        phone: phoneValue,
        social: socialValue,
      };
      dispatch(setCurrentGuardianAction(newGuardian));
      dispatch(setOpGuardianAction(newGuardian));
      const params = {
        verifierId: verifierVal,
        chainId: currentChain?.chainId || originChainId,
        accessToken: socialValue?.accessToken,
        operationType: OperationTypeEnum.addGuardian,
      };
      let res;
      if (guardianType === LoginType.Apple) {
        res = await request.verify.verifyAppleToken({
          params,
        });
      } else if (guardianType === LoginType.Google) {
        res = await request.verify.verifyGoogleToken({
          params,
        });
      } else if (guardianType === LoginType.Telegram) {
        res = await request.verify.verifyTelegramToken({
          params,
        });
      } else if (guardianType === LoginType.Twitter) {
        res = await request.verify.verifyTwitterToken({
          params,
        });
      } else if (guardianType === LoginType.Facebook) {
        res = await request.verify.verifyFacebookToken({
          params,
        });
      }
      const { guardianIdentifier } = handleVerificationDoc(res.verificationDoc);
      dispatch(
        setUserGuardianItemStatus({
          key: curKey,
          status: VerifyStatus.Verified,
          signature: res.signature,
          verificationDoc: res.verificationDoc,
          identifierHash: guardianIdentifier,
        }),
      );
      navigate('/setting/guardians/guardian-approval', {
        state: {
          previousPage: FromPageEnum.guardiansAdd,
          accelerateChainId,
        },
      });
    } catch (error) {
      const msg = handleErrorMessage(error);
      singleMessage.error(msg);
    } finally {
      setLoading(false);
    }
  }, [
    originChainId,
    curKey,
    currentChain,
    dispatch,
    guardianType,
    navigate,
    phoneValue,
    selectVerifierItem,
    setLoading,
    socialValue,
    userGuardianList,
    verifierVal,
    walletInfo,
    accelerateChainId,
  ]);

  const handleVerify = useCallback(async () => {
    if (guardianType === LoginType.Email) {
      handleCommonVerify(emailVal || '');
    } else if (guardianType === LoginType.Phone) {
      handleCommonVerify(`+${phoneValue?.code}${phoneValue?.phoneNumber}`);
    } else {
      singleMessage.info('router error');
    }
  }, [emailVal, guardianType, handleCommonVerify, phoneValue]);

  const handleBack = useCallback(() => {
    dispatch(setOpGuardianAction());
    navigate('/setting/guardians');
  }, [dispatch, navigate]);

  const checkAccountIsExist = useCallback(() => {
    if (guardianType === LoginType.Email)
      return guardianAccountIsExist({ guardianType, guardianAccount: emailVal || '' }, userGuardiansList);

    if (guardianType === LoginType.Phone)
      return guardianAccountIsExist(
        { guardianType, guardianAccount: `+${phoneValue?.code}${phoneValue?.phoneNumber}` },
        userGuardiansList,
      );

    if (
      [LoginType.Apple, LoginType.Google, LoginType.Telegram, LoginType.Twitter, LoginType.Facebook].includes(
        guardianType as LoginType,
      )
    )
      return guardianAccountIsExist(
        { guardianType: guardianType as LoginType, guardianAccount: socialValue?.id || '' },
        userGuardiansList,
      );

    return false;
  }, [emailVal, guardianType, phoneValue?.code, phoneValue?.phoneNumber, socialValue?.id, userGuardiansList]);

  const handleCheck = useCallback(async () => {
    // 1、check email
    if (guardianType === LoginType.Email) {
      if (!EmailReg.test(emailVal as string)) {
        setAccountErr(EmailError.invalidEmail);
        return;
      }
    }
    // 2、check verifier
    if (!selectVerifierItem) return singleMessage.error('Can not get the current verifier message');

    // 3、check account is exist
    if (checkAccountIsExist()) {
      setAccountErr(guardianExistTip);
      return;
    }
    // 4、check verifier is exist
    try {
      setLoading(true);
      await userGuardianList({ caHash: walletInfo.caHash });
      setLoading(false);
    } catch (error) {
      console.log('===guardian add userGuardianList error', error);
      setLoading(false);
    }
    const { verifierMap, userGuardiansList } = guardiansSaveRef.current;
    const _verifierStatusMap = getVerifierStatusMap(verifierMap, userGuardiansList);
    const _verifierIsExist = Object.values(_verifierStatusMap).some(
      (verifier) => verifier.id === selectVerifierItem.id && verifier.isUsed,
    );
    setVerifierExist(_verifierIsExist);
    if (_verifierIsExist) return;

    if (
      [LoginType.Google, LoginType.Apple, LoginType.Telegram, LoginType.Twitter, LoginType.Facebook].includes(
        guardianType as LoginType,
      )
    ) {
      handleSocialVerify();
    } else {
      CustomModal({
        type: 'confirm',
        content: (
          <p>
            {`${verifierName} will send a verification code to `}
            <strong>{accountShow}</strong>
            {` to verify your ${isPhoneType ? 'phone number' : 'email address'}.`}
          </p>
        ),
        onOk: handleVerify,
        okText: 'Confirm',
      });
    }
  }, [
    guardianType,
    selectVerifierItem,
    checkAccountIsExist,
    emailVal,
    setLoading,
    userGuardianList,
    walletInfo.caHash,
    handleSocialVerify,
    verifierName,
    accountShow,
    isPhoneType,
    handleVerify,
  ]);

  const headerTitle = useMemo(() => 'Add Guardians', []);
  const renderContent = useMemo(
    () => (
      <div className="add-guardian-body flex-column-between flex-1">
        <div className="content-wrap">
          <div className="input-item">
            <p className="label">{t('Guardian Type')}</p>
            <CustomSelect
              className="select"
              value={guardianType}
              placeholder={t('Select guardian types')}
              onChange={guardianTypeChange}
              items={guardianTypeOptions}
            />
          </div>
          {guardianType !== undefined && (
            <div className="input-item">
              <p className="label">{renderGuardianAccount[guardianType].label}</p>
              {renderGuardianAccount[guardianType].element}
              {accountErr && <span className="err-text">{accountErr}</span>}
            </div>
          )}
          <div className="input-item">
            <p className="label">{t('Verifier')}</p>
            <CustomSelect
              className="select"
              value={verifierVal}
              placeholder={t('Select guardian verifiers')}
              onChange={verifierChange}
              items={verifierOptions}
              customChild={OptionTip()}
            />
            {verifierExist && <div className="error">{verifierExistTip}</div>}
          </div>
        </div>
        <div className="btn-wrap">
          <Button type="primary" onClick={handleCheck} disabled={disabled}>
            {t('Confirm')}
          </Button>
        </div>
      </div>
    ),
    [
      accountErr,
      disabled,
      guardianType,
      guardianTypeChange,
      guardianTypeOptions,
      handleCheck,
      renderGuardianAccount,
      t,
      verifierChange,
      verifierExist,
      verifierOptions,
      verifierVal,
    ],
  );
  const props = useMemo(
    () => ({ headerTitle, renderContent, onBack: handleBack }),
    [handleBack, headerTitle, renderContent],
  );

  return isNotLessThan768 ? <GuardianAddPrompt {...props} /> : <GuardianAddPopup {...props} />;
}
