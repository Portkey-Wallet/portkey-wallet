import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tokenBalanceState } from 'packages/types/types-eoa/tokenBalance';

export const initialState: tokenBalanceState = {
  balances: {},
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const tokenBalanceSlice = createSlice({
  name: 'tokenBalance',
  initialState,
  reducers: {
    updateBalance: (
      state,
      action: PayloadAction<{
        rpcUrl: string;
        account: string;
        balances: {
          symbol: string;
          balance: string;
        }[];
      }>,
    ) => {
      if (!state.balances) state.balances = {};
      const { rpcUrl, balances, account } = action.payload;
      const balanceMap: { [key: string]: string } = {};
      balances.forEach(item => {
        balanceMap[item.symbol] = item.balance;
      });
      if (!state.balances[rpcUrl]) state.balances[rpcUrl] = {};
      state.balances[rpcUrl][account] = Object.assign({}, state.balances[rpcUrl][account] ?? {}, balanceMap);
    },
    updateAccountListBalance: (
      state,
      action: PayloadAction<{
        rpcUrl: string;
        accountList: {
          account: string;
          symbol: string;
          balance: string;
        }[];
      }>,
    ) => {
      if (!state.balances) state.balances = {};
      const { rpcUrl, accountList } = action.payload;
      if (!state.balances[rpcUrl]) state.balances[rpcUrl] = {};
      accountList.map(item => {
        if (!state.balances) state.balances = {};
        if (!state.balances[rpcUrl][item.account]) state.balances[rpcUrl][item.account] = {};
        state.balances[rpcUrl][item.account][item.symbol] = item.balance;
      });
    },
    clearBalance: state => {
      state.balances = {};
    },
  },
});

export const { updateBalance, clearBalance, updateAccountListBalance } = tokenBalanceSlice.actions;

export default tokenBalanceSlice;
