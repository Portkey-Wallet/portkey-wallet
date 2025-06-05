import { IDeviceItem, useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';
import AsyncButton from 'components/AsyncButton';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { dateFormat } from 'utils';
import { getDeviceIcon } from 'utils/device';
import './index.less';

export interface IDeviceDetailComProps {
  device: IDeviceItem;
  isCurrent: boolean;
  onDelete: () => Promise<void>;
}

export default function DeviceDetailCom({ device, isCurrent, onDelete }: IDeviceDetailComProps) {
  const { t } = useTranslation();
  const { walletInfo } = useCurrentWallet();

  return (
    <div className="device-detail-common flex-column-between">
      <div>
        <div className="content-item">
          <div className="item-desc">
            <div className="flex-center icon">
              <CustomSvg type={getDeviceIcon(device.deviceInfo?.deviceType || DeviceType.OTHER)} />
            </div>
            <div className="name">{device.deviceInfo?.deviceName}</div>
            {walletInfo.address === device.managerAddress && <div className="flex-center tag">{t('Current')}</div>}
          </div>
          <div className="item-time">
            {!!device.transactionTime && <div className="time">{dateFormat(device.transactionTime)}</div>}
          </div>
        </div>
        {!isCurrent && (
          <div className="content-desc">
            {t(
              'Your account is logged in on this device and you can remove it to revoke its access to your account. Please note that after removing this device, you will need to verify your identity through your guardians when you log in again.',
            )}
          </div>
        )}
      </div>
      {!isCurrent && (
        <div className="content-btn">
          <AsyncButton type="primary" htmlType="submit" onClick={onDelete}>
            {t('Remove Device')}
          </AsyncButton>
        </div>
      )}
    </div>
  );
}
