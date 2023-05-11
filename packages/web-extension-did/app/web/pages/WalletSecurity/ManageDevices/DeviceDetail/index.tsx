import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import { resetUserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { useCurrentWallet, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import DeviceDetailPrompt from './Prompt';
import DeviceDetailPopup from './Popup';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';

export default function DeviceDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();

  const { managerAddress } = useParams();
  const dispatch = useAppDispatch();
  const userGuardianList = useGuardianList();
  const { deviceList } = useDeviceList();
  const { walletInfo } = useCurrentWallet();
  const device = useMemo(
    () => deviceList.filter((d) => d?.managerAddress === managerAddress)?.[0] || {},
    [deviceList, managerAddress],
  );
  const isCurrent = useMemo(() => {
    if (device.managerAddress) return walletInfo.address === device?.managerAddress;
    return true;
  }, [device, walletInfo]);

  const handleDelete = useCallback(async () => {
    dispatch(
      setLoginAccountAction({
        guardianAccount: walletInfo.managerInfo?.loginAccount as string,
        loginType: walletInfo.managerInfo?.type as LoginType,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
    isPrompt
      ? navigate('/setting/wallet-security/manage-devices/guardian-approval', {
          state: `removeManage_${device.managerAddress}`,
        })
      : InternalMessage.payload(PortkeyMessageTypes.GUARDIANS_APPROVAL, `removeManage_${device.managerAddress}`).send();
  }, [
    dispatch,
    walletInfo.managerInfo?.loginAccount,
    walletInfo.managerInfo?.type,
    walletInfo.caHash,
    userGuardianList,
    isPrompt,
    navigate,
    device.managerAddress,
  ]);

  const title = t('Device Details');
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/manage-devices');
  }, [navigate]);

  return isNotLessThan768 ? (
    <DeviceDetailPrompt
      headerTitle={title}
      goBack={handleBack}
      device={device}
      isCurrent={isCurrent}
      onDelete={handleDelete}
    />
  ) : (
    <DeviceDetailPopup
      headerTitle={title}
      goBack={handleBack}
      device={device}
      isCurrent={isCurrent}
      onDelete={handleDelete}
    />
  );
}
