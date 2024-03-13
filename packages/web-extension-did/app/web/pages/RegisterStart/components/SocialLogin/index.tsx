import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RegisterType, SocialLoginFinishHandler } from 'types/wallet';
import DividerCenter from '../DividerCenter';
import SocialContent from '../SocialContent';
import TermsOfServiceItem from '../TermsOfServiceItem';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { useLoading, useWalletInfo } from 'store/Provider/hooks';
import { ISocialLogin, SocialLoginEnum } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import './index.less';

const guardianList = [
  // {
  //   icon: <CustomSvg type="Apple" />,
  //   type: 'Apple',
  // },
  // {
  //   icon: <CustomSvg type="Twitter" />,
  //   type: 'Twitter',
  // },
  // {
  //   icon: <CustomSvg type="Facebook" />,
  //   type: 'Facebook',
  // },
  {
    icon: <CustomSvg type="Email" />,
    type: 'Email',
  },
  {
    icon: <CustomSvg type="Telegram" />,
    type: 'Telegram',
  },
] as const;

export default function SocialLogin({
  type,
  onBack,
  onFinish,
  switchLogin,
}: {
  type: RegisterType;
  onBack?: () => void;
  onFinish: SocialLoginFinishHandler;
  switchLogin?: (type: 'Email' | 'Phone') => void;
}) {
  const navigate = useNavigateState();
  const { t } = useTranslation();
  const isMainnet = useIsMainnet();
  const { currentNetwork } = useWalletInfo();
  const { setLoading } = useLoading();

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
        setLoading(true);
        const result = await socialLoginAction(v, currentNetwork);
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
    [currentNetwork, onFinish, setLoading],
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
          <SocialContent type={type} onSocialChange={onSocialChange} />
          <DividerCenter />
          <div className="flex-center extra-guardian-type-content">
            {guardianList.map((item) => (
              <div
                key={item.type}
                className="guardian-type-icon flex-center"
                onClick={() => {
                  if (item.type === SocialLoginEnum.Telegram) {
                    onSocialChange(SocialLoginEnum.Telegram);
                    return;
                  }
                  // if (item.type === SocialLoginEnum.Facebook) {
                  //   onSocialChange(SocialLoginEnum.Facebook);
                  //   return;
                  // }
                  // if (item.type === SocialLoginEnum.Twitter) {
                  //   onSocialChange(SocialLoginEnum.Twitter);
                  //   return;
                  // }
                  switchLogin?.(item.type);
                }}>
                {item.icon}
              </div>
            ))}
          </div>

          {isLogin && (
            <div className="go-sign-up">
              <span>{t('No account?')}</span>
              <span className="sign-text" onClick={() => navigate('/register/start/create')}>
                {t('Sign up')}
              </span>
            </div>
          )}
        </div>
      </div>
      <TermsOfServiceItem />
    </>
  );
}
