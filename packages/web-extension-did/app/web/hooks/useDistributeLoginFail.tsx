import { contractQueries } from '@portkey-wallet/graphql';
import { setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { getCurrentChainInfo } from 'utils/lib/SWGetReduxStore';
import { getHolderInfoByContract } from 'utils/sandboxUtil/getHolderInfo';

const useDistributeLoginFail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useCallback(
    async ({
      messageStr,
      managerAddress,
      pin,
      verificationType,
      currentNetwork,
    }: {
      messageStr: string;
      managerAddress: string;
      pin: string;
      verificationType: VerificationType;
      currentNetwork: NetworkType;
    }) => {
      try {
        if (messageStr.includes('ManagerInfo exists')) {
          const address = managerAddress || '';
          const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(currentNetwork, {
            manager: managerAddress || '',
          });
          const info = caHolderManagerInfo[0];
          if (!info.originChainId) throw new Error('caHolderManagerInfo is empty');
          const chainInfo = await getCurrentChainInfo(info.originChainId as ChainId);
          if (!chainInfo) throw 'getCurrentChainInfo error';
          const contractInfo = await getHolderInfoByContract({
            rpcUrl: chainInfo.endPoint,
            chainType: 'aelf',
            address: chainInfo.caContractAddress,
            paramsOption: {
              caHash: info.caHash || '',
            },
          });
          const { managerInfos, caAddress, caHash } = contractInfo.result;
          const exist = await managerInfos?.some((manager: { address: string }) => manager?.address === address);

          if (exist) {
            dispatch(
              setCAInfo({
                caInfo: {
                  caAddress,
                  caHash,
                },
                pin,
                chainId: info.originChainId as ChainId,
              }),
            );
            const path = VerificationType.register === verificationType ? 'register' : 'login';
            navigate(`/success-page/${path}`);
            return true;
          }
        }
      } catch {
        return false;
      }
      return false;
    },
    [dispatch, navigate],
  );
};

export default useDistributeLoginFail;
