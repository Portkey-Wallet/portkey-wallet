import CommonHeader from 'components/CommonHeader';
import { ReactNode } from 'react';

export interface IGuardianAddPopupProps {
  onBack: () => void;
  renderContent: ReactNode;
  headerTitle: string;
}

export const GuardianAddPopup = ({ onBack, headerTitle, renderContent }: IGuardianAddPopupProps) => {
  return (
    <div className="add-guardian-page min-width-max-height flex-column">
      <CommonHeader title={headerTitle} onLeftBack={onBack} />
      {renderContent}
    </div>
  );
};

export default GuardianAddPopup;
