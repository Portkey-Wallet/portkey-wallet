import chainSlice from '@portkey-wallet/store/network/slice';
import { ChainState } from '@portkey-wallet/store/network/types';
import { settingsSlice } from '@portkey-wallet/store/settings/slice';
import { SettingsState } from '@portkey-wallet/store/settings/types';
import { contactSlice, ContactState } from '@portkey-wallet/store/store-ca/contact/slice';
import { tradeSlice, TradeState } from '@portkey-wallet/store/trade/slice';

export type RootCommonState = {
  [chainSlice.name]: ChainState;
  [settingsSlice.name]: SettingsState;
  [tradeSlice.name]: TradeState;
  [contactSlice.name]: ContactState;
};
