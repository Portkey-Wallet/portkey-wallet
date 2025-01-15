import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCallback } from 'react';
import AElf from 'aelf-sdk';
import getDecodedTxData from 'utils/sandboxUtil/getDecodedTxData';

export function useDecodeTx() {
  const currentChainList = useCurrentChainList();
  return useCallback(
    async (raw: string) => {
      const instanceList = currentChainList
        ?.map((item) => {
          if (item?.endPoint) {
            return new AElf(new AElf.providers.HttpProvider(item.endPoint));
          }
          return null;
        })
        .filter((instance) => instance !== null);
      if (!instanceList || instanceList.length === 0) {
        throw new Error('No valid instances found');
      }
      const promises = currentChainList?.map((chainInfo) =>
        getDecodedTxData({ chainInfo, raw, rpcUrl: chainInfo.endPoint }),
      );
      if (!promises || promises.length === 0) {
        throw new Error('Failed to decode transaction on all chains');
      }
      function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
        return new Promise((resolve, reject) => {
          const errors: any[] = [];
          let pending = promises.length;
          if (pending === 0) {
            return reject('All promises were rejected');
          }
          promises.forEach((promise, index) => {
            Promise.resolve(promise)
              .then(resolve)
              .catch((error) => {
                errors[index] = error;
                pending -= 1;
                if (pending === 0) {
                  reject('All promises were rejected');
                }
              });
          });
        });
      }
      try {
        const res = await promiseAny(promises);
        return res;
      } catch (error) {
        console.error('All promises failed:', error);
        throw new Error('Failed to decode transaction on all chains');
      }
    },
    [currentChainList],
  );
}
