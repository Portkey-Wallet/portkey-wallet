import CommonHeader from 'components/CommonHeader';
import { ReactNode } from 'react';

export interface IGuardianApprovalPopupProps {
  onBack: () => void;
  renderContent: ReactNode;
}

const GuardianApprovalPopup = ({ onBack, renderContent }: IGuardianApprovalPopupProps) => {
  return (
    <div className="guardian-approval-wrapper popup-page min-width-max-height">
      <CommonHeader className="guardian-approval-header" onLeftBack={onBack} />
      {renderContent}
    </div>
  );
};

export default GuardianApprovalPopup;
