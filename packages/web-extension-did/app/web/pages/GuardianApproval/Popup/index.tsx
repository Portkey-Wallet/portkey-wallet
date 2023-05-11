import SettingHeader from 'pages/components/SettingHeader';
import { ReactNode } from 'react';

export interface IGuardianApprovalPopupProps {
  onBack: () => void;
  renderContent: ReactNode;
}

const GuardianApprovalPopup = ({ onBack, renderContent }: IGuardianApprovalPopupProps) => {
  return (
    <div className="guardian-approval-wrapper popup-page min-width-max-height">
      <SettingHeader leftCallBack={onBack} />
      {renderContent}
    </div>
  );
};

export default GuardianApprovalPopup;
