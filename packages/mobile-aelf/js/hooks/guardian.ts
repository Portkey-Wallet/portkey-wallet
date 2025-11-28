import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useGetCurrentCAViewContract } from './contract';
import { setGuardianListAction, setVerifierListAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { LoginInfo } from 'types/wallet';
import { checkHolderError } from '@portkey-wallet/utils/check';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import { request } from '@portkey-wallet/api/api-did';
import { handleErrorMessage, handleErrorCode } from '@portkey-wallet/utils';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import myEvents from 'utils/deviceEvent';
import { GuardiansInfo } from '@portkey-wallet/types/types-ca/guardian';
import { useGuardiansInfo } from './store';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';

export const useGetHolderInfoByViewContract = () => {
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: IChainItemType) => {
      if (!loginInfo) throw new Error('Could not find accountInfo');
      const caContract = await getCurrentCAViewContract(chainInfo);
      return caContract?.callViewMethod('GetHolderInfo', {
        caHash: loginInfo.caHash,
        loginGuardianIdentifierHash: loginInfo.loginAccount,
      });
    },
    [getCurrentCAViewContract],
  );
};

export const useGetHolderInfo = () => {
  const originChainId = useOriginChainId();
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: IChainItemType) => {
      if (!loginInfo) throw new Error('Could not find accountInfo');
      return request.wallet.guardianIdentifiers({
        params: { chainId: chainInfo?.chainId || originChainId, ...loginInfo },
      });
    },
    [originChainId],
  );
};

export const useGetGuardiansInfo = () => {
  const getHolderInfo = useGetHolderInfo();
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: IChainItemType) => {
      try {
        const res = await getHolderInfo(loginInfo, chainInfo);
        if (res && !res.error) return res?.data || res;
        throw new Error(checkHolderError(res.error?.message));
      } catch (error: any) {
        const code = handleErrorCode(error);
        const message = handleErrorMessage(error);
        throw { message: checkHolderError(message, code), code };
      }
    },
    [getHolderInfo],
  );
};

export const useGetGuardiansInfoWriteStore = () => {
  const dispatch = useAppDispatch();
  const getGetGuardiansInfo = useGetGuardiansInfo();
  const { verifierMap } = useGuardiansInfo();
  const verifierMapRef = useRef(verifierMap);
  verifierMapRef.current = verifierMap;
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: IChainItemType) => {
      const guardiansInfo: GuardiansInfo = await getGetGuardiansInfo(loginInfo, chainInfo);

      const _verifierMap = verifierMapRef.current;
      const _guardianList: UserGuardianItem[] = guardiansInfo.guardianList.guardians.map(item => {
        const key = `${item.guardianIdentifier}&${item.verifierId}`;
        return {
          ...item,
          guardianAccount: item.guardianIdentifier || item.identifierHash,
          guardianType: LoginType[item.type as any] as unknown as LoginType,
          key,
          verifier: _verifierMap?.[item.verifierId],
          isLoginAccount: item.isLoginGuardian,
        };
      });

      dispatch(setGuardianListAction(_guardianList));
      return _guardianList;
    },
    [dispatch, getGetGuardiansInfo],
  );
};
export const useGetVerifierServers = () => {
  const dispatch = useAppDispatch();
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  return useCallback(
    async (chainInfo?: IChainItemType) => {
      const caContract = await getCurrentCAViewContract(chainInfo);
      const res = await caContract?.callViewMethod('GetVerifierServers', '');
      if (res && !res.error) {
        const verifierList: VerifierItem[] = res.data.verifierServers;
        dispatch(setVerifierListAction(verifierList));
        return verifierList;
      } else {
        throw res?.error || { message: 'Could not find VerifierServers' };
      }
    },
    [dispatch, getCurrentCAViewContract],
  );
};

export const useRefreshGuardiansList = () => {
  const { caHash } = useCurrentWalletInfo();
  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const refreshGuardiansList = useCallback(async () => {
    try {
      return await getGuardiansInfoWriteStore({
        caHash,
      });
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }, [caHash, getGuardiansInfoWriteStore]);

  return refreshGuardiansList;
};

export const useRefreshGuardianList = (isInit = false) => {
  const refreshGuardiansList = useRefreshGuardiansList();
  const getVerifierServers = useGetVerifierServers();
  const init = useCallback(async () => {
    try {
      await getVerifierServers();
      await refreshGuardiansList();
      console.log('GuardianList init: success');
    } catch (error) {
      console.log(error, '===useRefreshGuardianList init: error');
    }
  }, [getVerifierServers, refreshGuardiansList]);

  useEffect(() => {
    if (!isInit) return;
    const listener = myEvents.refreshGuardiansList.addListener(() => {
      refreshGuardiansList();
    });
    return () => {
      listener.remove();
    };
  }, [isInit, refreshGuardiansList]);

  return {
    init,
    refreshGuardiansList,
    getVerifierServers,
  };
};
