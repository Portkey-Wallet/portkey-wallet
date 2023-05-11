import {
  addAccount,
  addAndReplaceAccount,
  importAccount,
  setCurrentAccount,
} from '@portkey-wallet/store/wallet/actions';
import { setAccountConnectModal } from 'store/reducers/modal/slice';
import { getCurrentTab } from 'utils/platforms';
import { getConnections } from 'utils/storage/storage.utils';

const promptForAccountConnection = async (dispatch: any, address?: string) => {
  const currentTab = await getCurrentTab();
  const url = currentTab?.url;
  if (!url) return;
  const _origin = new URL(url).origin;
  const connections = await getConnections();
  const permission = connections[_origin]?.permission;
  if (!permission?.accountList?.length) return;
  if (address && permission.accountList.some((account) => account === address)) return;
  dispatch(setAccountConnectModal(true));
};

export const addAccountAndConnect = (params: { password: string; accountName?: string }) => async (dispatch: any) => {
  const res = dispatch(addAccount(params));
  await promptForAccountConnection(dispatch);
  return res;
};

export const importAccountAndConnect =
  (params: { password: string; privateKey: string; accountName?: string }) => async (dispatch: any) => {
    const res = dispatch(importAccount(params));
    await promptForAccountConnection(dispatch);
    return res;
  };

export const addAndReplaceAccountAndConnect =
  (params: { password: string; accountName?: string }) => async (dispatch: any) => {
    const res = dispatch(addAndReplaceAccount(params));
    await promptForAccountConnection(dispatch);
    return res;
  };

export const setCurrentAccountAndConnect = (params: { address: string; password: string }) => async (dispatch: any) => {
  const res = dispatch(setCurrentAccount(params));
  console.log(res, 'res==');
  await promptForAccountConnection(dispatch, params.address);
  return res;
};
