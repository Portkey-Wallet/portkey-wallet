import { resetUser } from './user/actions';
import { dispatch } from '.';
import { resetRamp } from '@portkey-wallet/store/store-ca/ramp/slice';
import { resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetNetwork } from '@portkey-wallet/store/network/actions';
import { resetTxFee } from '@portkey-wallet/store/store-ca/txFee/actions';
import { resetSecurity } from '@portkey-wallet/store/store-ca/security/actions';
import { store } from '.';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { resetRecent } from '@portkey-wallet/store/store-ca/recent/slice';
import { resetActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { resetAssets } from '@portkey-wallet/store/store-ca/assets/slice';
import { resetSettings } from '@portkey-wallet/store/settings/slice';
import { resetTokenManagement } from '@portkey-wallet/store/store-ca/tokenManagement/slice';

export default function resetStore() {
  console.log('restore');
  const currentNetwork = store.getState()?.wallet?.currentNetwork || 'MAINNET';
  dispatch(resetRamp());
  dispatch(resetUser());
  dispatch(resetWallet());
  dispatch(resetNetwork());
  dispatch(resetTxFee());
  dispatch(resetSecurity(currentNetwork));
  dispatch(resetGuardiansState());
  dispatch(resetRecent());
  dispatch(resetActivity());
  dispatch(resetAssets());
  dispatch(resetSettings());
  dispatch(resetTokenManagement());
}
