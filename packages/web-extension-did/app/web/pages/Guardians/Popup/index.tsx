import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianProps {
  headerTitle: string;
  onBack: () => void;
  renderAddBtn?: ReactNode;
  renderGuardianList: ReactNode;
  renderGuardianTip?: ReactNode;
}

const GuardiansPopup = (props: IGuardianProps) => {
  const { headerTitle, onBack, renderAddBtn, renderGuardianList, renderGuardianTip } = props;
  return (
    <div className="guardians-popup min-width-max-height flex-column">
      <div className="guardians-body flex-column">
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
      <div className="guardians-content flex-column-between flex-1">
        <div className="content-guardian-list flex-1">{renderGuardianList}</div>
        <div className="content-guardian-tip flex">{renderGuardianTip}</div>
      </div>
    </div>
  );
};

export default GuardiansPopup;
