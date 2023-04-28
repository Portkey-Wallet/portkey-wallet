import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
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
      <div className="edit-guardian-title">
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

export default GuardianEditPopup;
