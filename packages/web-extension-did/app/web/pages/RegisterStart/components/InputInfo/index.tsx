import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { Tabs, TabsProps } from 'antd';
import { useMemo } from 'react';
import { ValidateHandler } from 'types/wallet';
import EmailTab from '../EmailTab';
import PhoneTab from '../PhoneTab';
import './index.less';

export interface InputInfoProps {
  confirmText: string;
  validateEmail?: ValidateHandler;
  validatePhone?: ValidateHandler;
  onFinish: (v: { loginType: LoginType; guardianAccount: string }) => void;
}

export default function InputInfo({ confirmText, onFinish, validateEmail, validatePhone }: InputInfoProps) {
  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: LoginType[LoginType.Phone],
        label: 'Phone',
        children: (
          <PhoneTab
            confirmText={confirmText}
            validate={validatePhone}
            onFinish={(v) =>
              onFinish({
                loginType: LoginType.Phone,
                guardianAccount: `+${v.code} ${v.phoneNumber}`,
              })
            }
          />
        ),
      },
      {
        key: LoginType[LoginType.Email],
        label: 'Email',
        children: (
          <EmailTab
            confirmText={confirmText}
            validateEmail={validateEmail}
            onFinish={(v) =>
              onFinish({
                loginType: LoginType.Email,
                guardianAccount: v,
              })
            }
          />
        ),
      },
    ],
    [confirmText, validatePhone, validateEmail, onFinish],
  );

  return (
    <div className="input-info-wrapper">
      <Tabs defaultActiveKey={LoginType[LoginType.Phone]} items={items} />
    </div>
  );
}
