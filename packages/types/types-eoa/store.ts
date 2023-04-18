import { tokenSlice } from '@portkey-wallet/store/token/slice';
import { TokenState } from '@portkey-wallet/types/types-eoa/token';
import { tokenBalanceSlice } from '@portkey-wallet/store/tokenBalance/slice';
import { tokenBalanceState } from './tokenBalance';
import { RootCommonState } from '../store';
import { walletSlice } from '@portkey-wallet/store/wallet/slice';
import { WalletState } from '@portkey-wallet/store/wallet/type';
export type EOACommonState = RootCommonState & {
  [tokenSlice.name]: TokenState;
  [tokenBalanceSlice.name]: tokenBalanceState;
  [walletSlice.name]: WalletState;
};
