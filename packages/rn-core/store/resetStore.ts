import { dispatch } from 'store';
import { resetRamp } from '@portkey-wallet/store/store-ca/ramp/slice';
export default function resetStore() {
  dispatch(resetRamp());
}
