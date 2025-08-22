import { getNetwork, getWalletsInfo } from 'utils/lib/SWGetReduxStore';
import { handleAccounts } from '@portkey-wallet/utils/dappEOA';
import SWEventController from 'controllers/SWEventController';

export const getAccountsObject = async () => {
  const [wallet, networkInfo] = await Promise.all([getWalletsInfo(), getNetwork()]);

  return handleAccounts(wallet, networkInfo);
};

export const SWEventDispatchAccountsChangedWithCurrentAccount = async () => {
  const accountsObject = await getAccountsObject();
  SWEventController.dispatchEvent({
    eventName: 'accountsChanged',
    data: accountsObject,
  });
};
