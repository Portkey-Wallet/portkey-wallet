import { useBuyButtonShow, useEntrance, useBridgeButtonShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { IEntranceMatchValueConfig } from '@portkey-wallet/types/types-ca/cms';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import * as Application from 'expo-application';

export const useEntranceConfig = (): IEntranceMatchValueConfig => {
  return {
    deviceType: String(isIOS ? VersionDeviceType.iOS : VersionDeviceType.Android),
    version: Application.nativeApplicationVersion || undefined,
    installationTime: async () => {
      const date = await Application.getInstallationTimeAsync();
      return String(date.getTime());
    },
  };
};

export const useAppEntrance = (isInit = false) => {
  const config = useEntranceConfig();
  return useEntrance(config, isInit);
};

export const useAppBuyButtonShow = () => {
  const config = useEntranceConfig();
  return useBuyButtonShow(config);
};

export const useAppBridgeButtonShow = () => {
  const config = useEntranceConfig();
  return useBridgeButtonShow(config);
};
