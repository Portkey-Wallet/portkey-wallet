import type { ChainItemType, BasicContracts, UpdateChainListType } from 'packages/types/chain';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChainList } from './api';
import { checkRpcUrlFormat } from './utils';
import { getELFTokenAddress } from 'packages/contracts/index';
import type { BaseToken } from 'packages/types/types-eoa/token';
import { ChainActionError } from './types';

export const setCurrentChain = createAction<{ rpcUrl: string }>('chain/setCurrentChain');
export const updateChainListAction = createAction<UpdateChainListType>('chain/updateChainList');
export const addCommonList = createAction<{ rpcUrl: string }>('chain/addCommonList');
export const removeCommonList = createAction<{ rpcUrl: string }>('chain/removeCommonList');
export const resetNetwork = createAction('chain/resetNetwork');

export const fetchChainListAsync = createAsyncThunk('chain/fetchDefaultChainList', async () => {
  const response: any = await fetchChainList();
  return response;
});

export const addCustomChainItem = createAsyncThunk('chain/addCustomChainItem', async (chain: ChainItemType) => {
  if (!chain.networkName) throw new Error(ChainActionError.noName);
  if (!chain.chainId) throw new Error(ChainActionError.noChainId);
  const key = `${chain.rpcUrl}&${chain.networkName}`;
  const isCustom = true;
  let nativeCurrency: BaseToken | undefined = chain.nativeCurrency;
  let basicContracts: BasicContracts | undefined;
  if (chain.chainType === 'aelf') {
    const chainStatus = await checkRpcUrlFormat(chain);
    if (!nativeCurrency) {
      try {
        const tokenAddress = await getELFTokenAddress(chain.rpcUrl, chainStatus.GenesisContractAddress);
        nativeCurrency = {
          id: '', // TODO
          name: 'ELF',
          symbol: 'ELF',
          decimals: 8,
          address: tokenAddress,
        };
        basicContracts = { tokenContract: tokenAddress };
      } catch (error) {
        throw new Error(ChainActionError.InvalidRpcUrl);
      }
    }
  } else {
    throw Error('Not Support');
  }

  return Object.assign(
    { ...chain, networkName: chain.networkName.trim(), key, isCustom },
    { nativeCurrency, basicContracts },
  );
});

export const removeCustomChainItem = createAction<ChainItemType>('chain/removeCustomChainItem');

export const updateCustomChainItem = createAsyncThunk('chain/updateCustomChainItem', async (chain: ChainItemType) => {
  await checkRpcUrlFormat(chain);
  return chain;
});

// CustomChain action
export class CustomChain {
  static add(chain: ChainItemType) {
    return async (dispatch: any) => {
      await dispatch(addCustomChainItem(chain));
    };
  }
  static remove(chain: ChainItemType) {
    return (dispatch: any) => {
      dispatch(removeCustomChainItem(chain));
    };
  }
  static update(chain: ChainItemType) {
    return (dispatch: any) => {
      dispatch(updateCustomChainItem(chain));
    };
  }
}

// CommonListAction
export class CommonListAction {
  static add(p: { rpcUrl: string }) {
    return addCommonList(p);
  }
  static remove(p: { rpcUrl: string }) {
    return removeCommonList(p);
  }
}
