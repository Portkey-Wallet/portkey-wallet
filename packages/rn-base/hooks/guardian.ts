import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { useGetCurrentCAViewContract } from './contract';
import {
  setGuardianListAction,
  setGuardiansAction,
  setVerifierListAction,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import { LoginInfo } from '../types/wallet';
import { checkHolderError } from '@portkey-wallet/utils/check';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { request } from '@portkey-wallet/rn-inject-sdk';
import { handleErrorMessage, handleErrorCode } from '@portkey-wallet/utils';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import myEvents from '../utils/deviceEvent';
import { GuardiansInfo } from '@portkey-wallet/types/types-ca/guardian';
import { useGuardiansInfo } from './store';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';

export const useGetHolderInfoByViewContract = () => {
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  return useCallback(
    async (loginInfo: LoginInfo, chainInfo?: ChainItemType) => {
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
    async (loginInfo: LoginInfo, chainInfo?: ChainItemType) => {
      if (!loginInfo) throw new Error('Could not find accountInfo');
      console.log('guardianIdentifiers!!!!!', { chainId: chainInfo?.chainId || originChainId, ...loginInfo });
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
    async (loginInfo: LoginInfo, chainInfo?: ChainItemType) => {
      try {
        console.log('getHolderInfo');
        const res = await getHolderInfo(loginInfo, chainInfo);
        console.log('getHolderInfo end', res);
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
    async (loginInfo: LoginInfo, chainInfo?: ChainItemType) => {
      const guardiansInfo: GuardiansInfo = await getGetGuardiansInfo(loginInfo, chainInfo);
      console.log('getGetGuardiansInfo guardiansInfo', guardiansInfo);
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
    async (chainInfo?: ChainItemType) => {
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
  console.log('useRefreshGuardiansList->useCurrentWalletInfo caHash', caHash);
  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const refreshGuardiansList = useCallback(async () => {
    try {
      return await getGuardiansInfoWriteStore({
        caHash,
      });
    } catch (error) {
      console.log('111222', error);
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
