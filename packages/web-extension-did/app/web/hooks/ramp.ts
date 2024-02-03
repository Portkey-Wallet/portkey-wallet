import { useEntranceConfig } from './cms';
import { useMixRampEntryShow } from '@portkey-wallet/hooks/hooks-ca/ramp';

export const useExtensionRampEntryShow = () => {
  const config = useEntranceConfig();
  return useMixRampEntryShow(config);
};
