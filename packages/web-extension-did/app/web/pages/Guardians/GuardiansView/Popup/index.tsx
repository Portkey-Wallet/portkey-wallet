import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
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
      <div className="guardian-view-title">
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

export default GuardianViewPopup;
