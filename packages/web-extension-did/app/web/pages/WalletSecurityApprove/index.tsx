import { SecurityCheck } from '@portkey/did-ui-react';
import { useNavigate } from 'react-router';
import { closeTabPrompt } from 'utils/lib/serviceWorkerAction';
import errorHandler from 'utils/errorHandler';
import usePromptSearch from 'hooks/usePromptSearch';
import { Button } from 'antd';
import { Loading } from '@portkey/did-ui-react';
import './index.less';

export default function WalletSecurityApprove() {
  const { showGuardian } = usePromptSearch<{
    showGuardian: boolean;
    showSync: boolean;
  }>();
  const navigate = useNavigate();

  return (
    <div>
      {showGuardian ? (
        <div className="full-screen-height portkey-ui-flex-center wallet-security-approve">
          <SecurityCheck
            onConfirm={() => navigate('/setting/guardians')}
            onCancel={() => {
              closeTabPrompt(errorHandler(200003));
            }}
          />
        </div>
      ) : (
        <div className="wallet-security-sync flex-column-center">
          <div className="loading">
            <Loading />
          </div>
          <div className="content">
            <div>Syncing guardian info, which may take 1-2 minutes.</div>
            <div>Please try again later.</div>
          </div>
          <Button
            className="sync-button"
            type="primary"
            onClick={() => {
              closeTabPrompt({
                ...errorHandler(0),
                data: 'Syncing guardian info, which may take 1-2 minutes. Please try again later.',
              });
            }}>
            OK
          </Button>
        </div>
      )}
    </div>
  );
}
