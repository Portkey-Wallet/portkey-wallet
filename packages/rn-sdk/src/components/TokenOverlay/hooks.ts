import { DEFAULT_TOKEN } from 'packages/constants/constants-ca/wallet';
import { NetworkType } from 'packages/types';
import useEffectOnce from 'hooks/useEffectOnce';
import { Token, getCachedNetworkConfig } from 'model/chain';
import { getCurrentNetworkType } from 'model/hooks/network';
import { getTempWalletConfig } from 'model/verify/core';
import { NetworkController } from 'network/controller';
import { useState } from 'react';
import { handleCachedValue } from 'service/storage/cache';

export function useSymbolImages() {
  const [symbolImages, setSymbolImages] = useState<Record<string, string>>({});
  useEffectOnce(async () => {
    const imageData = await handleCachedValue({
      target: 'TEMP',
      getIdentifier: async () => {
        return 'symbolImages';
      },
      getValueIfNonExist: async () => {
        const result = await NetworkController.getSymbolImage();
        return result.result?.symbolImages || {};
      },
    });
    setSymbolImages(imageData);
  });
  return symbolImages;
}

export function useCommonNetworkInfo(fromChain?: string) {
  const symbolImages = useSymbolImages();
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>('MAINNET');
  const [defaultToken, setDefaultToken] = useState<Token>(DEFAULT_TOKEN);
  const [currentCaAddress, setCurrentCaAddress] = useState<string>();
  const [explorerUrl, setExplorerUrl] = useState<string>();
  const [peerUrl, setPeerUrl] = useState<string>();
  useEffectOnce(async () => {
    const n = await getCurrentNetworkType();
    setCurrentNetwork(n);
    const {
      defaultToken: cachedDefaultToken,
      explorerUrl: cachedExplorerUrl,
      peerUrl: cachedPeerUrl,
    } = await getCachedNetworkConfig(fromChain);
    setPeerUrl(cachedPeerUrl);
    setDefaultToken(cachedDefaultToken);
    setExplorerUrl(cachedExplorerUrl);
    const wallet = await getTempWalletConfig();
    setCurrentCaAddress(wallet.caInfo?.caAddress ?? '');
  });
  return {
    symbolImages,
    currentNetwork,
    defaultToken,
    currentCaAddress,
    explorerUrl,
    peerUrl,
  };
}

export interface CommonInfo {
  symbolImages: Record<string, string>;
  currentNetwork: NetworkType;
  defaultToken: Token;
}
