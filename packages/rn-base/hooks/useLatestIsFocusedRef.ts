import { useLatestRef } from '@portkey-wallet/hooks';
import { useIsFocused } from '@portkey-wallet/rn-inject-sdk';

export default function useLatestIsFocusedRef() {
  console.log('useIsFocused1');
  const isFocused = useIsFocused();
  return useLatestRef(isFocused);
}
