import { useCallback } from 'react';
import { useAppEOASelector } from '../index';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useAppCommonDispatch } from '../../index';
import { ChainId } from '@portkey-wallet/types';
import { addRecentItem, resetTargetIdRecent } from '@portkey-wallet/store/store-eoa/recent/slice';
import { IRecentItem } from '@portkey-wallet/store/store-eoa/recent/type';
import { useTransferNetworkConfig } from '../config';
import { useContact } from '../contact';
import { TFormattedRecentItem } from '@portkey-wallet/types/types-eoa/contact';
import { getAelfAddress } from '@portkey-wallet/utils/aelf';
import { getChainIdByAddress, isSameAddresses } from '@portkey-wallet/utils';
import { useCurrentAccount, useUniqueIdentify, useUniqueIdentifyAnotherNetwork } from '../wallet';

export const useRecentState = () => useAppEOASelector(state => state?.recent);

export function useRecent() {
  const dispatch = useAppCommonDispatch();
  const currentAccount = useCurrentAccount();
  const currentNetwork = useCurrentNetwork();

  const id = useUniqueIdentify();
  const anotherId = useUniqueIdentifyAnotherNetwork();

  const { contactMap } = useContact();
  const { recentMap } = useRecentState();
  const { fetchAssetSupportConfig, checkIsSupportTargetChain } = useTransferNetworkConfig();

  const getRecentList = useCallback(() => recentMap?.[id] || [], [id, recentMap]);

  const getFilterRecentList = useCallback(
    ({ fromChainId, tokenId, isFt }: { fromChainId: ChainId; tokenId: string; isFt: boolean }) => {
      fetchAssetSupportConfig();
      const targetList = recentMap?.[id] || [];

      // aelf is OK, others need check
      const result = targetList.filter(ele => {
        // itself
        if (ele.network === 'aelf' && fromChainId === ele.chainId && getAelfAddress(ele.address) === '') {
          return false;
        }

        if (ele.network === 'aelf') return true;
        // nft just for aelf chain
        if (!isFt) return ele.network === 'aelf' && !!ele.chainId;

        return checkIsSupportTargetChain({ fromChainId, symbol: tokenId, network: ele.network });
      });

      return result || [];
    },
    [fetchAssetSupportConfig, recentMap, id, checkIsSupportTargetChain],
  );

  // adjust my contact
  const getTransformedRecentList = useCallback(
    (params: { fromChainId: ChainId; tokenId: string; isFt: boolean }): TFormattedRecentItem[] => {
      const { isFt } = params;
      const result = getFilterRecentList(params);

      const list = result
        .map(ele => {
          // nft adjust
          if (!isFt && !!ele.network && ele.network !== 'aelf') return;

          const addr = getAelfAddress(ele.address);

          const target = contactMap?.[currentNetwork]?.[addr] || [];

          const aelfResult = target.find(
            m =>
              m.addressInfo?.address === addr &&
              m?.addressInfo?.chainId === ele?.chainId &&
              m.addressInfo?.network === 'aelf',
          );
          const otherResult = target.find(
            m =>
              m.addressInfo?.address === addr &&
              m?.addressInfo?.network === ele?.network &&
              m.addressInfo?.network !== 'aelf',
          );

          if (aelfResult) return { ...aelfResult, ...ele };
          if (otherResult) return { ...otherResult, ...ele };

          if (
            isSameAddresses(getAelfAddress(ele.address), currentAccount?.address || '') &&
            getChainIdByAddress(ele.address) === params.fromChainId
          )
            return;

          if (isSameAddresses(getAelfAddress(ele.address), currentAccount?.address || '')) {
            return {
              ...ele,
              addressInfo: {
                network: ele.network,
                networkName: ele.network,
                chainId: ele.chainId,
                networkImage: ele.networkIcon || '',
                address: ele.address,
              },
            };
          }
          return ele;
        })
        .filter(i => !!i);

      // return list;
      return (list || []) as TFormattedRecentItem[];
    },
    [contactMap, currentAccount?.address, currentNetwork, getFilterRecentList],
  );

  const checkAddressIsRecent = useCallback(
    (props: { fromChainId: ChainId; tokenId: string; isFt: boolean; address: string }) => {
      const _list = getFilterRecentList(props);
      return !!_list.find(ele => ele.address === props.address);
    },
    [getFilterRecentList],
  );

  const addRecent = useCallback(
    (params: { recentItem: IRecentItem }) => {
      return dispatch(addRecentItem({ ...params, id }));
    },
    [dispatch, id],
  );

  const resetRecentCurrentNetwork = useCallback(() => {
    dispatch(resetTargetIdRecent(id));
    dispatch(resetTargetIdRecent(anotherId));
  }, [anotherId, dispatch, id]);

  return { getTransformedRecentList, getRecentList, addRecent, checkAddressIsRecent, resetRecentCurrentNetwork };
}
