import CommonHeader from 'components/CommonHeader';
import { useTranslation } from 'react-i18next';
import DeviceList, { IDeviceListProps } from 'pages/WalletSecurity/components/DeviceList';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function DevicesPopup({ headerTitle, goBack, list, onClick }: BaseHeaderProps & IDeviceListProps) {
  const { t } = useTranslation();
  return (
    <div className="devices-popup min-width-max-height">
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      <div className="content">
        <div className="desc">
          {t(
            'You can manage your login devices and remove any device. Please note that when you log in again on a removed device, you will need to verify your identity through your guardians.',
          )}
        </div>
        <DeviceList list={list} onClick={onClick} />
      </div>
    </div>
  );
}
