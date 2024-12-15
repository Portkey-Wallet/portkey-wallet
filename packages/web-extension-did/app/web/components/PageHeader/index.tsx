import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';

export interface IPageHeaderProps {
  onBackCb?: () => void;
  headerTitle?: React.ReactNode;
  rightEle?: React.ReactNode;
}

export default function PageHeader({ onBackCb, headerTitle, rightEle }: IPageHeaderProps) {
  return (
    <div className="page-header flex-between-center">
      <div className="left-container">{onBackCb ? <CustomSvgV3 type="arrow-left" /> : null}</div>
      <div className="center-container">{headerTitle}</div>
      <div className="right-container">{rightEle}</div>
    </div>
  );
}
