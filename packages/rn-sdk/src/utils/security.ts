// import { checkSecurity } from '@portkey-wallet/utils/securityTest';
import { ChainId } from '@portkey/provider-types';
import ActionSheet from 'components/ActionSheet';
import WalletSecurityOverlay from 'components/WalletSecurityOverlay';
import WalletSecurityAccelerate from 'components/WalletSecurityAccelerate';
import { NetworkController } from 'network/controller';
import { LoginKeyType } from 'packages/types/types-ca/wallet';
import { sleep } from '@portkey-wallet/utils';

export interface IAccelerateGuardian {
  type: LoginKeyType;
  verifierId: string;
  identifierHash: string;
  salt: string;
  isLoginAccount: boolean;
  transactionId: string;
  chainId: ChainId;
}
export const getAccelerateGuardianTxId = async (caHash: string, accelerateChainId: ChainId, originChainId: ChainId) => {
  let isTimeout = false;
  let isSafe = false;
  const timer = setTimeout(() => {
    isTimeout = true;
  }, 10 * 1000);

  let accelerateGuardian: IAccelerateGuardian | undefined;
  let retryCount = 0;
  while (retryCount < 5 && !accelerateGuardian) {
    console.log('retryCount', retryCount);
    let accelerateGuardians: IAccelerateGuardian[] = [];
    try {
      const result = await NetworkController.checkTransferSecurity({
        caHash,
        targetChainId: accelerateChainId,
      });

      if (result.isTransferSafe) {
        isSafe = true;
        break;
      }
      accelerateGuardians = result.accelerateGuardians;
    } catch (error) {
      console.log('retry checkSecurity error', error);
    }

    if (Array.isArray(accelerateGuardians)) {
      const _accelerateGuardian = accelerateGuardians.find(
        item => item.transactionId && item.chainId === originChainId,
      );
      if (_accelerateGuardian) {
        accelerateGuardian = _accelerateGuardian;
        break;
      }
    }

    retryCount++;
    if (isTimeout) break;
    await sleep(2000);
    if (isTimeout) break;
  }

  clearTimeout(timer);
  return {
    isSafe,
    accelerateGuardian,
  };
};

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
  console.log('originChainId', originChainId, 'accelerateChainId', accelerateChainId);

  const { isTransferSafe, isSynchronizing, isOriginChainSafe, accelerateGuardians } =
    await NetworkController.checkTransferSecurity({
      caHash,
      targetChainId: accelerateChainId,
    });

  console.log(
    'checkSecurity',
    JSON.stringify({ isTransferSafe, isSynchronizing, isOriginChainSafe, accelerateGuardians }),
  );
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
