import CommonModal from 'components/CommonModal';
import { Button } from 'antd';

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
  return (
    <CommonModal
      getContainer={'#register-start-wrapper'}
      closable={false}
      open={open}
      width={320}
      title={'Continue with this account?'}
      onCancel={onCancel}>
      <p className="modal-content">
        {type === 'login' &&
          'This account has not been registered yet. If you want to register with this account, please download Portkey V2 to get better experience.'}
        {type === 'create' && 'This account already exists. Click "Confirm" to log in.'}
      </p>
      <div className="btn-wrapper">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={onConfirm}>
          {type === 'login' && 'Download'}
          {type === 'create' && 'Confirm'}
        </Button>
      </div>
    </CommonModal>
  );
}
