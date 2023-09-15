import { SecurityCheck } from '@portkey/did-ui-react';
import { useNavigate } from 'react-router';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import errorHandler from 'utils/errorHandler';
import './index.less';

export default function WalletSecurityApprove() {
  const navigate = useNavigate();

  return (
    <div className="full-screen-height portkey-ui-flex-center wallet-security-approve">
      <SecurityCheck
        onConfirm={() => navigate('/setting/guardians')}
        onCancel={() => {
          closePrompt(errorHandler(200001));
        }}
      />
    </div>
  );
}
