import { useCallback } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setGuardiansAction, setVerifierListAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { useGetRegisterInfo, useGuardiansInfo } from '@portkey-wallet/hooks/hooks-ca/guardian';
import { getVerifierList } from 'utils/sandboxUtil/getVerifierList';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { handleErrorMessage } from '@portkey-wallet/utils';

const useGuardianList = () => {
  const dispatch = useAppDispatch();
  const getRegisterInfo = useGetRegisterInfo();
  const getChainInfo = useGetChainInfo();

  const fetch = useCallback(
    async (paramsOption: { guardianIdentifier?: string; caHash?: string }) => {
      try {
        if (paramsOption?.guardianIdentifier)
          paramsOption.guardianIdentifier = paramsOption.guardianIdentifier.replaceAll(' ', '');
        const _params: any = {};
        paramsOption?.guardianIdentifier
          ? (_params.loginGuardianIdentifier = paramsOption?.guardianIdentifier)
          : (_params.caHash = paramsOption.caHash);
        const { originChainId } = await getRegisterInfo(_params);

        const currentChain = await getChainInfo(originChainId);
        if (!currentChain) throw 'Miss chain info';
        const verifierRes = await getVerifierList({
          rpcUrl: currentChain.endPoint,
          address: currentChain.caContractAddress,
          chainType: 'aelf',
        });
        verifierRes.result.verifierList && dispatch(setVerifierListAction(verifierRes.result.verifierList));

        const res = await getHolderInfo({
          chainId: originChainId,
          ...paramsOption,
        });
        dispatch(setGuardiansAction(res));
      } catch (error: any) {
        throw handleErrorMessage(error);
      }
    },
    [dispatch, getChainInfo, getRegisterInfo],
  );

  return fetch;
};

export const useGetLoginGuardianItem = () => {
  const { userGuardiansList = [] } = useGuardiansInfo();
  return userGuardiansList.find((item) => item.isLoginAccount);
};

export default useGuardianList;
