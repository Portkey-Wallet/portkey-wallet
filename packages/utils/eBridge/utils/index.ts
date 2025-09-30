import { TChainType, TLimitData } from '../types';
import { IContract } from '@portkey/types';
import { CHAIN_ID_MAP } from '../constants';

export function getChainIdByMap(chainId?: any) {
  const id = (CHAIN_ID_MAP as any)[chainId as any];
  if (id) return id;
  return chainId;
}

export async function getReceiptLimit({
  limitContract,
  toChainId,
  target,
  type,
}: {
  limitContract?: IContract;
  toChainId?: string;
  target: string;
  type: TChainType;
}): Promise<TLimitData> {
  if (!limitContract || !toChainId) {
    throw new Error('Incorrect parameters');
  }

  const [receiptDailyLimit, receiptTokenBucket] = await Promise.all(
    type === 'evm'
      ? [
          limitContract?.callViewMethod('getReceiptDailyLimit', [target, toChainId]),
          limitContract?.callViewMethod('getCurrentReceiptTokenBucketState', [target, toChainId]),
        ]
      : [
          limitContract?.callViewMethod('getReceiptDailyLimit', {
            symbol: target,
            targetChain: toChainId,
          }),
          limitContract?.callViewMethod('GetCurrentReceiptTokenBucketState', {
            symbol: target,
            targetChain: toChainId,
          }),
        ],
  );
  if (receiptDailyLimit.error || receiptTokenBucket.error) {
    throw new Error(receiptDailyLimit.error?.message || receiptTokenBucket.error?.message);
  }

  return {
    remain: receiptDailyLimit.data.tokenAmount,
    maxCapacity: receiptTokenBucket.data.tokenCapacity,
    currentCapacity: receiptTokenBucket.data.currentTokenAmount,
    fillRate: receiptTokenBucket.data.rate,
    isEnable: !!receiptTokenBucket.data.isEnabled,
  };
}

export async function getSwapLimit({
  limitContract,
  toChainId,
  target,
  type,
}: {
  limitContract?: IContract;
  toChainId?: string;
  target: string;
  type: TChainType;
}): Promise<TLimitData | undefined> {
  if (!limitContract || !toChainId) {
    throw new Error('Incorrect parameters');
  }

  const [receiptDailyLimit, receiptTokenBucket] = await Promise.all(
    type === 'evm'
      ? [
          limitContract?.callViewMethod('getReceiptDailyLimit', [target, toChainId]),
          limitContract?.callViewMethod('getCurrentReceiptTokenBucketState', [target, toChainId]),
        ]
      : [
          limitContract?.callViewMethod('getReceiptDailyLimit', {
            symbol: target,
            targetChain: toChainId,
          }),
          limitContract?.callViewMethod('GetCurrentReceiptTokenBucketState', {
            symbol: target,
            targetChain: toChainId,
          }),
        ],
  );
  if (receiptDailyLimit.error || receiptTokenBucket.error) {
    throw new Error(receiptDailyLimit.error?.message || receiptTokenBucket.error?.message);
  }

  return {
    remain: receiptDailyLimit.data.tokenAmount,
    maxCapacity: receiptTokenBucket.data.tokenCapacity,
    currentCapacity: receiptTokenBucket.data.currentTokenAmount,
    fillRate: receiptTokenBucket.data.rate,
    isEnable: receiptTokenBucket.data.isEnabled,
  };
}
