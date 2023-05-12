import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  resetUserGuardianStatus,
  setOpGuardianAction,
  setPreGuardianAction,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import aes from '@portkey-wallet/utils/aes';
import { message } from 'antd';
import useGuardianList from 'hooks/useGuardianList';
import ModalTip from 'pages/components/ModalTip';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useGuardiansInfo, useLoading, useUserInfo } from 'store/Provider/hooks';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { GuardianMth } from 'types/guardians';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import { formatAddGuardianValue } from '../utils/formatAddGuardianValue';
import { formatDelGuardianValue } from '../utils/formatDelGuardianValue';
import { formatEditGuardianValue } from '../utils/formatEditGuardianValue';

enum MethodType {
  'guardians/add' = GuardianMth.addGuardian,
  'guardians/edit' = GuardianMth.UpdateGuardian,
  'guardians/del' = GuardianMth.RemoveGuardian,
}

export const useRecovery = () => {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();
  const getGuardianList = useGuardianList();
  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetworkInfo();
  const { userGuardianStatus, opGuardian, preGuardian } = useGuardiansInfo();

  return useCallback(async () => {
    try {
      setLoading(true, 'Processing on the chain...');
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!currentChain?.endPoint || !privateKey) return message.error('handle guardian error');
      let value;
      switch (state) {
        case 'guardians/add':
          value = formatAddGuardianValue({ userGuardianStatus, opGuardian });
          break;
        case 'guardians/edit':
          value = formatEditGuardianValue({ userGuardianStatus, opGuardian, preGuardian });
          break;
        case 'guardians/del':
          value = formatDelGuardianValue({ userGuardianStatus, opGuardian });
          break;
        default:
          value = {};
      }
      await handleGuardian({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey,
        paramsOption: {
          method: MethodType[state],
          params: {
            caHash: walletInfo?.caHash,
            ...value,
          },
        },
      });
      dispatch(resetLoginInfoAction());
      dispatch(resetUserGuardianStatus());
      dispatch(setPreGuardianAction());
      dispatch(setOpGuardianAction());
      getGuardianList({ caHash: walletInfo.caHash });
      setLoading(false);
      state === 'guardians/add' && message.success('Guardians Added');
      ModalTip({
        content: 'Requested successfully',
        onClose: () => {
          navigate('/setting/guardians');
        },
      });
    } catch (error: any) {
      setLoading(false);
      console.log('---op-guardian-error', error);
      const _error = contractErrorHandler(error) || 'Something error';
      message.error(_error);
    }
  }, [
    currentChain,
    currentNetwork.walletType,
    dispatch,
    getGuardianList,
    navigate,
    opGuardian,
    passwordSeed,
    preGuardian,
    setLoading,
    state,
    userGuardianStatus,
    walletInfo,
  ]);
};
