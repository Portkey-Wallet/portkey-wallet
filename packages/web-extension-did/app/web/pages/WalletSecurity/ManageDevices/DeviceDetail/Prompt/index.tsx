import SecondPageHeader from 'pages/components/SecondPageHeader';
import DeviceDetailCom, { IDeviceDetailComProps } from 'pages/WalletSecurity/components/DeviceDetailCom';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function DeviceDetailPrompt({
  headerTitle,
  goBack,
  device,
  isCurrent,
  onDelete,
}: BaseHeaderProps & IDeviceDetailComProps) {
  return (
    <div className="device-detail-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <DeviceDetailCom device={device} isCurrent={isCurrent} onDelete={onDelete} />
    </div>
  );
}
