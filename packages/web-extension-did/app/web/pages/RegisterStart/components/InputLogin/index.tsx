import { MutableRefObject, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RegisterType, ValidateHandler } from 'types/wallet';
import InputInfo, { InputInfoProps, InputInfoRef } from '../InputInfo';
import { LoginKey } from '@portkey-wallet/types/types-ca/wallet';
import { BackAndSwitchNetwork } from '../SwitchNetworkButton';
import './index.less';
import clsx from 'clsx';
import { useNavigateState } from 'hooks/router';

export default function InputLogin({
  type,
  onBack,
  inputRef,
  defaultKey,
  onFinish,
  validateEmail,
}: {
  type: RegisterType;
  inputRef?: MutableRefObject<InputInfoRef | undefined>;
  defaultKey?: LoginKey;
  onBack?: () => void;
  onFinish: InputInfoProps['onFinish'];
  validateEmail?: ValidateHandler;
  validatePhone?: ValidateHandler;
}) {
  const { t } = useTranslation();
  const isLogin = useMemo(() => type === 'Login', [type]);

  const title = useMemo(() => (isLogin ? t('Log in via email') : t('Create your account')), [t, isLogin]);

  const renderTitle = useMemo(() => {
    return <span>{title}</span>;
  }, [title]);
  const navigate = useNavigateState();

  const nextEle = useMemo(() => {
    if (isLogin) {
      return (
        <div className={clsx('go-sign-up')}>
          <span>{t(`Don't have an account?`)}</span>
          <span className="sign-text" onClick={() => navigate('/register/start/create')}>
            {t('Sign up')}
          </span>
        </div>
      );
    }
    return (
      <div className={clsx('go-sign-up')}>
        <span>{t('Already have an account?')}</span>
        <span className="sign-text" onClick={() => navigate('/register/start/login-input')}>
          {t('Log in')}
        </span>
      </div>
    );
  }, [isLogin, navigate, t]);

  return (
    <div className="login-content-wrapper">
      <BackAndSwitchNetwork onClick={onBack} />
      <h1 className="title">{renderTitle}</h1>
      <InputInfo
        ref={inputRef}
        defaultKey={defaultKey}
        validateEmail={validateEmail}
        confirmText={'Continue'}
        onFinish={onFinish}
      />
      {nextEle}
    </div>
  );
}
