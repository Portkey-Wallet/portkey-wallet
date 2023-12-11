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
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { GuardianMth } from 'types/guardians';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { formatAddGuardianValue } from '../utils/formatAddGuardianValue';
import { formatDelGuardianValue } from '../utils/formatDelGuardianValue';
import { formatEditGuardianValue } from '../utils/formatEditGuardianValue';
import { ChainId } from '@portkey-wallet/types';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';

enum MethodType {
  'guardians/add' = GuardianMth.addGuardian,
  'guardians/edit' = GuardianMth.UpdateGuardian,
  'guardians/del' = GuardianMth.RemoveGuardian,
}

export const useRecovery = () => {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const getGuardianList = useGuardianList();
  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetworkInfo();
  const { userGuardianStatus, opGuardian, preGuardian } = useGuardiansInfo();
  const accelerateChainId: ChainId = useMemo(() => {
    if (state && state.indexOf('guardians/add') !== -1) {
      const _query = state.split('_')[1];
      return _query?.split('=')?.[1];
    }
    return originChainId;
  }, [state, originChainId]);
  const accelerateChainInfo = useCurrentChain(accelerateChainId);

  return useCallback(async () => {
    try {
      setLoading(true, 'Processing on the chain...');
      const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
      const pin = getSeedResult.data.privateKey;
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);

      if (!currentChain?.endPoint || !privateKey) {
        console.log('handle guardian error===', currentChain, privateKey);
        return message.error('handle guardian error');
      }

      let value;
      const _query = state?.split('_')[0];
      switch (_query) {
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
      if (value?.guardiansApproved?.length === 0) return;

      await handleGuardian({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey,
        paramsOption: {
          method: `${MethodType[_query as keyof typeof MethodType]}`,
          params: {
            caHash: walletInfo?.caHash,
            ...value,
          },
        },
      });
      try {
        if (state && state.indexOf('guardians/add') !== -1 && accelerateChainId !== originChainId) {
          if (!accelerateChainInfo?.endPoint) return;
          const res = await handleGuardian({
            rpcUrl: accelerateChainInfo?.endPoint,
            chainType: currentNetwork.walletType,
            address: accelerateChainInfo?.caContractAddress,
            privateKey,
            paramsOption: {
              method: GuardianMth.addGuardian,
              params: {
                caHash: walletInfo?.caHash,
                ...value,
              },
            },
          });
          console.log('===handleAddGuardian Accelerate res', res);
        }
      } catch (error: any) {
        console.log('======handleAddGuardian Accelerate error', error);
      }
      console.log('useRecovery', '');
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
      const _error = handleErrorMessage(error, 'Something error');
      message.error(_error);
    } finally {
      setLoading(false);
    }
  }, [
    accelerateChainId,
    accelerateChainInfo?.caContractAddress,
    accelerateChainInfo?.endPoint,
    currentChain,
    currentNetwork.walletType,
    dispatch,
    getGuardianList,
    navigate,
    opGuardian,
    originChainId,
    preGuardian,
    setLoading,
    state,
    userGuardianStatus,
    walletInfo.AESEncryptPrivateKey,
    walletInfo.caHash,
  ]);
};
