import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useAppDispatch, useCommonState, useLoading } from 'store/Provider/hooks';
import { resetUserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { useCurrentWallet, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import DeviceDetailPrompt from './Prompt';
import DeviceDetailPopup from './Popup';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TGuardianApprovalLocationState } from 'types/router';

export default function DeviceDetail() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TGuardianApprovalLocationState>();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const { setLoading } = useLoading();
  const { managerAddress } = useParams();
  const dispatch = useAppDispatch();
  const userGuardianList = useGuardianList();
  const { deviceList, loading } = useDeviceList();
  const { walletInfo } = useCurrentWallet();
  const device = useMemo(
    () => deviceList.filter((d) => d?.managerAddress === managerAddress)?.[0] || {},
    [deviceList, managerAddress],
  );
  const isCurrent = useMemo(() => {
    if (device.managerAddress) return walletInfo.address === device?.managerAddress;
    return true;
  }, [device, walletInfo]);
  useEffect(() => {
    setLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  const handleDelete = useCallback(async () => {
    // ====== clear guardian cache ====== start
    dispatch(
      setLoginAccountAction({
        guardianAccount: walletInfo.managerInfo?.loginAccount as string,
        loginType: walletInfo.managerInfo?.type as LoginType,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
    // ====== clear guardian cache ====== end

    isPrompt
      ? navigate('/setting/wallet-security/manage-devices/guardian-approval', {
          state: {
            previousPage: FromPageEnum.removeManage,
            manageAddress: `${device.managerAddress}`,
          },
        })
      : InternalMessage.payload(
          PortkeyMessageTypes.GUARDIANS_APPROVAL,
          JSON.stringify({ previousPage: FromPageEnum.removeManage, manageAddress: device.managerAddress }),
        ).send();
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
