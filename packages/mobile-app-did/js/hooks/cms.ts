import { getCodePushControl } from '@portkey-wallet/graphql/cms/queries';
import { useETransShow, useEntrance, useBridgeButtonShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { NetworkType } from '@portkey-wallet/types';
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

export const useAppETransShow = () => {
  const config = useEntranceConfig();
  return useETransShow(config);
};

export const useAppBridgeButtonShow = () => {
  const config = useEntranceConfig();
  return useBridgeButtonShow(config);
};
