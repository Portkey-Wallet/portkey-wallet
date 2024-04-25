import { useCallback, useMemo, useState } from 'react';
import AccountConnectModal from '../AccountConnectModal';
import useConnect from 'hooks/useConnect';
import CustomSvg from 'components/CustomSvg';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import './index.less';

export default function AccountConnect() {
  const { dapp } = useConnect();
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen(true);
  }, []);

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const modalProps = useMemo(() => ({ onCancel, open }), [onCancel, open]);

  return (
    <>
      <div className="account-connect flex-center" onClick={onClick}>
        <Tooltip
          placement="bottom"
          overlayClassName={clsx(dapp && 'account-connected')}
          showArrow={false}
          title={dapp ? 'Connected' : 'Not Connected'}>
          <div className="account-connect-icon">
            <CustomSvg type="AccountConnect" />
            <CustomSvg type={dapp ? 'EllipseGreen' : 'EllipseGray'} />
          </div>
        </Tooltip>
      </div>
      <AccountConnectModal {...modalProps} />
    </>
  );
}
