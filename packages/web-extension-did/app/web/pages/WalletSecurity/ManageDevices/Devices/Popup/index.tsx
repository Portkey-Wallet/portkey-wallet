import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import DeviceList, { IDeviceListProps } from 'pages/WalletSecurity/components/DeviceList';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function DevicesPopup({ headerTitle, goBack, list, onClick }: BaseHeaderProps & IDeviceListProps) {
  const { t } = useTranslation();
  return (
    <div className="devices-popup min-width-max-height">
      <div className="devices-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
