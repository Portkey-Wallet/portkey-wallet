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
import SwitchNetworkButton, { BackAndSwitchNetwork } from '../SwitchNetworkButton';
import { Row } from 'antd';

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
    const title = isLogin ? t('Let’s set up your wallet') : t('Create your account');
    return title;
  }, [isLogin, t]);

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
        icon: 'Apple' as LoginGuardianListType['icon'],
        type: 'Apple',
        value: LoginType.Apple,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Apple);
        },
      },
      {
        icon: 'Google' as LoginGuardianListType['icon'],
        type: 'Google',
        value: LoginType.Google,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Google);
        },
      },
      {
        icon: 'Email' as LoginGuardianListType['icon'],
        type: 'Email',
        value: LoginType.Email,
        onClick: () => {
          switchLogin?.('Email');
        },
      },
      {
        icon: 'Phone' as LoginGuardianListType['icon'],
        type: 'Phone',
        value: LoginType.Phone,
        onClick: () => {
          switchLogin?.('Phone');
        },
      },
      {
        icon: 'Telegram' as LoginGuardianListType['icon'],
        type: 'Telegram',
        value: LoginType.Telegram,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Telegram);
        },
      },
      {
        icon: 'Twitter' as LoginGuardianListType['icon'],
        type: 'Twitter',
        value: LoginType.Twitter,
        onClick: () => {
          onSocialChange(SocialLoginEnum.Twitter);
        },
      },
      {
        icon: 'Facebook' as LoginGuardianListType['icon'],
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
    return [
      ...(loginModeListToOther
        ?.map((i) => allowedLoginGuardianList.find((v) => LOGIN_TYPE_LABEL_MAP[v.value] === i.type?.value))
        .filter((i) => !!i) as LoginGuardianListType[]),
      {
        icon: 'QRCodeIcon' as LoginGuardianListType['icon'],
        type: 'QRCode',
        value: 'QRCode',
        onClick: () => navigate('/register/start/scan'),
      },
    ];
  }, [allowedLoginGuardianList, loginModeListToOther, navigate]);

  const loginModeListToOtherClassName = useMemo(
    () => (showLoginModeListToOther.length > 5 ? 'flex-row-center' : 'flex-center'),
    [showLoginModeListToOther.length],
  );

  return (
    <>
      <div className="card-content">
        {!isLogin && <BackAndSwitchNetwork onClick={onBack} />}
        <Row className="flex-row-center flex-between width-100-percent">
          <h1 className={clsx('title', !isLogin && 'register-header-back-title')}>{renderTitle}</h1>
          {isLogin && <SwitchNetworkButton />}
        </Row>
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
          </div>
        </div>
      </div>
      <TermsOfServiceItem />
    </>
  );
}
