import { useTranslation } from 'react-i18next';
import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback, useEffect } from 'react';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/device';
import { useLocation, useNavigate } from 'react-router';
import { sleep } from '@portkey-wallet/utils';
import { useLoading } from 'store/Provider/hooks';
import DevicesPopup from './Popup';
import DevicesPrompt from './Prompt';
import { useCommonState } from 'store/Provider/hooks';

export default function Devices() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { deviceList, refetch } = useDeviceList();
  const { setLoading } = useLoading();
  const { isNotLessThan768 } = useCommonState();

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    refetch();
  }, [refetch, setLoading]);

  useEffect(() => {
    if (state === 'update') {
      handleRefresh();
    }
  }, [handleRefresh, refetch, state]);

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
    <DevicesPrompt headerTitle={title} goBack={handleBack} list={deviceList} onClick={handleClick} />
  ) : (
    <DevicesPopup headerTitle={title} goBack={handleBack} list={deviceList} onClick={handleClick} />
  );
}
