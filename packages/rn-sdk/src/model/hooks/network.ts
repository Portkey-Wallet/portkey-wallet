import { BackEndNetWorkMap } from '@portkey-wallet/constants/constants-ca/backend-network';
import { NetworkType } from '@portkey-wallet/types';
import { PortkeyConfig } from 'global/constants';
import useEffectOnce from 'hooks/useEffectOnce';
import { useState } from 'react';
import { AElfChainStatusItemDTO } from 'network/dto/wallet';
import { getCachedAllChainInfo } from 'model/chain';

export const getCurrentNetworkType = async (): Promise<NetworkType> => {
  const endPointUrl = await PortkeyConfig.endPointUrl();
  switch (endPointUrl) {
    case BackEndNetWorkMap['back-end-test1'].apiUrl: {
      return 'TESTNET';
    }

    case BackEndNetWorkMap['back-end-mainnet-v2'].apiUrl: {
      return 'MAINNET';
    }

    case BackEndNetWorkMap['back-end-testnet-v2'].apiUrl:
    default: {
      return 'TESTNET';
    }
  }
};

export const useCurrentNetworkType = () => {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>('MAINNET');
  useEffectOnce(async () => {
    setCurrentNetwork(await getCurrentNetworkType());
  });
  return currentNetwork;
};

export const useChainsNetworkInfo = () => {
  const [chainsNetworkInfo, setChainsNetworkInfo] = useState<Record<string, AElfChainStatusItemDTO>>({});
  useEffectOnce(async () => {
    const networkInfoItems = await getCachedAllChainInfo();
    const info = networkInfoItems.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {} as Record<string, AElfChainStatusItemDTO>);
    setChainsNetworkInfo(info);
  });
  return {
    chainsNetworkInfo,
  };
};
