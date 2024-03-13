import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddressBookItem } from 'packages/types/addressBook';
import { RecentContactType, TransferItemType } from 'packages/types/trade';

export interface TradeState {
  recentContact?: RecentContactType;
  tradeList: TransferItemType[];
  totalTradeNumber: number;
}

export const initialState: TradeState = {
  recentContact: {},
  tradeList: [],
  totalTradeNumber: 0,
};

export const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    addRecentContact: (
      state,
      action: PayloadAction<{
        rpcUrl: string;
        contact: AddressBookItem;
      }>,
    ) => {
      const { rpcUrl, contact } = action.payload;

      const contractItem = { ...contact, name: contact.name ?? '', timestamp: Date.now() };
      if (!state.recentContact || !state.recentContact[rpcUrl]) {
        state.recentContact = {
          ...(state.recentContact ?? {}),
          [rpcUrl]: [contractItem],
        };
      } else {
        const list = state.recentContact[rpcUrl].filter(
          item =>
            item.address !== contractItem.address ||
            (item.address === contractItem.address && item.name !== contractItem.name),
        );
        list.unshift(contractItem);
        if (list.length > 100) list.length = 100;
        state.recentContact[rpcUrl] = list;
      }
    },
    clearRecentContract: state => {
      state.recentContact = {};
    },
  },
});

export const { addRecentContact, clearRecentContract } = tradeSlice.actions;

export default tradeSlice;
