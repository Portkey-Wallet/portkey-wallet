import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { Tabs, TabsProps } from 'antd';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { ValidateHandler } from 'types/wallet';
import EmailTab from '../EmailTab';
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

const InputInfo = forwardRef(({ confirmText, defaultKey = 'Email', onFinish, validateEmail }: InputInfoProps, ref) => {
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
    ],
    [confirmText, validateEmail, onFinish],
  );

  return (
    <div className="input-info-wrapper">
      <Tabs activeKey={activeKey} items={items} onChange={setActiveKey as any} />
    </div>
  );
});

export default InputInfo;
