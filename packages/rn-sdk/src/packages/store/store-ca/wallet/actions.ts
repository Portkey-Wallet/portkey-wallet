import { getCaHolder } from 'packages/api/api-did/es/utils';
import { NetworkList } from 'packages/constants/constants-ca/network';
import { ChainId, NetworkType } from 'packages/types';
import { CAInfo, CAInfoType, ManagerInfo } from 'packages/types/types-ca/wallet';
import { WalletInfoType } from 'packages/types/wallet';
import { checkPinInput, formatWalletInfo } from 'packages/utils/wallet';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import AElf from 'aelf-sdk';
import { getChainList } from './api';
import { ChainItemType, WalletState } from './type';

export const createWallet =
  ({
    walletInfo,
    pin,
    networkType,
    caInfo,
  }: {
    walletInfo?: any;
    pin: string;
    networkType?: NetworkType;
    caInfo?: CAInfoType;
  }): any =>
  async (dispatch: any) => {
    // check pin
    const pinMessage = checkPinInput(pin);
    if (pinMessage) throw new Error(pinMessage);

    if (!walletInfo) walletInfo = AElf.wallet.createNewWallet();
    const walletObj = formatWalletInfo(walletInfo, pin, 'walletName');
    if (walletObj) {
      const { walletInfo: newWalletInfo } = walletObj;
      dispatch(createWalletAction({ walletInfo: newWalletInfo, networkType, caInfo }));
      return true;
    }
    throw new Error('createWallet fail');
  };
export const createWalletAction = createAction<{
  walletInfo: WalletInfoType;
  networkType?: NetworkType;
  caInfo?: CAInfoType;
}>('wallet/createWallet');

export const setManagerInfo = createAction<{
  networkType?: NetworkType;
  pin: string;
  managerInfo: ManagerInfo;
}>('wallet/setManagerInfo');

export const setCAInfo = createAction<{
  caInfo: CAInfo;
  pin: string;
  chainId: ChainId;
  networkType?: NetworkType;
}>('wallet/setCAInfo');

export const updateCASyncState = createAction<{
  chainId: ChainId;
  networkType?: NetworkType;
}>('wallet/updateCASyncState');
export const setCAInfoType = createAction<{
  caInfo: CAInfoType;
  pin: string;
  networkType?: NetworkType;
}>('wallet/setCAInfoType');

export const resetWallet = createAction('wallet/resetWallet');
export const resetCaInfo = createAction<NetworkType>('wallet/resetCaInfo');
export const changePin = createAction<{ pin: string; newPin: string }>('wallet/changePin');

export const changeNetworkType = createAction<NetworkType>('wallet/changeNetworkType');
export const setChainListAction = createAction<{ chainList: ChainItemType[]; networkType: NetworkType }>(
  'wallet/setChainListAction',
);

export const getChainListAsync = createAsyncThunk(
  'wallet/getChainList',
  async (type: NetworkType | undefined, { getState, dispatch }) => {
    const {
      wallet: { currentNetwork, originChainId },
    } = getState() as { wallet: WalletState };
    const _networkType = type ? type : currentNetwork;
    const baseUrl = NetworkList.find(item => item.networkType === _networkType)?.apiUrl;
    if (!baseUrl) throw Error('Unable to obtain the corresponding network');
    const response = await getChainList({ baseUrl });
    if (!response?.items) throw Error('No data');
    dispatch(setChainListAction({ chainList: response.items, networkType: _networkType }));
    return [response.items, response.items.find((item: any) => item.chainId === originChainId)];
  },
);

export const getCaHolderInfoAsync = createAsyncThunk<
  | {
      nickName: WalletState['walletName'];
      userId: WalletState['userId'];
    }
  | undefined,
  void
>('wallet/getCaHolderInfoAsync', async (_, thunkAPI) => {
  const {
    wallet: { currentNetwork, walletInfo },
  } = thunkAPI.getState() as {
    wallet: WalletState;
  };
  const baseUrl = NetworkList.find(item => item.networkType === currentNetwork)?.apiUrl;
  const caHash = walletInfo?.caInfo[currentNetwork].AELF?.caHash;
  if (!caHash || !baseUrl) return undefined;
  let caHolder;
  try {
    const response = await getCaHolder(baseUrl, {
      caHash,
    });
    console.log('getCaHolderEs', response);
    if (response.items && response.items.length > 0) {
      caHolder = response.items[0];
    }
  } catch (err) {
    console.log('getCaHolderEs: err', err);
  }
  if (!caHolder) return undefined;
  return {
    nickName: caHolder.nickName,
    userId: caHolder.userId,
  };
});

export const setWalletNameAction = createAction<string>('wallet/setWalletName');

export const setOriginChainId = createAction<ChainId>('wallet/setOriginChainId');
