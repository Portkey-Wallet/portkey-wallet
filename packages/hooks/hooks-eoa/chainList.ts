import { useCallback, useMemo } from 'react';
import { ChainId } from '@portkey-wallet/types';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { useIsMainnet } from './network';
import { useChainList } from './network/chain';

export const useCurrentChainList = useChainList;

export const useOriginChainId = () => {
  return 'AELF' as ChainId;
};

export function useCurrentChain(_chainId: ChainId) {
  const currentChainList = useCurrentChainList();
  return useMemo(() => currentChainList?.find(chain => chain.chainId === _chainId), [currentChainList, _chainId]);
}

export function useExplorerUrl(chainId: ChainId) {
  const isMainNet = useIsMainnet();
  const exploreUrl = useMemo(() => {
    let exploreUrlPrefix = undefined;
    if (isMainNet) {
      exploreUrlPrefix = 'https://aelfscan.io/';
    } else {
      exploreUrlPrefix = 'https://testnet.aelfscan.io/';
    }
    return exploreUrlPrefix + `/${chainId}`;
  }, [chainId, isMainNet]);
  return exploreUrl;
}

export function useDefaultToken(_chainId?: ChainId) {
  const chainInfo = useCurrentChain(_chainId || 'AELF');
  return chainInfo?.defaultToken || DEFAULT_TOKEN;
}

export function useIsValidSuffix() {
  const currentChainList = useCurrentChainList();

  const chainIdArr = useMemo(() => currentChainList?.map(chain => chain.chainId as string) || [], [currentChainList]);
  return useCallback(
    (suffix?: string) => {
      if (!suffix) return false;
      return chainIdArr.includes(suffix);
    },
    [chainIdArr],
  );
}

// export function useGetChainInfo() {
//   const currentChainList = useCurrentChainList();
//   const dispatch = useAppCommonDispatch();
//   return useCallback(
//     async (originChainId: ChainId) => {
//       let _chainInfo;
//       if (currentChainList) {
//         _chainInfo = currentChainList.find(item => item.chainId === originChainId);
//       }
//       if (!_chainInfo) {
//         const chainList = await dispatch(getChainListAsync());
//         if (Array.isArray(chainList.payload)) {
//           _chainInfo = chainList.payload[0].find((item: any) => item.chainId === originChainId);
//         }
//       }
//       return _chainInfo;
//     },
//     [currentChainList, dispatch],
//   );
// }

// export function useGetChain() {
//   const currentChainList = useCurrentChainList();
//   return useCallback(
//     (chainId?: ChainId) => {
//       return currentChainList?.find(chain => chain.chainId === chainId);
//     },
//     [currentChainList],
//   );
// }

// export const useDAppChain = () => {
//   const currentChainList = useCurrentChainList();
//   return useMemo(() => currentChainList?.find(item => item.chainId !== MAIN_CHAIN_ID), [currentChainList]);
// };

// export const useDAppChainId = () => {
//   const dAppChain = useDAppChain();
//   return useMemo(() => dAppChain?.chainId || 'tDVV', [dAppChain?.chainId]);
// };
