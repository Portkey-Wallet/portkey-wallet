import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { Tabs, TabsProps } from 'antd';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { ValidateHandler } from 'types/wallet';
import EmailTab from '../EmailTab';
import PhoneTab from '../PhoneTab';
import './index.less';

export interface InputInfoProps {
  confirmText: string;
  defaultKey?: keyof typeof LoginType;
  validateEmail?: ValidateHandler;
  validatePhone?: ValidateHandler;
  onFinish: (v: { loginType: LoginType; guardianAccount: string }) => void;
}

export interface InputInfoRef {
  setActiveKey: (key: keyof typeof LoginType) => void;
}

const InputInfo = forwardRef(
  ({ confirmText, defaultKey = 'Email', onFinish, validateEmail, validatePhone }: InputInfoProps, ref) => {
    const [activeKey, setActiveKey] = useState<keyof typeof LoginType>(defaultKey);

    useImperativeHandle(
      ref,
      () => ({
        setActiveKey,
      }),
      [],
    );

    const items: TabsProps['items'] = useMemo(
      () => [
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
      ],
      [confirmText, validateEmail, validatePhone, onFinish],
    );

    return (
      <div className="input-info-wrapper">
        <Tabs
          activeKey={activeKey}
          items={items.filter((item) => item.key === activeKey)}
          onChange={setActiveKey as any}
        />
      </div>
    );
  },
);

export default InputInfo;
