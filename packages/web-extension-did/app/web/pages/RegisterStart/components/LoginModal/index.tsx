import CommonModal from 'components/CommonModal';
import { Button } from 'antd';
import { useServiceSuspension } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useMemo } from 'react';

export default function LoginModal({
  open,
  type = 'login',
  onCancel,
  onConfirm,
}: {
  open?: boolean;
  type?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  const serviceSuspension = useServiceSuspension();

  const modalContent = useMemo(() => {
    if (type === 'create') {
      return 'This account already exists. Click "Confirm" to log in.';
    }
    if (type === 'login') {
      if (serviceSuspension?.isSuspended) {
        return `This account is not registered yet. If you wish to create a Portkey account, we recommend using the fully upgraded Portkey for an enhanced experience.`;
      }
      return 'This account has not been registered yet. Click "Confirm" to complete the registration.';
    }
    return '';
  }, [serviceSuspension?.isSuspended, type]);

  return (
    <CommonModal
      getContainer={'#register-start-wrapper'}
      closable={false}
      open={open}
      width={320}
      title={'Continue with this account?'}
      onCancel={onCancel}>
      <p className="modal-content">{modalContent}</p>
      <div className="btn-wrapper">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={onConfirm}>
          {serviceSuspension?.isSuspended ? 'Download' : 'Confirm'}
        </Button>
      </div>
    </CommonModal>
  );
}
