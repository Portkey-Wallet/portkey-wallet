import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';
import { Button } from 'antd';
import { useNavigateState } from 'hooks/router';
import { useCallback } from 'react';

export const SwapCompleted = () => {
  const navigate = useNavigateState();

  const onClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="swap-completed">
      <div className="swap-completed-body">
        <CustomSvgV3 className="swap-completed-icon" type="activity-success" />
        <div className="swap-completed-title">Transaction completed</div>
        <div className="swap-completed-sub-title">{'View the transaction in “Activity” tab to check its status.'}</div>
      </div>

      <div className="swap-completed-footer">
        <Button type="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
