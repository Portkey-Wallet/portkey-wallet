import SecondPageHeader from 'pages/components/SecondPageHeader';
import DeviceList, { IDeviceListProps } from 'pages/WalletSecurity/components/DeviceList';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function DevicesPrompt({ headerTitle, goBack, list, onClick }: BaseHeaderProps & IDeviceListProps) {
  const { t } = useTranslation();
  return (
    <div className="devices-prompt">
      <div className="devices-prompt-body">
        <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
        <div className="content">
          <div className="desc">
            {t(
              'You can manage your login devices and remove any device. Please note that when you log in again on a removed device, you will need to verify your identity through your guardians.',
            )}
          </div>
          <DeviceList list={list} onClick={onClick} />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
