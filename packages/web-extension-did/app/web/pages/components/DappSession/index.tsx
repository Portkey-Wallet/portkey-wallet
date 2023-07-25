import { Switch } from 'antd';
import CustomSelect from '../CustomSelect';
import { useCallback, useState } from 'react';
import './index.less';

export interface IDappSessionProps {
  onChange: (open: boolean, exp: string) => void;
}

const SessionExpiredPlan = [
  {
    value: '1',
    children: '1 hour',
  },
  {
    value: '3',
    children: '3 hour',
  },
  {
    value: '12',
    children: '12 hour',
  },
  {
    value: '24',
    children: '24 hour',
  },
  {
    value: 'never',
    children: 'Never',
  },
];
export default function DappSession({ onChange }: IDappSessionProps) {
  const [open, setOpen] = useState(false);

  const handleSwitch = useCallback(
    (value: boolean) => {
      setOpen(value);
      const exp = value ? 'never' : '';
      onChange(value, exp);
    },
    [onChange],
  );

  const handleSessionChange = useCallback(
    (value: string) => {
      onChange(open, value);
    },
    [onChange, open],
  );

  return (
    <div className="dapp-session flex-column">
      <div className="switch-wrap flex-between">
        <div>Remember me to skip authentication</div>
        <Switch className="switch" checked={open} onChange={handleSwitch} />
      </div>
      {open && (
        <div className="select">
          <CustomSelect items={SessionExpiredPlan} defaultValue={'1'} value={'1'} onChange={handleSessionChange} />
        </div>
      )}
      <div className="tip">{`Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time.`}</div>
    </div>
  );
}
