import { useCallback, useMemo, useState } from 'react';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { SessionKeyArray } from '@portkey-wallet/constants/constants-ca/dapp';
import './index.less';
import { CommonModal, CommonModalTip } from '@portkey/did-ui-react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import clsx from 'clsx';

export interface IDappSessionProps {
  className?: string;
  onChange: (open: boolean, exp: SessionExpiredPlan) => void;
}

export default function DappSession({ className, onChange }: IDappSessionProps) {
  const [exp, setExp] = useState<SessionExpiredPlan>(SessionExpiredPlan.always);
  const [isShow, setIsShow] = useState(false);

  const handleSessionChange = useCallback(
    (value: SessionExpiredPlan) => {
      const open = value !== SessionExpiredPlan.always;
      onChange(open, value);
      setExp(value);
      setIsShow(false);
    },
    [onChange],
  );

  const expLabel = useMemo(() => SessionKeyArray.find((item) => item.value === exp)?.label || '', [exp]);

  return (
    <div className={clsx('dapp-session', className)}>
      <div
        className="dapp-session-button"
        onClick={() => {
          setIsShow(true);
        }}>
        <div className="dapp-session-title-wrap">
          <span className="dapp-session-title">Require authentication</span>
          <div onClick={(e) => e.stopPropagation()}>
            <CommonModalTip
              title="Token allowance"
              content={`When set to any value other than "Always," your session key will automatically approve this dApp's requests on this device, suppressing pop-ups until it expires. The feature disables when you disconnect or when the session key expires, and you can manually turn it off or adjust the expiration time.`}
            />
          </div>
        </div>

        <div className="dapp-session-value-wrap">
          <span>{expLabel}</span>
          <CustomSvgV3 type="chevron_right" className="dapp-session-value-icon" />
        </div>
      </div>

      <CommonModal
        className="dapp-session-modal"
        open={isShow}
        onClose={() => {
          setIsShow(false);
        }}>
        <div className="dapp-session-modal-title">
          <span>Require authentication</span>
        </div>
        <div className="dapp-session-list-wrap">
          {SessionKeyArray.map((item) => (
            <div key={item.value} className="dapp-session-item-wrap" onClick={() => handleSessionChange(item.value)}>
              <span>{item.label}</span>
              {exp === item.value && <CustomSvgV3 className="dapp-session-item-check-icon" type="check_circle" />}
            </div>
          ))}
        </div>
      </CommonModal>
    </div>
  );
}
