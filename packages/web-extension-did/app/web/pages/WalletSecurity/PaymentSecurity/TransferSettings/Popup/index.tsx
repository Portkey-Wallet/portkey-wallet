import { BaseHeaderProps } from 'types/UI';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function TransferSettingsPopup({ headerTitle, goBack }: BaseHeaderProps) {
  return (
    <div className="transfer-settings-popup min-width-max-height">
      <div className="transfer-settings-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <div></div>
    </div>
  );
}
