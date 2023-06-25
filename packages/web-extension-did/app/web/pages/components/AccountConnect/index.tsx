import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import AccountConnectModal from '../AccountConnectModal';
import useConnect from 'hooks/useConnect';
import './index.less';

export default function AccountConnect() {
  const { t } = useTranslation();
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
        <span className={clsx('status', dapp && 'connected')} />
        <span>{t(dapp ? 'Connected' : 'Not Connected')}</span>
      </div>
      <AccountConnectModal {...modalProps} />
    </>
  );
}
