import useInterval from '@portkey-wallet/hooks/useInterval';
import { contractQueries } from '@portkey-wallet/graphql/index';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { useState, useMemo } from 'react';
import { CAInfoType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
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
        let managerInfo;
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(network, {
          manager: address,
        });
        console.log(caHolderManagerInfo, '=====caHolderManagerInfo');
        managerInfo = caHolderManagerInfo[0];
        if (!managerInfo) return;
        // information is not a origin chain
        if (managerInfo.originChainId !== managerInfo.chainId) {
          const { caHolderManagerInfo: originalChainManagerInfo } = await contractQueries.getCAHolderByManager(
            network,
            {
              caHash: managerInfo.caHash,
              chainId: managerInfo.originChainId,
            },
          );
          managerInfo = originalChainManagerInfo[0];
        }
        const { caAddress, caHash, loginGuardianInfo, originChainId = DefaultChainId } = managerInfo;
        if (caAddress && caHash && loginGuardianInfo[0] && originChainId) {
          const guardianList = loginGuardianInfo.filter(item => item?.chainId === originChainId);
          if (guardianList.length === 0) return;
          setInfo({
            [address + network]: {
              caInfo: {
                originChainId: originChainId as ChainId,
                managerInfo: {
                  managerUniqueId: loginGuardianInfo[0].id,
                  loginAccount: loginGuardianInfo[0].loginGuardian?.identifierHash,
                  type: loginGuardianInfo[0].loginGuardian?.type,
                  verificationType: VerificationType.addManager,
                } as ManagerInfo,
                [originChainId]: { caAddress, caHash },
              },
              originChainId: originChainId as ChainId,
            },
          });
        }
      } catch (error) {
        console.log(error, '=====error');
      }
    },
    [caInfo, network, address],
    3000,
  );
  return caInfo;
}
