import { CommonModal, CreateWalletType } from '@portkey/did-ui-react';
import { Button } from 'antd';

export default function LoginModal({
  open,
  type = 'Login',
  onCancel,
  onConfirm,
}: {
  open?: boolean;
  type?: CreateWalletType;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  return (
    <CommonModal closable={false} open={open} width={320} title={'Continue with this account?'} onCancel={onCancel}>
      <p className="modal-content">
        {type === 'Login' && 'This account has not been registered yet. Click "Confirm" to complete the registration.'}
        {type === 'SignUp' && 'This account already exists. Click "Confirm" to log in.'}
      </p>
      <div className="btn-wrapper">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </CommonModal>
  );
}
