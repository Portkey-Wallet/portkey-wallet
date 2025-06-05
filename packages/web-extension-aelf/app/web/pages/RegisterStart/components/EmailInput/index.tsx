import { Input } from 'antd';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { checkEmail } from '@portkey-wallet/utils/check';
import i18n from 'i18n';
import clsx from 'clsx';
import { ValidateHandler } from 'types/wallet';
import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';

interface EmailInputProps {
  wrapperClassName?: string;
  error?: string;
  val?: string;
  validate?: (email?: string) => Promise<any>;
  onChange?: (val: string) => void;
}

export interface EmailInputInstance {
  validateEmail: ValidateHandler;
}

const EmailInput = forwardRef(({ error, val, wrapperClassName, validate, onChange }: EmailInputProps, ref) => {
  const { t } = useTranslation();

  const validateEmail = useCallback(
    async (email?: string) => {
      const checkError = checkEmail(email);
      if (checkError) throw i18n.t(checkError);
      await validate?.(email);
    },
    [validate],
  );

  useImperativeHandle(ref, () => ({ validateEmail }));

  return (
    <div className={clsx('email-input-wrapper', wrapperClassName)}>
      <div className="input-wrapper flex-column">
        <div>Email</div>
        <Input
          className={clsx('login-input', 'flex-center', error && 'error-input')}
          value={val}
          placeholder={t('Enter email')}
          onChange={(e: { target: { value: string } }) => {
            onChange?.(e.target.value);
          }}
          allowClear={{ clearIcon: <CustomSvgV3 className="flex-center" type="close-circle" /> }}
        />
        {error && <span className="error-input-text">{error}</span>}
      </div>
    </div>
  );
});

export default EmailInput;
