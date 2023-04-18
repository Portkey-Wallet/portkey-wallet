import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useIsTestnet } from 'hooks/useNetwork';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { RegisterType, SocialLoginFinishHandler } from 'types/wallet';
import DividerCenter from '../DividerCenter';
import SocialContent from '../SocialContent';
import TermsOfServiceItem from '../TermsOfServiceItem';
import './index.less';

export default function SocialLogin({
  type,
  onBack,
  onFinish,
  switchLogin,
}: {
  type: RegisterType;
  onBack?: () => void;
  onFinish: SocialLoginFinishHandler;
  switchLogin?: () => void;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isTestnet = useIsTestnet();

  const isLogin = useMemo(() => type === 'Login', [type]);

  const renderLoginTitle = useMemo(() => {
    if (isTestnet) {
      return (
        <div className="flex testnet-flag">
          {t('Login')}
          <span className="flag-text flex-center">{t('TEST')}</span>
        </div>
      );
    }
    return t('Login');
  }, [isTestnet, t]);

  return (
    <>
      <div className="card-content">
        <h1 className="title">
          {!isLogin && <CustomSvg type="BackLeft" onClick={onBack} />}
          {isLogin ? renderLoginTitle : t('Sign up')}
          {isLogin && <CustomSvg type="QRCode" onClick={() => navigate('/register/start/scan')} />}
        </h1>
        <div className="social-login-content">
          <SocialContent type={type} onFinish={onFinish} />
          <DividerCenter />
          <Button type="primary" className="login-by-input-btn" onClick={() => switchLogin?.()}>
            {`${isLogin ? t('Login') : t('Sign up')} with Phone / Email`}
          </Button>
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
