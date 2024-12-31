import { CommonButton, CommonModal } from '@portkey/did-ui-react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';

export default function LoginModal({
  open,
  type = 'login',
  email = '',
  onCancel,
  onConfirm,
}: {
  open?: boolean;
  type?: string;
  email?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  return (
    <CommonModal getContainer={'#register-start-wrapper'} open={open}>
      <div className="register-start-modal">
        <div className="flex-between-center login-header">
          <div>
            {type === 'login' && `You don't have an account`}
            {type === 'create' && `You already have an account`}
          </div>
          <CustomSvgV3 onClick={onCancel} className="cursor-pointer" type="close thin" />
        </div>
        <div>
          {type === 'login' && `Would you like to create one with ${email} ?`}
          {type === 'create' && `Do you want to log in with ${email} instead?`}
        </div>
        <div className="flex-row-center login-btn-warp">
          <CommonButton type="outline" onClick={onCancel}>{`Cancel`}</CommonButton>
          <CommonButton type="primary" onClick={onConfirm}>
            {type === 'login' && `Sign up`}
            {type === 'create' && `Log in`}
          </CommonButton>
        </div>
      </div>
    </CommonModal>
  );
}
