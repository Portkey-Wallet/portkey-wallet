import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { ReactNode } from 'react';

export interface IGuardianAddPopupProps {
  onBack: () => void;
  renderContent: ReactNode;
  headerTitle: string;
}

export const GuardianAddPopup = ({ onBack, headerTitle, renderContent }: IGuardianAddPopupProps) => {
  return (
    <div className="add-guardian-page min-width-max-height flex-column">
      <div className="add-guardian-title">
        <SettingHeader
          title={headerTitle}
          leftCallBack={onBack}
          rightElement={<CustomSvg type="Close2" onClick={onBack} />}
        />
      </div>
      {renderContent}
    </div>
  );
};

export default GuardianAddPopup;
