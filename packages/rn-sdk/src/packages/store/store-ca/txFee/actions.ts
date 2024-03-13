import { request } from 'packages/api/api-did';
import { ChainId, NetworkType } from 'packages/types';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { WalletState } from '../wallet/type';

export const fetchTxFeeAsync = createAsyncThunk('fetchTxFeeAsync', async (chainIds: ChainId[], { getState }) => {
  const result = await request.txFee.fetchTxFee({
    params: { chainIds },
  });
  const {
    wallet: { currentNetwork },
  } = getState() as { wallet: WalletState };

  const fee: any = {};
  result?.forEach((item: any) => {
    fee[item.chainId] = item.transactionFee;
  });

  return {
    currentNetwork,
    fee,
  };
});

export const resetTxFee = createAction<NetworkType | undefined>('resetTxFee');
