import { request } from '@portkey-wallet/api/api-did';
import { ChainId } from '@portkey-wallet/types';
import { LoginKeyType } from '@portkey-wallet/types/types-ca/wallet';
import { sleep } from '.';

export interface IAccelerateGuardian {
  type: LoginKeyType;
  verifierId: string;
  identifierHash: string;
  salt: string;
  isLoginAccount: boolean;
  transactionId: string;
  chainId: ChainId;
}

type CheckSecurityResult = {
  isTransferSafe: boolean;
  isSynchronizing: boolean;
  isOriginChainSafe: boolean;
  accelerateGuardians: IAccelerateGuardian[];
};

export const checkSecurity = async (caHash: string, chainId: ChainId): Promise<CheckSecurityResult> => {
  return await request.security.balanceCheck({
    params: {
      caHash,
      chainId,
    },
  });
};

export const getAccelerateGuardianTxId = async (caHash: string, accelerateChainId: ChainId, originChainId: ChainId) => {
  console.log('getAccelerateGuardianTxId', accelerateChainId, originChainId);
  let isTimeout = false;
  let isSafe = false;
  const timer = setTimeout(() => {
    isTimeout = true;
  }, 10 * 1000);

  let transactionId: string | undefined;
  let retryCount = 0;
  while (retryCount < 5 && !transactionId) {
    let accelerateGuardians: IAccelerateGuardian[] = [];
    try {
      const result = await checkSecurity(caHash, accelerateChainId);
      console.log('checkSecurity result', result);
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
        transactionId = _accelerateGuardian.transactionId;
        break;
      }
    }

    retryCount++;
    if (isTimeout) break;
    await sleep(1000);
    if (isTimeout) break;
  }

  clearTimeout(timer);
  return {
    isSafe,
    transactionId,
  };
};
