import { ChainId } from '@portkey-wallet/types';
import { useCallback } from 'react';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import AElf from 'aelf-sdk';
import getSeed from 'utils/getSeed';

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
