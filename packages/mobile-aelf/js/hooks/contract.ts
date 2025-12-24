import { ChainId } from '@portkey-wallet/types';
import aes from '@portkey-wallet/utils/aes';
import { useInterface } from 'contexts/useInterface';
import { setCAContract, setViewContract } from 'contexts/useInterface/actions';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCallback, useMemo } from 'react';
import { getDefaultWallet } from '@portkey-wallet/utils/aelfUtils';
import AElf from 'aelf-sdk';
import { usePin } from './store';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';
import { useChainInfo, useGetChainInfo } from '@portkey-wallet/hooks/hooks-eoa/network/chain';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';

// TODO: eoa delete deprecated

/**
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use the `useGetViewContract` instead.
 */
export function useGetCurrentCAViewContract(_chainId?: ChainId) {
  const originChainId = useOriginChainId();
  const chainId = useMemo(() => _chainId || originChainId, [_chainId, originChainId]);
  const chainInfo = useChainInfo(chainId);
  const [{ viewContracts }, dispatch] = useInterface();

  return useCallback(
    async (paramChainInfo?: IChainItemType) => {
      const _chainInfo = paramChainInfo || chainInfo;
      if (!_chainInfo) {
        throw Error('Could not find chain information');
      }

      const key = _chainInfo.caContractAddress + _chainInfo.endPoint;
      const caContract = viewContracts?.[key];
      if (caContract) {
        return caContract;
      }

      const contract = await getContractBasic({
        contractAddress: _chainInfo.caContractAddress,
        rpcUrl: _chainInfo.endPoint,
        account: getDefaultWallet(),
      });
      dispatch(setViewContract({ [key]: contract as ContractBasic }));

      return contract as ContractBasic;
    },
    [chainInfo, dispatch, viewContracts],
  );
}

/**
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use the `useGetContract` instead.
 */
export function useGetCurrentCAContract(_chainId?: ChainId) {
  const originChainId = useOriginChainId();
  const chainId = useMemo(() => _chainId || originChainId, [_chainId, originChainId]);
  const chainInfo = useChainInfo(chainId);
  const pin = usePin();
  const { AESEncryptPrivateKey, address } = useCurrentAccount() || {};
  const [{ caContracts }, dispatch] = useInterface();
  const key = useMemo(
    () => `${address}_${chainInfo?.caContractAddress}_${chainInfo?.chainId}`,
    [address, chainInfo?.caContractAddress, chainInfo?.chainId],
  );
  const caContract = useMemo(() => {
    return caContracts?.[chainId]?.[key];
  }, [caContracts, chainId, key]);

  return useCallback(async () => {
    if (caContract) {
      return caContract;
    }

    if (!chainInfo) {
      throw Error('Could not find chain information');
    }
    if (!pin || !AESEncryptPrivateKey) {
      throw Error('Could not find wallet information');
    }

    const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
    const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);

    const contract = await getContractBasic({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo.endPoint,
      account: wallet,
    });
    dispatch(setCAContract({ [key]: contract as ContractBasic }, chainId));
    return contract as ContractBasic;
  }, [AESEncryptPrivateKey, caContract, chainId, chainInfo, dispatch, key, pin]);
}
export function useGetCurrentTokenClaimContract(_chainId?: ChainId) {
  const currentNetworkInfo = useCurrentNetworkInfo();
  const originChainId = useOriginChainId();
  const chainId = useMemo(() => _chainId || originChainId, [_chainId, originChainId]);
  const chainInfo = useChainInfo(chainId);
  console.log('chainInfo is::', JSON.stringify(chainInfo));
  const pin = usePin();
  const { AESEncryptPrivateKey } = useCurrentAccount() || {};

  return useCallback(async () => {
    if (!chainInfo) {
      throw Error('Could not find chain information');
    }
    if (!pin || !AESEncryptPrivateKey) {
      throw Error('Could not find wallet information');
    }

    const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
    const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);

    const contract = await getContractBasic({
      contractAddress: currentNetworkInfo.tokenClaimContractAddress || '',
      rpcUrl: chainInfo.endPoint,
      account: wallet,
    });
    return contract as ContractBasic;
  }, [AESEncryptPrivateKey, chainInfo, currentNetworkInfo.tokenClaimContractAddress, pin]);
}
/**
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use the `useGetContract` instead.
 */
export function useGetCAContract() {
  const pin = usePin();
  const { AESEncryptPrivateKey, address } = useCurrentWalletInfo();
  const [{ caContracts }, dispatch] = useInterface();

  const getChainInfo = useGetChainInfo();

  return useCallback(
    async (chainId: ChainId) => {
      const chainInfo = getChainInfo(chainId);
      if (!chainInfo) {
        throw Error('Could not find chain information');
      }
      const key = `${address}_${chainInfo.caContractAddress}_${chainInfo.chainId}`;
      const caContract = caContracts?.[chainId]?.[key];
      if (caContract) {
        return caContract;
      }

      if (!pin || !AESEncryptPrivateKey) {
        throw Error('Could not find wallet information');
      }

      const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
      const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);

      const contract = await getContractBasic({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo.endPoint,
        account: wallet,
      });
      dispatch(setCAContract({ [key]: contract as ContractBasic }, chainId));
      return contract as ContractBasic;
    },
    [AESEncryptPrivateKey, address, caContracts, dispatch, getChainInfo, pin],
  );
}

export function useGetTokenContract() {
  const pin = usePin();
  const currentAccount = useCurrentAccount();

  const getChainInfo = useGetChainInfo();

  return useCallback(
    async (chainId: ChainId) => {
      const chainInfo = getChainInfo(chainId);
      if (!chainInfo) {
        throw Error('Could not find chain information');
      }

      const { AESEncryptPrivateKey } = currentAccount || {};

      if (!pin) {
        throw Error('Could not find pin');
      }
      if (!AESEncryptPrivateKey) {
        throw Error('Could not find wallet information');
      }

      const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
      const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);

      const contract = await getContractBasic({
        contractAddress: chainInfo.defaultToken.address,
        rpcUrl: chainInfo.endPoint,
        account: wallet,
      });

      return contract as ContractBasic;
    },
    [currentAccount, getChainInfo, pin],
  );
}

export function useGetTokenViewContract() {
  const getChainInfo = useGetChainInfo();

  return useCallback(
    async (chainId: ChainId) => {
      const chainInfo = getChainInfo(chainId);
      if (!chainInfo) {
        throw Error('Could not find chain information');
      }

      const contract = await getContractBasic({
        contractAddress: chainInfo.defaultToken.address,
        rpcUrl: chainInfo.endPoint,
        account: getDefaultWallet(),
      });
      return contract as ContractBasic;
    },
    [getChainInfo],
  );
}

export type TGetViewContractParams = {
  chainId: ChainId;
  contractAddress: string;
};
export const useGetViewContract = () => {
  const getChainInfo = useGetChainInfo();

  return useCallback(
    async ({ chainId, contractAddress }: TGetViewContractParams) => {
      const chainInfo = getChainInfo(chainId);
      if (!chainInfo) {
        throw Error('Could not find chain information');
      }

      const contract = await getContractBasic({
        contractAddress,
        rpcUrl: chainInfo.endPoint,
        account: getDefaultWallet(),
      });
      return contract as ContractBasic;
    },
    [getChainInfo],
  );
};

export function useGetContract() {
  const pin = usePin();
  const currentAccount = useCurrentAccount();

  const getChainInfo = useGetChainInfo();

  return useCallback(
    async (chainId: ChainId, contractAddress: string) => {
      const chainInfo = getChainInfo(chainId);
      if (!chainInfo) {
        throw Error('Could not find chain information');
      }

      const { AESEncryptPrivateKey } = currentAccount || {};
      if (!pin || !AESEncryptPrivateKey) {
        throw Error('Could not find wallet information');
      }

      const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
      const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);

      const contract = await getContractBasic({
        contractAddress,
        rpcUrl: chainInfo.endPoint,
        account: wallet,
      });

      return contract as ContractBasic;
    },
    [currentAccount, getChainInfo, pin],
  );
}
