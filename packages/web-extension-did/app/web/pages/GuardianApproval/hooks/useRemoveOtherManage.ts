import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import aes from '@portkey-wallet/utils/aes';
import { message } from 'antd';
import { DEVICE_TYPE } from 'constants/index';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGuardiansInfo, useLoading, useUserInfo } from 'store/Provider/hooks';
import { removeOtherManager } from 'utils/sandboxUtil/removeOtherManager';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import { formatGuardianValue } from '../utils/formatGuardianValue';
import qs from 'query-string';
import ModalTip from 'pages/components/ModalTip';

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
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (search) {
      const { detail } = qs.parse(search);
      setQuery(detail);
    } else {
      setQuery(state);
    }
  }, [query, search, state]);

  return useCallback(async () => {
    try {
      setLoading(true);
      const manageAddress = query.split('_')[1];
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
        onClose: () => {
          navigate('/setting/wallet-security/manage-devices', { state: 'update' });
        },
      });
    } catch (error: any) {
      setLoading(false);
      console.log('---remove-other-manage-error', error);
      const _error = contractErrorHandler(error) || 'Try again later';
      message.error(_error);
    }
  }, [
    currentChain,
    currentNetwork.walletType,
    navigate,
    passwordSeed,
    setLoading,
    query,
    userGuardianStatus,
    walletInfo,
  ]);
};
