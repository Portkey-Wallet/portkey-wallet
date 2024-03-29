import { useETransShow, useEntrance, useBridgeButtonShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { IEntranceMatchValueMap } from '@portkey-wallet/types/types-ca/cms';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';

export const useEntranceConfig = (): IEntranceMatchValueMap => {
  return {
    deviceType: String(VersionDeviceType.Extension),
    version: process.env.SDK_VERSION?.slice(1) || '',
  };
};

export const useExtensionEntrance = (isInit = false) => {
  const config = useEntranceConfig();
  return useEntrance(config, isInit);
};

export const useExtensionETransShow = () => {
  const config = useEntranceConfig();
  return useETransShow(config);
};
export const useExtensionBridgeButtonShow = () => {
  const config = useEntranceConfig();
  return useBridgeButtonShow(config);
};
