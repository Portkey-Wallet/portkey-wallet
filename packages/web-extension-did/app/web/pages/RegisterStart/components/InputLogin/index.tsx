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

  const title = useMemo(() => (type === 'Login' ? t('Login') : t('Sign up')), [t, type]);

  return (
    <div>
      <h1 className="title">
        <CustomSvg type="BackLeft" onClick={onBack} />
        <span>{title}</span>
      </h1>
      <InputInfo validatePhone={validatePhone} validateEmail={validateEmail} confirmText={title} onFinish={onFinish} />
    </div>
  );
}
