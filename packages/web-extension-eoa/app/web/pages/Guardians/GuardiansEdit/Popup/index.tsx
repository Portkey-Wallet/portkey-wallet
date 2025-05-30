import CommonHeader from 'components/CommonHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianEditPopupProps {
  onBack: () => void;
  renderContent: ReactNode;
  headerTitle: string;
}

const GuardianEditPopup = ({ onBack, headerTitle, renderContent }: IGuardianEditPopupProps) => {
  return (
    <div className="flex-column edit-guardian-page edit-guardian-popup min-width-max-height">
      <CommonHeader className="edit-guardian-title" title={headerTitle} onLeftBack={onBack} />
      {renderContent}
    </div>
  );
};

export default GuardianEditPopup;
