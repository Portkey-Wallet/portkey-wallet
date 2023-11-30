import { useLatestRef } from '@portkey-wallet/hooks';
import { useIsFocused } from '@react-navigation/native';

export default function useLatestIsFocusedRef() {
  const isFocused = useIsFocused();
  return useLatestRef(isFocused);
}
