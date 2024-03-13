import chainSlice from 'packages/store/network/slice';
import { ChainState } from 'packages/store/network/types';
import { settingsSlice } from 'packages/store/settings/slice';
import { SettingsState } from 'packages/store/settings/types';
import { contactSlice, ContactState } from 'packages/store/store-ca/contact/slice';
import { tradeSlice, TradeState } from 'packages/store/trade/slice';

export type RootCommonState = {
  [chainSlice.name]: ChainState;
  [settingsSlice.name]: SettingsState;
  [tradeSlice.name]: TradeState;
  [contactSlice.name]: ContactState;
};
