import { useMemo, useCallback } from 'react';
import AElf from 'aelf-sdk';
import { useAppCASelector } from '.';
import { useCurrentWalletInfo, useWallet } from './wallet';
import { useAppCommonDispatch } from '../index';
import { updateSessionInfo } from '@portkey-wallet/store/store-ca/dapp/actions';
import { useCurrentNetworkInfo } from './network';
import { NetworkType } from '@portkey-wallet/types';
import { SessionExpiredPlan, SessionInfo } from '@portkey-wallet/types/session';
import { formatExpiredTime, signSession } from '@portkey-wallet/utils/session';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { getRawParams } from '@portkey-wallet/utils/dapp/decodeTx';
import { useCurrentChainList } from './chainList';
export const useDapp = () => useAppCASelector(state => state.dapp);
export const useDiscover = () => useAppCASelector(state => state.discover);

export const useCurrentDappList = () => {
  const { dappMap } = useDapp();
  const { currentNetwork } = useWallet();
  return useMemo(() => {
    return dappMap[currentNetwork];
  }, [currentNetwork, dappMap]);
};

export const useIsInCurrentDappList = () => {
  const list = useCurrentDappList();

  return useCallback(
    (origin: string): boolean => {
      return !!list?.some(ele => ele.origin === origin.trim());
    },
    [list],
  );
};

export const useCurrentDappInfo = (origin: string) => {
  const list = useCurrentDappList();
  return useMemo(() => list?.find(item => item.origin === origin), [list, origin]);
};

export const useUpdateSessionInfo = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { caHash } = useCurrentWalletInfo();
  return useCallback(
    (params: { networkType?: NetworkType; origin: string; expiredPlan?: SessionExpiredPlan; manager?: AElfWallet }) => {
      if (!caHash) return;
      let sessionInfo: SessionInfo | undefined = undefined;
      if (params.expiredPlan) {
        const { manager, expiredPlan } = params;
        if (!manager?.keyPair) return;
        const expiredTime = formatExpiredTime(expiredPlan);

        const baseSession = {
          origin: params.origin,
          expiredPlan,
          expiredTime,
          keyPair: manager.keyPair,
          managerAddress: manager.address,
          caHash,
        };

        const signature = signSession(baseSession);
        sessionInfo = {
          createTime: Date.now(),
          signature,
          expiredPlan,
          expiredTime,
        };
      }
      if (params.manager) delete params.manager;
      return dispatch(
        updateSessionInfo({
          ...params,
          networkType: params.networkType || networkType,
          sessionInfo,
        }),
      );
    },
    [caHash, dispatch, networkType],
  );
};
// export function useDecodeTx() {
//   const chainInfo = useCurrentChain('tDVV');
//   console.log('chainInfo is:', chainInfo);
//   const getDecodedTxData = useCallback(
//     async (raw: string) => {
//       const instance = new AElf(new AElf.providers.HttpProvider(chainInfo?.endPoint));
//       const res = await getRawParams(instance, raw);
//       return res;
//     },
//     [chainInfo?.endPoint],
//   );
//   return getDecodedTxData;
// }

export function useDecodeTx() {
  const currentChainList = useCurrentChainList();
  const getDecodedTxData = useCallback(
    async (raw: string) => {
      const instanceList = currentChainList
        ?.map(item => {
          if (item?.endPoint) {
            return new AElf(new AElf.providers.HttpProvider(item.endPoint));
          }
          return null;
        })
        .filter(instance => instance !== null);
      if (!instanceList || instanceList.length === 0) {
        throw new Error('No valid instances found');
      }
      const promises = instanceList?.map(instance => getRawParams(instance, raw));
      if (!promises || promises.length === 0) {
        throw new Error('Failed to decode transaction on all chains1');
      }
      function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
        return new Promise((resolve, reject) => {
          const errors: any[] = [];
          let pending = promises.length;
          if (pending === 0) {
            return reject(new AggregateError([], 'All promises were rejected'));
          }
          promises.forEach((promise, index) => {
            Promise.resolve(promise)
              .then(resolve)
              .catch(error => {
                errors[index] = error;
                pending -= 1;
                if (pending === 0) {
                  reject(new AggregateError(errors, 'All promises were rejected'));
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
        throw new Error('Failed to decode transaction on all chains2');
      }
    },
    [currentChainList],
  );
  return getDecodedTxData;
}
