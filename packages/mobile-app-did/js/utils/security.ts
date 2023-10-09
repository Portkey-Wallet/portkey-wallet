import { checkSecurity } from '@portkey-wallet/utils/securityTest';
import ActionSheet from 'components/ActionSheet';
import WalletSecurityOverlay from 'components/WalletSecurityOverlay';

export const guardianSyncingAlert = () => {
  // TODO: change text
  ActionSheet.alert({
    title2: 'Syncing guardian info, which may take 1-2 minutes. Please try again later.',
    buttons: [{ title: 'OK' }],
  });
};

export async function checkSecuritySafe(caHash: string, isOrigin?: boolean) {
  const { isTransferSafe, isSynchronizing, isOriginChainSafe } = await checkSecurity(caHash);
  if (isOrigin) {
    if (!isOriginChainSafe) WalletSecurityOverlay.alert();
    return isOriginChainSafe;
  }
  if (isTransferSafe) return true;
  if (isSynchronizing) {
    guardianSyncingAlert();
  } else {
    WalletSecurityOverlay.alert();
  }
  return false;
}
