import chainSlice from '@portkey-wallet/store/network/slice';
import { ChainState } from '@portkey-wallet/store/network/types';
import settingsSlice from '@portkey-wallet/store/settings/slice';
import { SettingsState } from '@portkey-wallet/store/settings/types';
import { walletSlice } from '@portkey-wallet/store/store-eoa/wallet/slice';
import { TWalletState } from '@portkey-wallet/store/store-eoa/wallet/type';
import { networkSlice } from '@portkey-wallet/store/store-eoa/network/slice';
import { TNetworkState } from '@portkey-wallet/store/store-eoa/network/type';

export type EOACommonState = {
  [settingsSlice.name]: SettingsState;
  [walletSlice.name]: TWalletState;
  [chainSlice.name]: ChainState;
  [networkSlice.name]: TNetworkState;
};
