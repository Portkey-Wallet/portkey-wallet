import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { Button } from 'antd';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import './index.less';

export interface ICompletedProps {
  toAddress: string;
  onClose?: () => void;
}

export default function Completed({ toAddress = '', onClose }: ICompletedProps) {
  const navigate = useNavigate();
  const addressShow = useMemo(() => {
    if (toAddress.includes('_')) {
      return formatStr2EllipsisStr(toAddress);
    }
    return formatStr2EllipsisStr(toAddress, 4, 'middle', 5);
  }, [toAddress]);
  const onClickClose = useCallback(() => {
    onClose ? onClose() : navigate('/');
  }, [navigate, onClose]);
  return (
    <div className="completed-wrapper flex-column">
      <div className="completed-content flex-1 flex-column-center">
        <CustomSvgV3 type="activity-success" />
        <div className="content-main">{`Submitted`}</div>
        <div className="content-desc">{`Your request to send to ${addressShow} has been successfully submitted.`}</div>
      </div>
      <div className="completed-button flex">
        {/* TODO-SA */}
        <Button onClick={onClickClose}>{`Close`}</Button>
      </div>
    </div>
  );
}
