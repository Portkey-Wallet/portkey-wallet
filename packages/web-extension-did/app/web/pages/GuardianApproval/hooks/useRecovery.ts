import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  resetUserGuardianStatus,
  setOpGuardianAction,
  setPreGuardianAction,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import ModalTip from 'pages/components/ModalTip';
import { useCallback, useMemo } from 'react';
import { useAppDispatch, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { GuardianMth } from 'types/guardians';
import { handleGuardianByContract } from 'utils/sandboxUtil/handleGuardianByContract';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { formatAddGuardianValue } from '../utils/formatAddGuardianValue';
import { formatDelGuardianValue } from '../utils/formatDelGuardianValue';
import { formatEditGuardianValue } from '../utils/formatEditGuardianValue';
import { ChainId } from '@portkey-wallet/types';
import getSeed from 'utils/getSeed';
import { formatSetUnsetGuardianValue } from '../utils/formatSetUnsetLoginGuardianValue';
import singleMessage from 'utils/singleMessage';
import { useLocationState, useNavigateState } from 'hooks/router';
import { FromPageEnum, TGuardianRecoveryLocationState } from 'types/router';
import { useReportUnsetLoginGuardian } from 'hooks/authentication';

export const useGuardianRecovery = () => {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const getGuardianList = useGuardianList();
  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const { state } = useLocationState<TGuardianRecoveryLocationState>();
  const dispatch = useAppDispatch();
  const navigate = useNavigateState();
  const currentNetwork = useCurrentNetworkInfo();
  const { userGuardianStatus, opGuardian, preGuardian } = useGuardiansInfo();
  const accelerateChainId: ChainId = useMemo(() => state?.accelerateChainId || originChainId, [state, originChainId]);
  const accelerateChainInfo = useCurrentChain(accelerateChainId);
  const reportUnsetLoginAccount = useReportUnsetLoginGuardian();

  return useCallback(async () => {
    try {
      setLoading(true, 'Processing on the chain...');
      const { privateKey } = await getSeed();

      if (!currentChain?.endPoint || !privateKey) {
        console.log('handle guardian error===', currentChain, privateKey);
        return singleMessage.error('handle guardian error');
      }

      let value;
      let methodName = '';
      const from = state.previousPage;
      switch (from) {
        case FromPageEnum.guardiansAdd:
          value = formatAddGuardianValue({ userGuardianStatus, opGuardian });
          methodName = GuardianMth.addGuardian;
          break;
        case FromPageEnum.guardiansEdit:
          value = formatEditGuardianValue({ userGuardianStatus, opGuardian, preGuardian });
          methodName = GuardianMth.UpdateGuardian;
          break;
        case FromPageEnum.guardiansDel:
          value = formatDelGuardianValue({ userGuardianStatus, opGuardian });
          methodName = GuardianMth.RemoveGuardian;
          break;
        case FromPageEnum.guardiansLoginGuardian:
          value = formatSetUnsetGuardianValue({ userGuardianStatus, opGuardian });
          methodName = opGuardian?.isLoginAccount
            ? GuardianMth.UnsetGuardianTypeForLogin
            : GuardianMth.SetGuardianTypeForLogin;
          break;
        default:
          value = {};
      }
      if (value?.guardiansApproved?.length === 0) {
        setLoading(false);
        return;
      }
      console.log('handleGuardianByContract', methodName, value);
      await handleGuardianByContract({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey,
        paramsOption: {
          method: methodName,
          params: {
            caHash: walletInfo?.caHash,
            ...value,
          },
        },
      });
      try {
        if (methodName === GuardianMth.UnsetGuardianTypeForLogin) {
          await reportUnsetLoginAccount({
            caHash: walletInfo?.caHash || '',
            unsetGuardianIdentifierHash: opGuardian?.identifierHash || '',
            chainId: originChainId,
          });
        }
      } catch (error) {
        console.log('======reportUnsetLoginAccount error', error);
      }
      try {
        if (from === FromPageEnum.guardiansAdd && accelerateChainId !== originChainId) {
          if (!accelerateChainInfo?.endPoint) return;
          const res = await handleGuardianByContract({
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
      dispatch(resetLoginInfoAction());
      dispatch(resetUserGuardianStatus());
      getGuardianList({ caHash: walletInfo.caHash });
      setLoading(false);
      from === FromPageEnum.guardiansAdd && singleMessage.success('Guardians Added');
      ModalTip({
        content: 'Requested successfully',
        onClose: () => {
          setLoading(false);
          console.log('transfer error', from, state);
          if (from === FromPageEnum.guardiansLoginGuardian) {
            if (state.extra === 'edit') {
              navigate('/setting/guardians/edit');
            } else {
              dispatch(setPreGuardianAction());
              navigate('/setting/guardians/view');
            }
            return;
          }

          dispatch(setPreGuardianAction());
          dispatch(setOpGuardianAction());
          navigate('/setting/guardians');
        },
      });
    } catch (error: any) {
      setLoading(false);
      console.log('===handleGuardianByContract error', error);
      const _error = handleErrorMessage(error, 'handleGuardianByContract error');
      singleMessage.error(_error);
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
    reportUnsetLoginAccount,
    setLoading,
    state,
    userGuardianStatus,
    walletInfo.caHash,
  ]);
};
