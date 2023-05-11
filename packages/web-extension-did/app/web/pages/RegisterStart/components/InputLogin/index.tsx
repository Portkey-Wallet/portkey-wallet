import { useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RegisterType, ValidateHandler } from 'types/wallet';
import InputInfo, { InputInfoProps } from '../InputInfo';
import './index.less';

export default function InputLogin({
  type,
  onBack,
  onFinish,
  validateEmail,
  validatePhone,
}: {
  type: RegisterType;
  onBack?: () => void;
  onFinish: InputInfoProps['onFinish'];
  validateEmail?: ValidateHandler;
  validatePhone?: ValidateHandler;
}) {
  const { t } = useTranslation();
  const isTestnet = useIsTestnet();

  const title = useMemo(() => (type === 'Login' ? t('Login') : t('Sign up')), [t, type]);

  const renderTitle = useMemo(() => {
    if (isTestnet) {
      return (
        <div className="flex testnet-flag">
          {title}
          <span className="flag-text flex-center">{t('TEST')}</span>
        </div>
      );
    }
    return <span>{title}</span>;
  }, [isTestnet, t, title]);

  return (
    <div>
      <h1 className="title">
        <CustomSvg type="BackLeft" onClick={onBack} />
        {renderTitle}
      </h1>
      <InputInfo validatePhone={validatePhone} validateEmail={validateEmail} confirmText={title} onFinish={onFinish} />
    </div>
  );
}
