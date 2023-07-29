import { Switch } from 'antd';
import { useCallback, useState } from 'react';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { SessionKeyArray } from '@portkey-wallet/constants/constants-ca/dapp';
import CustomShowSelect from '../CustomShowSelect';
import './index.less';

export interface IDappSessionProps {
  onChange: (open: boolean, exp: SessionExpiredPlan) => void;
}

export default function DappSession({ onChange }: IDappSessionProps) {
  const [open, setOpen] = useState(false);
  const [exp, setExp] = useState<SessionExpiredPlan>(SessionExpiredPlan.hour1);

  const handleSwitch = useCallback(
    (value: boolean) => {
      setOpen(value);
      setExp(SessionExpiredPlan.hour1);
      onChange(value, SessionExpiredPlan.hour1);
    },
    [onChange],
  );

  const handleSessionChange = useCallback(
    (value: SessionExpiredPlan) => {
      onChange(open, value);
      setExp(value);
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
          <CustomShowSelect
            showInValue={`Session key expires in`}
            items={SessionKeyArray}
            defaultValue={SessionExpiredPlan.hour1}
            value={exp}
            onChange={handleSessionChange}
          />
        </div>
      )}
      <div className="tip">{`Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time.`}</div>
    </div>
  );
}
