import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback } from 'react';
import {
  BRIDGE_TOKEN_WHITE_LIST_MAINNET,
  BRIDGE_TOKEN_WHITE_LIST_TESTNET,
  BRIDGE_INFO_AELF_MAINNET,
  BRIDGE_INFO_AELF_TESTNET,
  BRIDGE_INFO_EVM_MAINNET,
  BRIDGE_INFO_EVM_TESTNET,
} from '@portkey-wallet/constants/constants-ca/ebridge';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { IEBridgeChainInfo } from '@portkey-wallet/utils/eBridge/types';

BRIDGE_TOKEN_WHITE_LIST_MAINNET;

export default function useGetEBridgeConfig() {
  const currentNetwork = useCurrentNetwork();
  const currentChainList = useCurrentChainList();

  const getTokenConfig = useCallback(
    (symbol: string) => {
      return currentNetwork === 'MAINNET'
        ? BRIDGE_TOKEN_WHITE_LIST_MAINNET[symbol]
        : BRIDGE_TOKEN_WHITE_LIST_TESTNET[symbol];
    },
    [currentNetwork],
  );

  const getAELFChainInfoConfig = useCallback(
    (chainId: ChainId | string): IEBridgeChainInfo => {
      const targetItem = currentChainList?.find(ele => ele.chainId === chainId);
      return {
        chainType: 'aelf',
        chainId,
        rpcUrl: targetItem?.endPoint || '',
        bridgeContract: (currentNetwork === 'MAINNET'
          ? BRIDGE_INFO_AELF_MAINNET[chainId]
          : BRIDGE_INFO_AELF_TESTNET[chainId]) as string,
      };
    },
    [currentChainList, currentNetwork],
  );

  const getEVMChainInfoConfig = useCallback(
    (network: string): IEBridgeChainInfo => {
      const targetEvmInfo = (currentNetwork === 'MAINNET' ? BRIDGE_INFO_EVM_MAINNET : BRIDGE_INFO_EVM_TESTNET)[network];

      return {
        chainType: 'evm',
        ...targetEvmInfo.chainInfo,
        limitContract: targetEvmInfo.limitContractAddress,
        bridgeContract: targetEvmInfo.bridgeContractAddress,
      };
    },
    [currentNetwork],
  );

  return { getTokenConfig, getAELFChainInfoConfig, getEVMChainInfoConfig };
}
