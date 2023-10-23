import useInterval from '@portkey-wallet/hooks/useInterval';
import { contractQueries } from '@portkey-wallet/graphql/index';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { useState, useMemo } from 'react';
import { CAInfoType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { NetworkController } from 'network/controller';
import { PortkeyConfig } from 'global';
import { CommunityRecovery } from '@portkey/services/dist/commonjs/service/communityRecovery';
export type CAWalletInfo = {
  caInfo: CAInfoType;
  originChainId: ChainId;
};
export function useIntervalQueryCAInfoByAddress(network: NetworkType, address?: string) {
  const [info, setInfo] = useState<{ [address: string]: CAWalletInfo }>();
  const caInfo = useMemo(() => (address && info ? info?.[address + network] : undefined), [address, info, network]);
  useInterval(
    async () => {
      if (!address || caInfo) return;
      try {
        let info;
        console.log('aaa');
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(network, {
          manager: address,
        });
        console.log('bbb', caHolderManagerInfo);
        info = caHolderManagerInfo[0];
        if (!info) return;
      } catch (error) {
        console.log(error, '=====error');
      }
    },
    3000,
    [caInfo, network, address],
  );
  return caInfo;
}
