import { tokenSlice } from 'packages/store/token/slice';
import { TokenState } from 'packages/types/types-eoa/token';
import { tokenBalanceSlice } from 'packages/store/tokenBalance/slice';
import { tokenBalanceState } from './tokenBalance';
import { RootCommonState } from '../store';
import { walletSlice } from 'packages/store/wallet/slice';
import { WalletState } from 'packages/store/wallet/type';
export type EOACommonState = RootCommonState & {
  [tokenSlice.name]: TokenState;
  [tokenBalanceSlice.name]: tokenBalanceState;
  [walletSlice.name]: WalletState;
};
