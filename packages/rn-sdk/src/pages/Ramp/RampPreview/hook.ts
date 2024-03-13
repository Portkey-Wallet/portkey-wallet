import useEffectOnce from 'hooks/useEffectOnce';
import { useChainsNetworkInfo } from 'model/hooks/network';
import { getUnlockedWallet } from 'model/wallet';
import { NetworkController } from 'network/controller';
import { UserGuardianItem } from 'packages/store/store-ca/guardians/type';
import { ChainId } from 'packages/types';
import { LoginType } from 'packages/types/types-ca/wallet';
import { useEffect, useState } from 'react';
import { PortkeyConfig } from 'global/config';
import { RecoverWalletConfig, getTempWalletConfig } from 'model/verify/core';

export const DEFAULT_TOKEN = {
  address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  decimals: '8',
  imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf_token_logo.png',
  name: 'AELF',
  symbol: 'ELF',
};
type WalletInfo = {
  caHash?: string;
  managerAddress?: string;
  originChainId: ChainId;
  caAddress?: string;
} & { AELF?: { caAddress: string } };
export function useCurrentWalletInfo() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    caHash: '',
    managerAddress: '',
    originChainId: 'AELF',
  });
  useEffect(() => {
    (async () => {
      const {
        caInfo,
        address: managerAddress,
        originChainId,
        multiCaAddresses,
      } = await getUnlockedWallet({ getMultiCaAddresses: true });
      setWalletInfo({
        caHash: caInfo?.caHash,
        managerAddress,
        originChainId: originChainId as ChainId,
        caAddress: caInfo?.caAddress,
        AELF: { caAddress: multiCaAddresses.AELF },
      });
    })();
  }, []);
  return walletInfo;
}

export function useDefaultToken(_chainId?: ChainId) {
  // const chainInfo = useCurrentChain(_chainId);
  const { chainsNetworkInfo } = useChainsNetworkInfo();
  const chainInfo = chainsNetworkInfo[_chainId as string];
  return chainInfo?.defaultToken || DEFAULT_TOKEN;
}
export function useGuardiansInfo() {
  const [userGuardiansList, setUserGuardiansList] = useState<UserGuardianItem[]>();
  useEffectOnce(async () => {
    const config: RecoverWalletConfig = await getTempWalletConfig();
    const { guardianList } = await NetworkController.getGuardianInfo(
      config.accountIdentifier as string,
      config?.caInfo?.caHash,
    );
    const _guardianList = guardianList.guardians.map(item => {
      const key = `${item.guardianIdentifier}&${item.verifierId}`;
      const _guardian = {
        ...item,
        guardianAccount: item.guardianIdentifier || item.identifierHash,
        guardianType: LoginType[item.type as any] as unknown as LoginType,
        key,
        isLoginAccount: item.isLoginGuardian,
      };
      return _guardian;
    });
    setUserGuardiansList(_guardianList);
  });
  return {
    userGuardiansList,
  };
}

export function useSDKRampEntryShow() {
  return {
    isBuySectionShow: PortkeyConfig.config.entryConfig.isBuySectionShow,
    isSellSectionShow: PortkeyConfig.config.entryConfig.isSellSectionShow,
    refreshRampShow: PortkeyConfig.config?.entryConfig?.refreshRampShow,
  };
}
export type IEntranceMatchKey = 'version' | 'installationTime' | 'deviceType';
export type IEntranceMatchValueConfig = Partial<Record<IEntranceMatchKey, string | (() => Promise<string>)>>;
