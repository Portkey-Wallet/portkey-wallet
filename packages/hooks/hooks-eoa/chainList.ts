import { useEffect, useMemo, useCallback } from 'react';
import { useAppCommonDispatch } from '../index';
import { getChainListAsync } from '@portkey-wallet/store/store-eoa/wallet/actions';
// import { useCurrentWallet, useOriginChainId, useWallet } from './wallet';
import { ChainId } from '@portkey-wallet/types';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useCurrentNetwork, useIsMainnet } from './network';
import { useWalletListState, useWalletState } from './wallet';

export function useChainListFetch() {
  const currentNetwork = useCurrentNetwork();
  const dispatch = useAppCommonDispatch();
  useEffect(() => {
    dispatch(getChainListAsync());
  }, [dispatch, currentNetwork]);
}

export function useCurrentChainList() {
  const currentNetwork = useCurrentNetwork();
  const { chainInfo } = useWalletState();
  return useMemo(() => chainInfo?.[currentNetwork], [chainInfo, currentNetwork]);
}
export const useOriginChainId = () => {
  return 'AELF';
};

export function useCurrentChain(_chainId?: ChainId) {
  const originChainId = useOriginChainId();
  const chainId = useMemo(() => _chainId || originChainId, [_chainId, originChainId]);
  const currentChainList = useCurrentChainList();
  return useMemo(() => currentChainList?.find(chain => chain.chainId === chainId), [currentChainList, chainId]);
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
  const chainInfo = useCurrentChain(_chainId);
  return chainInfo?.defaultToken || DEFAULT_TOKEN;
}

// export function useIsValidSuffix() {
//   const currentChainList = useCurrentChainList();
//   const chainIdArr = useMemo(() => currentChainList?.map(chain => chain.chainId as string) || [], [currentChainList]);
//   return useCallback(
//     (suffix?: string) => {
//       if (!suffix) return false;
//       return chainIdArr.includes(suffix);
//     },
//     [chainIdArr],
//   );
// }

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
