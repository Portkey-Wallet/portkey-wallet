import DeviceDetailCom, { IDeviceDetailComProps } from 'pages/WalletSecurity/components/DeviceDetailCom';
import BackHeader from 'components/BackHeader';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { BaseHeaderProps } from 'types/UI';

export default function DeviceDetailPopup({
  headerTitle,
  goBack,
  device,
  isCurrent,
  onDelete,
}: BaseHeaderProps & IDeviceDetailComProps) {
  return (
    <div className="device-detail-popup min-width-max-height">
      <div className="device-detail-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>

      <DeviceDetailCom device={device} isCurrent={isCurrent} onDelete={onDelete} />
    </div>
  );
}
