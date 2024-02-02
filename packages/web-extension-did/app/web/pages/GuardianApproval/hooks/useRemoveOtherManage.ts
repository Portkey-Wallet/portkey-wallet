import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import singleMessage from 'utils/singleMessage';
import { DEVICE_TYPE } from 'constants/index';
import { useCallback } from 'react';
import { useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { removeOtherManager } from 'utils/sandboxUtil/removeOtherManager';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { formatGuardianValue } from '../utils/formatGuardianValue';
import ModalTip from 'pages/components/ModalTip';
import getSeed from 'utils/getSeed';
import { usePromptLocationParams, useNavigateState } from 'hooks/router';
import { TRemoveOtherManageLocationSearch, TRemoveOtherManageLocationState } from 'types/router';

export const useRemoveOtherManage = () => {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();

  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const { locationParams } = usePromptLocationParams<
    TRemoveOtherManageLocationState,
    TRemoveOtherManageLocationSearch
  >();
  const navigate = useNavigateState();
  const currentNetwork = useCurrentNetworkInfo();
  const { userGuardianStatus } = useGuardiansInfo();

  return useCallback(async () => {
    try {
      setLoading(true);
      const { privateKey } = await getSeed();
      if (!currentChain?.endPoint || !privateKey) return singleMessage.error('remove manage error');
      const { guardiansApproved } = formatGuardianValue(userGuardianStatus);
      await removeOtherManager({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey,
        paramsOption: {
          caHash: walletInfo?.caHash as string,
          managerInfo: {
            address: locationParams.manageAddress,
            extraData: `${DEVICE_TYPE},${Date.now()}`,
          },
          guardiansApproved,
        },
      });
      setLoading(false);
      ModalTip({
        content: 'Requested successfully',
        onClose: async () => {
          await sleep(1000);
          navigate('/setting/wallet-security/manage-devices');
        },
      });
    } catch (error: any) {
      setLoading(false);
      console.log('---remove-other-manage-error', error);
      const _error = handleErrorMessage(error, 'Try again later');
      singleMessage.error(_error);
    }
  }, [
    currentChain,
    currentNetwork.walletType,
    locationParams.manageAddress,
    navigate,
    setLoading,
    userGuardianStatus,
    walletInfo?.caHash,
  ]);
};
