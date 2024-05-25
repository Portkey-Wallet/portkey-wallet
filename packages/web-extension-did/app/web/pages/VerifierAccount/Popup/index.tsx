import CommonHeader from 'components/CommonHeader';
import { ReactNode } from 'react';

export interface IVerifierAccountPopupProps {
  renderContent: ReactNode;
  onBack: () => void;
}

const VerifierAccountPopup = ({ renderContent, onBack }: IVerifierAccountPopupProps) => {
  return (
    <div className="verifier-account popup-page">
      <CommonHeader className="verifier-account-header" onLeftBack={onBack} />
      {renderContent}
    </div>
  );
};

export default VerifierAccountPopup;
