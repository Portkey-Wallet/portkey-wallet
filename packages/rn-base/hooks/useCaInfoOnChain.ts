import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useInterval from '@portkey-wallet/hooks/useInterval';
import { setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainId, ChainType } from '@portkey-wallet/types';
import { isAddress } from '@portkey-wallet/utils';
import { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { useGetHolderInfoByViewContract } from './guardian';
import { usePin } from './store';
export const useCaInfoOnChain = () => {
  console.log('wfs useCaInfoOnChain1');
  const { walletInfo, chainList } = useCurrentWallet();
  console.log('wfs useCaInfoOnChain2');
  const currentNetwork = useCurrentNetworkInfo();
  console.log('wfs useCaInfoOnChain3');
  const dispatch = useAppDispatch();
  console.log('wfs useCaInfoOnChain4');
  const getHolderInfo = useGetHolderInfoByViewContract();
  console.log('wfs useCaInfoOnChain5');
  const pin = usePin();
  const originChainId = useOriginChainId();
  const getHolderInfoByChainId = useCallback(
    async ({ chain, caHash }: { chain: ChainItemType; caHash: string; walletType: ChainType }) => {
      if (!pin) return;
      try {
        const result = await getHolderInfo({ caHash }, chain);
        if (!result.error) {
          const { caAddress } = result.data || {};
          caAddress &&
            dispatch(
              setCAInfo({
                caInfo: {
                  caAddress,
                  caHash,
                },
                pin,
                chainId: chain.chainId as ChainId,
              }),
            );
        }
      } catch (error) {
        console.log(error, 'getHolderInfoByChainId=====error');
      }
    },
    [dispatch, getHolderInfo, pin],
  );

  const check = useCallback(
    () => chainList?.every(chain => walletInfo[chain.chainId as ChainId] || !isAddress(chain.caContractAddress)),
    [chainList, walletInfo],
  );
  const fetch = useCallback(async () => {
    if (!chainList) return;
    if (!walletInfo.caHash) return;
    if (!pin) return;
    chainList
      .filter(chain => chain.chainId !== originChainId)
      .forEach(chain => {
        if (!walletInfo[chain.chainId as ChainId]) {
          const originCaAddress = walletInfo[originChainId]?.caAddress;
          if (originCaAddress) {
            dispatch(
              setCAInfo({
                caInfo: {
                  caAddress: originCaAddress,
                  caHash: walletInfo.caHash ?? '',
                },
                pin,
                chainId: chain.chainId as ChainId,
              }),
            );
          } else {
            getHolderInfoByChainId({
              chain,
              walletType: currentNetwork.walletType,
              caHash: walletInfo.caHash ?? '',
            });
          }
        }
      });
  }, [chainList, currentNetwork.walletType, dispatch, getHolderInfoByChainId, originChainId, pin, walletInfo]);

  const interval = useInterval(
    () => {
      if (check()) {
        interval.remove();
      } else {
        fetch();
      }
    },
    [check, fetch],
    5000,
  );
};
