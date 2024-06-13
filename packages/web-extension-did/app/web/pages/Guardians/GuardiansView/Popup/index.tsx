import CommonHeader from 'components/CommonHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianViewPopupProps {
  headerTitle: string;
  renderContent: ReactNode;
  onBack: () => void;
}

const GuardianViewPopup = ({ headerTitle, renderContent, onBack }: IGuardianViewPopupProps) => {
  return (
    <div className="guardian-view-popup flex-column min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={onBack} />
      {renderContent}
    </div>
  );
};

export default GuardianViewPopup;
