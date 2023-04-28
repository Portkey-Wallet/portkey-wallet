import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianProps {
  headerTitle: string;
  onBack: () => void;
  renderAddBtn: ReactNode;
  renderGuardianList: ReactNode;
}

const GuardiansPopup = (props: IGuardianProps) => {
  const { headerTitle, onBack, renderAddBtn, renderGuardianList } = props;
  return (
    <div className="guardians-popup min-width-max-height">
      <div className="guardians-title">
        <SettingHeader
          title={headerTitle}
          leftCallBack={onBack}
          rightElement={
            <div>
              {renderAddBtn}
              <CustomSvg type="Close2" onClick={onBack} />
            </div>
          }
        />
      </div>
      <div className="guardians-content">{renderGuardianList}</div>
    </div>
  );
};

export default GuardiansPopup;
