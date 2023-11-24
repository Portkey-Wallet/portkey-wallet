import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import aes from '@portkey-wallet/utils/aes';
import { message } from 'antd';
import { DEVICE_TYPE } from 'constants/index';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGuardiansInfo, useLoading, useUserInfo } from 'store/Provider/hooks';
import { removeOtherManager } from 'utils/sandboxUtil/removeOtherManager';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import { formatGuardianValue } from '../utils/formatGuardianValue';
import qs from 'query-string';
import ModalTip from 'pages/components/ModalTip';
import { sleep } from '@portkey-wallet/utils';

export const useRemoveOtherManage = () => {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();

  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetworkInfo();
  const { userGuardianStatus } = useGuardiansInfo();
  const query = useMemo(() => {
    if (search) {
      const { detail } = qs.parse(search);
      return detail;
    } else {
      return state;
    }
  }, [search, state]);

  return useCallback(async () => {
    try {
      setLoading(true);
      const manageAddress = query?.split('_')[1];
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!currentChain?.endPoint || !privateKey) return message.error('remove manage error');
      const { guardiansApproved } = formatGuardianValue(userGuardianStatus);
      await removeOtherManager({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey,
        paramsOption: {
          caHash: walletInfo?.caHash as string,
          managerInfo: {
            address: manageAddress,
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
      const _error = contractErrorHandler(error) || 'Try again later';
      message.error(_error);
    }
  }, [
    currentChain?.caContractAddress,
    currentChain?.endPoint,
    currentNetwork.walletType,
    navigate,
    passwordSeed,
    query,
    setLoading,
    userGuardianStatus,
    walletInfo.AESEncryptPrivateKey,
    walletInfo?.caHash,
  ]);
};
