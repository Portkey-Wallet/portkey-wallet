import { useEntranceConfig } from './cms';
import { useMixRampEntryShow } from '@portkey-wallet/hooks/hooks-ca/ramp';

export const useAppRampEntryShow = () => {
  const config = useEntranceConfig();
  return useMixRampEntryShow(config);
};
