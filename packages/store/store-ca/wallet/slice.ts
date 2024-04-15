import { NetworkType } from '@portkey-wallet/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { checkPassword } from './utils';
import {
  changePin,
  createNewTmpWalletAction,
  createWalletAction,
  getCaHolderInfoAsync,
  resetCaInfo,
  reSetCheckManagerExceed,
  resetWallet,
  setCAInfo,
  setCAInfoType,
  setChainListAction,
  setCheckManagerExceed,
  setManagerInfo,
  setOriginChainId,
  setNickNameAndAvatarAction,
  resetCurrentUserInfoAction,
  updateCASyncState,
} from './actions';
import { WalletError, WalletState } from './type';
import { changeEncryptStr } from '../../wallet/utils';

const initialState: WalletState = {
  walletAvatar: `master${(Math.floor(Math.random() * 10000) % 6) + 1}`, // to be scrapped, please use userInfo.avatar
  walletType: 'aelf',
  currentNetwork: 'MAINNET',
  chainList: [],
  chainInfo: {},
  userInfo: {},
};
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    changeNetworkType: (state, action: PayloadAction<NetworkType>) => {
      state.currentNetwork = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // do not reset chain information
      .addCase(resetWallet, state => ({ ...initialState, chainInfo: state.chainInfo }))
      .addCase(createWalletAction, (state, action) => {
        if (state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.walletExists);
        const currentNetwork = action.payload.networkType || state.currentNetwork || initialState.currentNetwork;
        const caInfo = action.payload.caInfo;
        if (caInfo && !caInfo?.originChainId) {
          caInfo.originChainId = state.originChainId;
        }

        state.walletInfo = {
          ...action.payload.walletInfo,
          caInfo: { [currentNetwork]: caInfo } as any,
        };
        console.log('wfs state.walletInfo', state.walletInfo);
      })
      .addCase(createNewTmpWalletAction, (state, action) => {
        state.tmpWalletInfo = {
          ...action.payload.walletInfo,
        };
      })
      .addCase(setCAInfo, (state, action) => {
        const { pin, caInfo, chainId } = action.payload;
        // check pin
        checkPassword(state.walletInfo?.AESEncryptMnemonic, pin);
        const currentNetwork = action.payload.networkType || state.currentNetwork || initialState.currentNetwork;
        if (!state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.noCreateWallet);
        state.walletInfo.caInfo[currentNetwork] = {
          ...state.walletInfo.caInfo[currentNetwork],
          [chainId]: caInfo,
        } as any;
        console.log('wfs setCAInfo', state, 'action', action);
        console.log('wfs setCAInfo currentNetwork', currentNetwork);
        console.log('wfs setCAInfo cainfo', {
          ...state.walletInfo.caInfo[currentNetwork],
          [chainId]: caInfo,
        });
      })
      .addCase(updateCASyncState, (state, action) => {
        const { chainId, networkType } = action.payload;
        // check pin
        const currentNetwork = networkType || state.currentNetwork || initialState.currentNetwork;
        if (!state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.noCreateWallet);
        const caInfo = state.walletInfo.caInfo[currentNetwork][chainId];
        if (!caInfo) throw new Error(WalletError.caAccountNotExists);
        state.walletInfo.caInfo[currentNetwork][chainId] = { ...caInfo, isSync: true };
        console.log('wfs updateCASyncState', state, 'action', action);
        console.log('wfs updateCASyncState currentNetwork', currentNetwork);
        console.log('wfs updateCASyncState chainId', chainId);
        console.log('wfs updateCASyncState cainfo', { ...caInfo, isSync: true });
      })

      .addCase(setManagerInfo, (state, action) => {
        const { pin, managerInfo } = action.payload;
        // check pin
        checkPassword(state.walletInfo?.AESEncryptMnemonic, pin);
        const currentNetwork = action.payload.networkType || state.currentNetwork || initialState.currentNetwork;
        if (!state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.noCreateWallet);
        if (state.walletInfo.caInfo[currentNetwork]?.managerInfo) throw new Error(WalletError.caAccountExists);
        state.walletInfo.caInfo[currentNetwork] = { originChainId: state.originChainId, managerInfo };
        console.log('wfs setManagerInfo', state, 'action', action);
        console.log('wfs setManagerInfo currentNetwork', currentNetwork);
        // console.log('setManagerInfo chainId', chainId);
        console.log('wfs setManagerInfo cainfo', { originChainId: state.originChainId, managerInfo });
      })
      .addCase(changePin, (state, action) => {
        const { pin, newPin } = action.payload;
        // check pin
        checkPassword(state.walletInfo?.AESEncryptMnemonic, pin);
        if (!state.walletInfo) throw new Error(WalletError.noCreateWallet);
        state.walletInfo.AESEncryptMnemonic = changeEncryptStr(state.walletInfo.AESEncryptMnemonic, pin, newPin);
        state.walletInfo.AESEncryptPrivateKey = changeEncryptStr(state.walletInfo.AESEncryptPrivateKey, pin, newPin);
      })
      .addCase(setChainListAction, (state, action) => {
        const { chainList, networkType } = action.payload;
        if (!state.chainInfo) state.chainInfo = { [networkType]: chainList };
        state.chainInfo[networkType] = chainList;
      })
      .addCase(setCAInfoType, (state, action) => {
        const { pin, networkType, caInfo } = action.payload;
        const currentNetwork = networkType || state.currentNetwork || initialState.currentNetwork;
        // check pin
        checkPassword(state.walletInfo?.AESEncryptMnemonic, pin);
        if (!state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.noCreateWallet);
        state.walletInfo.caInfo = { ...state.walletInfo.caInfo, [currentNetwork]: caInfo };
        console.log('wfs setCAInfoType', state, 'action', action);
        console.log('wfs setCAInfoType currentNetwork', currentNetwork);
        // console.log('setCAInfoType chainId', chainId);
        console.log('wfs setCAInfoType cainfo', { ...state.walletInfo.caInfo, [currentNetwork]: caInfo });
      })
      .addCase(getCaHolderInfoAsync.fulfilled, (state, action) => {
        const { nickName, userId, avatar, currentNetwork = 'MAINNET' } = action.payload || {};

        if (nickName && userId) {
          state.userInfo = {
            ...state.userInfo,
            [currentNetwork]: {
              nickName,
              userId,
              avatar,
            },
          };
        }
      })
      .addCase(setNickNameAndAvatarAction, (state, action) => {
        const { avatar, nickName, networkType = 'MAINNET' } = action.payload;
        state.userInfo = {
          ...(state.userInfo || {}),
          [networkType]: {
            ...(state?.userInfo?.[networkType] || {}),
            nickName,
            avatar,
          },
        };
      })
      .addCase(resetCurrentUserInfoAction, (state, action) => {
        const networkType = action.payload;
        state.userInfo = {
          ...(state.userInfo || {}),
          [networkType]: {
            nickName: '',
            avatar: '',
            userId: '',
          },
        };
      })
      .addCase(setOriginChainId, (state, action) => {
        state.originChainId = action.payload;
      })
      .addCase(resetCaInfo, (state, action) => {
        if (!state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.noCreateWallet);
        const caInfo = state.walletInfo.caInfo;
        if (caInfo?.[action.payload]) delete caInfo[action.payload];
        state.walletInfo.caInfo = caInfo;
        console.log('wfs resetCaInfo', state, 'action', action);
        // console.log('wfs resetCaInfo currentNetwork', currentNetwork);
        // console.log('resetCaInfo chainId', chainId);
        console.log('wfs resetCaInfo cainfo', caInfo);
      })
      .addCase(setCheckManagerExceed, (state, { payload }) => {
        const { network } = payload;
        state.checkManagerExceedMap = {
          ...state.checkManagerExceedMap,
          [network]: true,
        };
      })
      .addCase(reSetCheckManagerExceed, (state, { payload }) => {
        if (payload) {
          const _checkManagerExceedMap = state.checkManagerExceedMap;
          if (_checkManagerExceedMap && _checkManagerExceedMap[payload]) delete _checkManagerExceedMap[payload];
          state.checkManagerExceedMap = _checkManagerExceedMap;
        } else {
          state.checkManagerExceedMap = {};
        }
      });
  },
});
