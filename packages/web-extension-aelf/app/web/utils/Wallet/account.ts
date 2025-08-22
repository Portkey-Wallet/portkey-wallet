import { getNetwork, getWalletsInfo } from 'utils/lib/SWGetReduxStore';
import { handleAccounts } from '@portkey-wallet/utils/dappEOA';

export const getAccountsObject = async () => {
  const [wallet, networkInfo] = await Promise.all([getWalletsInfo(), getNetwork()]);

  return handleAccounts(wallet, networkInfo);
};
