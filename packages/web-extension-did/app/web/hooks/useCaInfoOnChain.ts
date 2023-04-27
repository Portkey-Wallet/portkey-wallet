import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useInterval from '@portkey-wallet/hooks/useInterval';
import { setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainId, ChainType } from '@portkey-wallet/types';
import { isAddress } from '@portkey-wallet/utils';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { getHolderInfoByContract } from 'utils/sandboxUtil/getHolderInfo';

export const useCaInfoOnChain = () => {
  const { walletInfo, chainList } = useCurrentWallet();
  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();

  const getHolderInfoByChainId = useCallback(
    async ({
      chain,
      caHash,
      walletType,
      pin,
    }: {
      pin: string;
      chain: ChainItemType;
      caHash: string;
      walletType: ChainType;
    }) => {
      const result = await getHolderInfoByContract({
        rpcUrl: chain.endPoint,
        chainType: walletType,
        address: chain.caContractAddress,
        paramsOption: {
          caHash,
        },
      });
      if (result.code === 1) {
        const { caAddress, caHash } = result.result;
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
    },
    [dispatch],
  );

  const fetch = useCallback(async () => {
    if (!chainList) return;
    if (!walletInfo.caHash) return;
    const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
    const pin = getSeedResult.data.privateKey;
    if (!pin) return;
    chainList
      .filter((chain) => chain.chainId !== originChainId)
      .forEach((chain) => {
        if (!walletInfo[chain.chainId as ChainId]) {
          getHolderInfoByChainId({
            chain,
            walletType: currentNetwork.walletType,
            caHash: walletInfo.caHash ?? '',
            pin,
          });
        }
      });
  }, [chainList, currentNetwork, originChainId, getHolderInfoByChainId, walletInfo]);

  const check = useCallback(
    () => chainList?.every((chain) => walletInfo[chain.chainId as ChainId] || !isAddress(chain.caContractAddress)),
    [chainList, walletInfo],
  );

  const interval = useInterval(
    () => {
      if (check()) {
        interval.remove();
      } else {
        fetch();
      }
    },
    1000,
    [walletInfo],
  );
};
