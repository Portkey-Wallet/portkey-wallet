import CustomSvg from 'components/CustomSvg';
import { getDeviceIcon } from 'utils/device';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import { IDeviceList, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { dateFormat } from 'utils';
import { useTranslation } from 'react-i18next';
import './index.less';

export interface IDeviceListProps {
  list: IDeviceList[];
  onClick: (item: DeviceItemType) => void;
}

export default function DeviceList({ list, onClick }: IDeviceListProps) {
  const { t } = useTranslation();
  const walletInfo = useCurrentWalletInfo();

  return (
    <div className="device-list">
      {list.map((item) => (
        <div className="device-item flex" key={item.managerAddress} onClick={() => onClick(item)}>
          <div className="content-item">
            <div className="item-desc">
              <div className="flex-center icon">
                <CustomSvg type={getDeviceIcon(item.deviceInfo.deviceType || DeviceType.OTHER)} />
              </div>
              <div className="name">{item.deviceInfo.deviceName}</div>
              {walletInfo.address === item.managerAddress && <div className="flex-center tag">{t('Current')}</div>}
            </div>
            <div className="item-time">
              {!!item.transactionTime && <div className="time">{dateFormat(item.transactionTime)}</div>}
            </div>
          </div>
          <CustomSvg type="LeftArrow" className="left-arrow" />
        </div>
      ))}
    </div>
  );
}
