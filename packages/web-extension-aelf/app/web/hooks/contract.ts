import { ChainId } from '@portkey-wallet/types';
import { useCallback } from 'react';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import AElf from 'aelf-sdk';
import getSeed from 'utils/getSeed';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-eoa/network/chain';

const Wallet = AElf.wallet;

export const useGetTokenViewContract = () => {
  const currentChainList = useCurrentChainList();

  return useCallback(
    (chainId: ChainId) => {
      const currentChain = currentChainList?.find((item) => item.chainId === chainId);
      if (!currentChain) throw new Error('invalid chain info');

      const wallet = Wallet.createNewWallet();

      const contract = new ExtensionContractBasic({
        rpcUrl: currentChain.endPoint,
        contractAddress: currentChain.defaultToken.address,
        privateKey: wallet.privateKey,
      });
      return contract;
    },
    [currentChainList],
  );
};

export const useGetCAContract = () => {
  const currentChainList = useCurrentChainList();

  return useCallback(
    async (chainId: ChainId) => {
      const currentChain = currentChainList?.find((item) => item.chainId === chainId);
      if (!currentChain) throw new Error('invalid chain info');
      const { privateKey } = await getSeed();
      if (!privateKey) throw new Error('invalid wallet');

      const contract = new ExtensionContractBasic({
        rpcUrl: currentChain.endPoint,
        contractAddress: currentChain.caContractAddress,
        privateKey: privateKey,
      });
      return contract;
    },
    [currentChainList],
  );
};

export function useGetTokenContract() {
  const getChainInfo = useGetChainInfo();

  return useCallback(
    async (chainId: ChainId) => {
      const chainInfo = getChainInfo(chainId);
      if (!chainInfo) {
        throw Error('Could not find chain information');
      }

      const { privateKey } = await getSeed();
      if (!privateKey) throw new Error('invalid wallet');

      const contract = new ExtensionContractBasic({
        rpcUrl: chainInfo.endPoint,
        contractAddress: chainInfo.defaultToken.address,
        privateKey: privateKey,
      });
      return contract;
    },
    [getChainInfo],
  );
}
