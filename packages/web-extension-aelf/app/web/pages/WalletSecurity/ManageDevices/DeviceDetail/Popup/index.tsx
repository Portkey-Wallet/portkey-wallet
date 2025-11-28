import DeviceDetailCom, { IDeviceDetailComProps } from 'pages/WalletSecurity/components/DeviceDetailCom';
import CommonHeader from 'components/CommonHeader';
import './index.less';
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
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      <DeviceDetailCom device={device} isCurrent={isCurrent} onDelete={onDelete} />
    </div>
  );
}
