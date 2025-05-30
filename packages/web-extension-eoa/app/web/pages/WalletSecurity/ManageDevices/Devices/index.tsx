import { useTranslation } from 'react-i18next';
import { IDeviceItem, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback, useEffect, useState } from 'react';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/device';
import { useLoading } from 'store/Provider/hooks';
import DevicesPopup from './Popup';
import DevicesPrompt from './Prompt';
import { useCommonState } from 'store/Provider/hooks';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';

export default function Devices() {
  const { t } = useTranslation();
  const navigate = useNavigateState();
  const onError = useCallback(() => {
    singleMessage.error(`Loading failed. Please retry.`);
  }, []);
  const { deviceList, refresh, loading } = useDeviceList({
    isInit: false,
    onError,
  });
  const [devices, setDevices] = useState<IDeviceItem[]>([]);
  const { setLoading } = useLoading();
  const { isNotLessThan768 } = useCommonState();

  useEffect(() => {
    if (!loading) {
      setDevices(deviceList);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(
    (item: DeviceItemType) => {
      navigate(`/setting/wallet-security/manage-devices/${item.managerAddress}`);
    },
    [navigate],
  );

  const title = t('Login Devices');
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security');
  }, [navigate]);

  return isNotLessThan768 ? (
    <DevicesPrompt headerTitle={title} goBack={handleBack} list={devices} onClick={handleClick} />
  ) : (
    <DevicesPopup headerTitle={title} goBack={handleBack} list={devices} onClick={handleClick} />
  );
}
