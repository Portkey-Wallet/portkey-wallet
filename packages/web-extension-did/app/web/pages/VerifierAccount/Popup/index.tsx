import SettingHeader from 'pages/components/SettingHeader';
import { ReactNode } from 'react';

export interface IVerifierAccountPopupProps {
  renderContent: ReactNode;
  onBack: () => void;
}

const VerifierAccountPopup = ({ renderContent, onBack }: IVerifierAccountPopupProps) => {
  return (
    <div className="verifier-account popup-page">
      <SettingHeader leftCallBack={onBack} />
      {renderContent}
    </div>
  );
};

export default VerifierAccountPopup;
