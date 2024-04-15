import { checkSecurity } from '@portkey-wallet/utils/securityTest';
import { ChainId } from '@portkey/provider-types';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import WalletSecurityOverlay from '@portkey-wallet/rn-components/components/WalletSecurityOverlay';
import WalletSecurityAccelerate from '@portkey-wallet/rn-components/components/WalletSecurityAccelerate';

export const guardianSyncingAlert = () => {
  ActionSheet.alert({
    title2: 'Syncing guardian info, which may take 1-2 minutes. Please try again later.',
    buttons: [{ title: 'OK' }],
  });
};

export async function checkSecuritySafe({
  caHash,
  originChainId,
  accelerateChainId,
}: {
  caHash: string;
  originChainId: ChainId;
  accelerateChainId: ChainId;
}) {
  const isOrigin = originChainId === accelerateChainId;
  const { isTransferSafe, isSynchronizing, isOriginChainSafe, accelerateGuardians } = await checkSecurity(
    caHash,
    accelerateChainId,
  );

  console.log('checkSecurity', { isTransferSafe, isSynchronizing, isOriginChainSafe, accelerateGuardians });
  if (isTransferSafe) return true;
  if (isOrigin && isOriginChainSafe) return true;

  if (!isOrigin && isSynchronizing && isOriginChainSafe) {
    if (Array.isArray(accelerateGuardians)) {
      const accelerateGuardian = accelerateGuardians.find(item => item.transactionId && item.chainId === originChainId);
      WalletSecurityAccelerate.alert(accelerateChainId, originChainId, accelerateGuardian);
      return false;
    }

    WalletSecurityOverlay.alert(accelerateChainId);
    return false;
  }

  WalletSecurityOverlay.alert(accelerateChainId);
  return false;
}
