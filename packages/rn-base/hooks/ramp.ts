import { useEntranceConfig } from './cms';
import { useMixRampEntryShow } from '@portkey-wallet/hooks/hooks-ca/ramp';
import Environment from '@portkey-wallet/rn-inject';

export const useAppRampEntryShow = () => {
  const config = useEntranceConfig();
  const sdkConfig = useSDKRampEntryShow();
  return Environment.isSDK() ? sdkConfig : useMixRampEntryShow(config);
};
export const useSDKRampEntryShow = () => {
  return {
    isRampShow: true,
    isBuySectionShow: true,
    isSellSectionShow: true,
    refreshRampShow: () => {
      return {
        isRampShow: true,
        isBuySectionShow: true,
        isSellSectionShow: true,
      };
    },
  };
};
