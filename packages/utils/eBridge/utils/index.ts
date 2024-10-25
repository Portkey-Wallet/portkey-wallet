import Web3 from 'web3';
import { AbiItem } from 'web3-utils/types';
import { TChainType, TLimitData } from '../types';
import { IContract } from '@portkey/types';

export const getHttpProvider = (rpcUrl: string) => {
  return new Web3.providers.HttpProvider(rpcUrl);
};

export const getEVMContract = (rpcUrl: string, ABI: AbiItem, address: string) => {
  const web3 = new Web3(getHttpProvider(rpcUrl));
  const contract = new web3.eth.Contract(ABI, address);
  return contract;
};

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
