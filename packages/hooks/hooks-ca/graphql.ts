import useInterval from '../useInterval';
import { contractQueries } from '@portkey-wallet/graphql/index';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { useState, useMemo, useEffect } from 'react';
import { CAInfoType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { useCurrentWallet, useOriginChainId } from './wallet';
import useLockCallback from '../useLockCallback';
import { useGetChainInfo } from './chainList';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { useLatestRef } from '../index';
export type CAWalletInfo = {
  caInfo: CAInfoType;
  originChainId: ChainId;
};
export function useIntervalQueryCAInfoByAddress(
  network: NetworkType,
  address?: string,
  validateManager?: (options: { chainId?: ChainId; caHash: string; address: string }) => Promise<boolean>,
) {
  const [info, setInfo] = useState<{ [address: string]: CAWalletInfo }>();
  const getChainInfo = useGetChainInfo();
  const caInfo = useMemo(() => (address && info ? info?.[address + network] : undefined), [address, info, network]);
  useInterval(
    async () => {
      if (!address || caInfo) return;
      try {
        let info;
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(network, {
          manager: address,
        });
        info = caHolderManagerInfo[0];
        if (!info) return;
        // information is not a origin chain
        if (info.originChainId !== info.chainId) {
          const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(network, {
            caHash: info.caHash,
            chainId: info.originChainId,
          });
          info = caHolderManagerInfo[0];
        }
        const { caAddress, caHash, loginGuardianInfo, originChainId = DefaultChainId } = info;
        if (caAddress && caHash && loginGuardianInfo[0] && originChainId) {
          const guardianList = loginGuardianInfo.filter(item => item?.chainId === originChainId);
          if (guardianList.length === 0) return;
          if (validateManager) {
            const validate = await validateManager({
              chainId: originChainId as ChainId,
              caHash,
              address,
            });
            if (!validate) return;
          }
          await getChainInfo(originChainId as ChainId);
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
    [address, caInfo, network, validateManager, getChainInfo],
    3000,
  );
  return caInfo;
}

export function useCheckManager(callback: () => void) {
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const { caHash, address } = walletInfo || {};
  const originChainId = useOriginChainId();
  const savedCallback = useLatestRef<() => void>(callback);
  const checkManager = useLockCallback(async () => {
    try {
      if (!caHash) return;
      const info = await contractQueries.getCAHolderManagerInfo(currentNetwork, {
        dto: {
          caHash,
          maxResultCount: 1,
          skipCount: 0,
          chainId: originChainId,
        },
      });
      const { caHolderManagerInfo } = info.data || {};
      if (caHolderManagerInfo) {
        const { managerInfos } = caHolderManagerInfo[0] || {};
        const isManager = managerInfos?.some(manager => manager?.address === address);
        if (!isManager) savedCallback.current?.();
      }
    } catch (error) {
      console.log(error, '=====error');
    }
  }, [address, caHash, currentNetwork, originChainId, savedCallback]);

  const interval = useInterval(
    () => {
      checkManager();
    },
    [checkManager],
    5000,
  );
  useEffect(() => {
    if (!caHash || !address) {
      interval.remove();
    } else {
      interval.start();
    }
  }, [caHash, address, interval]);
}
