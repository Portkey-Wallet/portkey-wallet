import CustomSvg, { SvgType } from 'components/CustomSvg';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RegisterType, SocialLoginFinishHandler, VerifyTypeEnum } from 'types/wallet';
import DividerCenter from '../DividerCenter';
import SocialContent from '../SocialContent';
import TermsOfServiceItem from '../TermsOfServiceItem';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { useLoading, useWalletInfo } from 'store/Provider/hooks';
import { ISocialLogin, LoginType, SocialLoginEnum } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import './index.less';
import clsx from 'clsx';
import { useGetFormattedLoginModeList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLatestRef } from '@portkey-wallet/hooks';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { useEntranceConfig } from 'hooks/cms';
import { LOGIN_TYPE_LABEL_MAP } from '@portkey-wallet/constants/verifier';
import { zkloginGuardianType } from 'constants/guardians';

export type LoginGuardianListType = {
  icon: SvgType;
  type: string;
  value: LoginType;
  onClick: () => void;
};

export default function SocialLogin({
  type,
  onBack,
  onFinish,
  onSocialStart,
  switchLogin,
}: {
  type: RegisterType;
  onBack?: () => void;
  onFinish: SocialLoginFinishHandler;
  onSocialStart: (type: ISocialLogin) => void;
  switchLogin?: (type: 'Email' | 'Phone') => void;
}) {
  const navigate = useNavigateState();
  const { t } = useTranslation();
  const isMainnet = useIsMainnet();
  const { currentNetwork } = useWalletInfo();
  const { setLoading } = useLoading();
  const config = useEntranceConfig();
  const { loginModeListToRecommend, loginModeListToOther } = useGetFormattedLoginModeList(
    config,
    VersionDeviceType.Extension,
  );
  const verifyManagerAddress = useVerifyManagerAddress();
  const latestVerifyManagerAddress = useLatestRef(verifyManagerAddress);
  const isLogin = useMemo(() => type === 'Login', [type]);

  const renderTitle = useMemo(() => {
    const title = isLogin ? t('Login') : t('Sign up');
    if (!isMainnet) {
      return (
        <div className="flex-center testnet-flag">
          <span className="content">
            {title}
            <span className="flag-text flex-center">{t('TEST')}</span>
          </span>
        </div>
      );
    }
    return title;
  }, [isLogin, isMainnet, t]);

  const onSocialChange = useCallback(
    async (v: ISocialLogin) => {
      try {
        onSocialStart(v);
        setLoading(true);
        const _verifyType = zkloginGuardianType.includes(v) ? VerifyTypeEnum.zklogin : undefined;
        const _verifyExtraParams = zkloginGuardianType.includes(v)
          ? { managerAddress: latestVerifyManagerAddress.current ?? '' }
          : undefined;
        const result = await socialLoginAction(v, currentNetwork, _verifyType, _verifyExtraParams);
        setLoading(false);
        if (result.error) throw result.message ?? result.Error;
        onFinish?.({
          type: v,
          data: result.data,
        });
      } catch (error) {
        setLoading(false);
        const msg = handleErrorMessage(error);
        singleMessage.error(msg);
      }
    },
    [currentNetwork, latestVerifyManagerAddress, onFinish, onSocialStart, setLoading],
  );

  const allowedLoginGuardianList: LoginGuardianListType[] = useMemo(
    () => [
      {
        icon: 'Apple',
        type: 'Apple',
        value: LoginType.Apple,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Apple);
        },
      },
      {
        icon: 'Google',
        type: 'Google',
        value: LoginType.Google,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Google);
        },
      },
      {
        icon: 'Email',
        type: 'Email',
        value: LoginType.Email,
        onClick: () => {
          switchLogin?.('Email');
        },
      },
      {
        icon: 'Phone',
        type: 'Phone',
        value: LoginType.Phone,
        onClick: () => {
          switchLogin?.('Phone');
        },
      },
      {
        icon: 'Telegram',
        type: 'Telegram',
        value: LoginType.Telegram,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Telegram);
        },
      },
      {
        icon: 'Twitter',
        type: 'Twitter',
        value: LoginType.Twitter,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Twitter);
        },
      },
      {
        icon: 'Facebook',
        type: 'Facebook',
        value: LoginType.Facebook,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Facebook);
        },
      },
    ],
    [onSocialChange, switchLogin],
  );

  const showLoginModeListToRecommend = useMemo(() => {
    return loginModeListToRecommend
      ?.map((i) => allowedLoginGuardianList.find((v) => LOGIN_TYPE_LABEL_MAP[v.value] === i.type?.value))
      .filter((i) => !!i) as LoginGuardianListType[];
  }, [allowedLoginGuardianList, loginModeListToRecommend]);

  const showLoginModeListToOther = useMemo(() => {
    return loginModeListToOther
      ?.map((i) => allowedLoginGuardianList.find((v) => LOGIN_TYPE_LABEL_MAP[v.value] === i.type?.value))
      .filter((i) => !!i) as LoginGuardianListType[];
  }, [allowedLoginGuardianList, loginModeListToOther]);

  const loginModeListToOtherClassName = useMemo(
    () => (showLoginModeListToOther.length > 5 ? 'flex-row-center' : 'flex-center'),
    [showLoginModeListToOther.length],
  );

  return (
    <>
      <div className="card-content">
        <h1 className="title">
          {!isLogin && <CustomSvg type="BackLeft" onClick={onBack} />}
          {renderTitle}
          {isLogin && <CustomSvg type="QRCode" onClick={() => navigate('/register/start/scan')} />}
        </h1>
        <div className="social-login-content">
          <SocialContent type={type} showLoginModeListToRecommend={showLoginModeListToRecommend} />
          <DividerCenter />
          <div className="extra-guardian-type-content-wrapper">
            <div className={clsx('extra-guardian-type-content', loginModeListToOtherClassName)}>
              {showLoginModeListToOther.map((item) => (
                <div key={item.type} className="guardian-type-icon flex-center" onClick={item.onClick}>
                  <CustomSvg type={item.icon} />
                </div>
              ))}
            </div>
            <div className={clsx('go-sign-up', !isLogin && 'hidden-go-sign-up')}>
              <span>{t('No account?')}</span>
              <span className="sign-text" onClick={() => navigate('/register/start/create')}>
                {t('Sign up')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <TermsOfServiceItem />
    </>
  );
}
