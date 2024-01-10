import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DefaultChain } from '@portkey-wallet/constants/network';
import { ChainItemType } from '@portkey-wallet/types/chain';
import { ChainActionError, ChainState } from './types';
import { checkNetworkName } from './utils';
import { addCustomChainItem, fetchChainListAsync, updateCustomChainItem } from './actions';

const initialState: ChainState = {
  currentChain: DefaultChain,
  networkType: 'MAINNET',
  chainList: [],
  commonList: [],
  rmCommonList: [],
};
const combineList = (
  list: ChainItemType[],
  customList: ChainItemType[],
  commonList: string[],
  rmCommonList: string[],
) => {
  return list
    ?.map(item => {
      let isCommon = item.isCommon;
      if (item.isFixed) {
        isCommon = true;
      } else if (commonList?.includes(item.rpcUrl)) {
        isCommon = true;
      } else if (rmCommonList?.includes(item.rpcUrl)) {
        isCommon = false;
      }
      if (isCommon) (commonList ?? []).push(item.rpcUrl);
      return {
        ...item,
        isCommon,
        key: `${item.rpcUrl}&${item.networkName}`,
      };
    })
    .concat(customList as any);
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setCurrentChain: (state, action: PayloadAction<{ rpcUrl: string }>) => {
      const { rpcUrl } = action.payload;
      console.log(state.chainList, 'chainList===setCurrentChain');
      const findItem = state.chainList.find(item => item.rpcUrl === rpcUrl);
      if (!findItem) throw new Error(ChainActionError.notExist);
      state.currentChain = findItem;
    },
    removeCustomChainItem: (state, action: PayloadAction<ChainItemType>) => {
      const chain = action.payload;
      const isCurrentChain = state.currentChain.key === chain.key;
      if (isCurrentChain) state.currentChain = DefaultChain;
      state.chainList = state.chainList.filter(item => item.key !== chain.key);
      if (state.rmCommonList?.includes(chain.rpcUrl)) state.rmCommonList.filter(item => item !== chain.rpcUrl);
      if (state.commonList?.includes(chain.rpcUrl)) state.commonList.filter(item => item !== chain.rpcUrl);
    },
    addCommonList: (state, action: PayloadAction<{ rpcUrl: string }>) => {
      const { rpcUrl } = action.payload;
      // if (state.commonList?.includes(rpcUrl)) throw new Error('This RPC has already been added.');
      state.rmCommonList = (state.rmCommonList ?? []).filter(item => item !== rpcUrl);
      state.commonList ? state.commonList.push(rpcUrl) : (state.commonList = [rpcUrl]);
      state.chainList = state.chainList.map(item => {
        if (item.rpcUrl === rpcUrl) return { ...item, isCommon: true };
        return item;
      });
    },
    removeCommonList: (state, action: PayloadAction<{ rpcUrl: string }>) => {
      const { rpcUrl } = action.payload;
      state.commonList = (state.commonList ?? []).filter(item => item !== rpcUrl);
      state.rmCommonList ? state.rmCommonList.push(rpcUrl) : (state.rmCommonList = [rpcUrl]);
      state.chainList = state.chainList.map(item => {
        if (item.rpcUrl === rpcUrl) return { ...item, isCommon: false };
        return item;
      });
    },
    resetNetwork: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchChainListAsync.fulfilled, (state, action) => {
        const network = action.payload.data?.[0]?.attributes?.network;
        const customChainList: ChainItemType[] = state.chainList?.filter(item => item.isCustom) ?? [];

        state.commonList = Array.from(new Set(state.commonList ?? []));
        state.rmCommonList = Array.from(new Set(state.rmCommonList ?? []));
        const _chainList = combineList(network, customChainList, state.commonList, state.rmCommonList);
        state.currentChain = _chainList.find(item => item.rpcUrl === state.currentChain.rpcUrl) ?? DefaultChain;
        state.chainList = _chainList;
      })
      .addCase(fetchChainListAsync.rejected, (_state, action) => {
        throw Error(action.error.message);
      })
      .addCase(addCustomChainItem.fulfilled, (state, action: PayloadAction<ChainItemType>) => {
        const chain = action.payload;
        let error: undefined | string;
        const flag = state.chainList.some(item => {
          if (item.rpcUrl === chain.rpcUrl) error = ChainActionError.hasRpcUrl;
          else if (item.networkName === chain.networkName) error = ChainActionError.hasName;
          return !!error;
        });
        if (flag) throw new Error(error);
        state.chainList = state.chainList.concat(chain);
      })
      .addCase(addCustomChainItem.rejected, (_, action) => {
        throw action.error;
      })
      // updateCustomChainItem
      .addCase(updateCustomChainItem.fulfilled, (state, action: PayloadAction<ChainItemType>) => {
        const chain = action.payload;
        const isCurrentChain = state.currentChain.key === chain.key;
        checkNetworkName(state.chainList, chain.networkName, undefined, chain.key);
        let error: undefined | string;
        const flag = state.chainList.some(item => {
          if (item.key === chain.key) return false;
          if (item.rpcUrl === chain.rpcUrl) error = ChainActionError.hasRpcUrl;
          else if (item.networkName === chain.networkName) error = ChainActionError.hasName;
          return !!error;
        });
        if (flag) throw new Error(error);
        if (isCurrentChain) state.currentChain = { ...chain, key: `${chain.rpcUrl}&${chain.networkName}` };
        state.chainList = state.chainList.map(item =>
          item.key === chain.key ? { ...chain, key: `${chain.rpcUrl}&${chain.networkName}` } : item,
        );
      })
      .addCase(updateCustomChainItem.rejected, (_state, action) => {
        throw action.error;
      });
  },
});

export default chainSlice;
