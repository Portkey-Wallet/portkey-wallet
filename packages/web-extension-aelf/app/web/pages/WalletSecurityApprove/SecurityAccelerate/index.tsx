import { Button, Image } from 'antd';
import clsx from 'clsx';
import { SecurityAccelerateContent } from 'constants/security';
import './index.less';

export interface SecurityAccelerateProps {
  onConfirm: (res: any) => void;
}

const PrefixCls = 'portkey-security-accelerate';

export default function SecurityAccelerate({ onConfirm }: SecurityAccelerateProps) {
  return (
    <div className={clsx(`${PrefixCls}-wrapper`, 'flex-column-center')}>
      <div className={clsx(`${PrefixCls}-body`, 'flex-column-center')}>
        <div className={`${PrefixCls}-banner`}>
          <Image width={180} height={108} src="assets/images/securityTip.png" className="modal-logo" preview={false} />
        </div>
        <div className={`${PrefixCls}-title`}>Wallet Security Level Upgrade in Progress</div>
        <div className={`${PrefixCls}-description`}>{SecurityAccelerateContent}</div>
      </div>

      <div className={`${PrefixCls}-footer`}>
        <Button type="primary" onClick={onConfirm}>
          OK
        </Button>
      </div>
    </div>
  );
}
