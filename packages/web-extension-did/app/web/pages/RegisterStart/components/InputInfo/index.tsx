import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { forwardRef } from 'react';
import { ValidateHandler } from 'types/wallet';
import EmailTab from '../EmailTab';
import './index.less';

export interface InputInfoProps {
  confirmText: string;
  defaultKey?: keyof typeof LoginType;
  loading: boolean;
  validateEmail?: ValidateHandler;
  onFinish: (v: { loginType: LoginType; guardianAccount: string }) => void;
}

export interface InputInfoRef {
  setActiveKey: (key: keyof typeof LoginType) => void;
}

const InputInfo = forwardRef(({ confirmText, onFinish, validateEmail, loading }: InputInfoProps) => {
  return (
    <div className="input-info-wrapper">
      <EmailTab
        confirmText={confirmText}
        validateEmail={validateEmail}
        loading={loading}
        onFinish={(v) =>
          onFinish({
            loginType: LoginType.Email,
            guardianAccount: v,
          })
        }
      />
    </div>
  );
});

export default InputInfo;
