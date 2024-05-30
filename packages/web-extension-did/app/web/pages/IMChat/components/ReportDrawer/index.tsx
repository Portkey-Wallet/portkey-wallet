import { DrawerProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import Report, { IReportProps } from '../Report';
import './index.less';

export interface IReportDrawer extends DrawerProps, IReportProps {}

export default function ReportDrawer({ open, onCloseReport, onReport, ...props }: IReportDrawer) {
  return (
    <BaseDrawer {...props} open={open} height="100%" placement="bottom" destroyOnClose className="report-page-drawer">
      <Report onCloseReport={onCloseReport} onReport={onReport} />
    </BaseDrawer>
  );
}
