import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import CustomSvg from 'components/CustomSvg';
import { MutableRefObject, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RegisterType, ValidateHandler } from 'types/wallet';
import InputInfo, { InputInfoProps, InputInfoRef } from '../InputInfo';
import './index.less';
import { LoginKey } from '@portkey-wallet/types/types-ca/wallet';

export default function InputLogin({
  type,
  onBack,
  inputRef,
  defaultKey,
  onFinish,
  validateEmail,
  validatePhone,
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
  const isMainnet = useIsMainnet();

  const title = useMemo(() => (type === 'Login' ? t('Login') : t('Sign up')), [t, type]);

  const renderTitle = useMemo(() => {
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
    return <span>{title}</span>;
  }, [isMainnet, t, title]);

  return (
    <div>
      <h1 className="title">
        <CustomSvg type="BackLeft" onClick={onBack} />
        {renderTitle}
      </h1>
      <InputInfo
        ref={inputRef}
        defaultKey={defaultKey}
        validatePhone={validatePhone}
        validateEmail={validateEmail}
        confirmText={title}
        onFinish={onFinish}
      />
    </div>
  );
}
