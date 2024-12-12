import { useAwakenTokenList } from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import SwapEnter from './components/SwapEnter';
export default function SwapPage() {
  useAwakenTokenList(true);
  return <SwapEnter />;
}
