import { useCurrentChain, useGetChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import aes from '@portkey-wallet/utils/aes';
import { useInterface } from '../contexts/useInterface';
import { setCAContract, setViewContract, setTokenContract } from '../contexts/useInterface/actions';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCallback, useMemo } from 'react';
import { getDefaultWallet } from '@portkey-wallet/utils/aelfUtils';
import AElf from 'aelf-sdk';
import { usePin } from './store';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';

export function useGetCurrentCAViewContract(_chainId?: ChainId) {
  const originChainId = useOriginChainId();
  const chainId = useMemo(() => _chainId || originChainId, [_chainId, originChainId]);
  const chainInfo = useCurrentChain(chainId);
  const t = useInterface();
  const [{ viewContracts }, dispatch] = useInterface();

  return useCallback(
    async (paramChainInfo?: ChainItemType) => {
      const _chainInfo = paramChainInfo || chainInfo;
      if (!_chainInfo) throw Error('Could not find chain information');

      const key = _chainInfo.caContractAddress + _chainInfo.endPoint;
      const caContract = viewContracts?.[key];
      if (caContract) return caContract;

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

export function useGetCurrentCAContract(_chainId?: ChainId) {
  const originChainId = useOriginChainId();
  const chainId = useMemo(() => _chainId || originChainId, [_chainId, originChainId]);
  const chainInfo = useCurrentChain(chainId);
  const pin = usePin();
  const { AESEncryptPrivateKey, address } = useCurrentWalletInfo();
  const [{ caContracts }, dispatch] = useInterface();
  const key = useMemo(() => address + '_' + chainInfo?.caContractAddress, [address, chainInfo?.caContractAddress]);
  const caContract = useMemo(() => {
    return caContracts?.[chainId]?.[key];
  }, [caContracts, chainId, key]);

  return useCallback(async () => {
    if (caContract) return caContract;

    if (!chainInfo) throw Error('Could not find chain information');
    if (!pin || !AESEncryptPrivateKey) throw Error('Could not find wallet information');

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

export function useGetCAContract() {
  const pin = usePin();
  const { AESEncryptPrivateKey, address } = useCurrentWalletInfo();
  const [{ caContracts }, dispatch] = useInterface();

  const getChain = useGetChain();

  return useCallback(
    async (chainId: ChainId) => {
      const chainInfo = getChain(chainId);
      if (!chainInfo) throw Error('Could not find chain information');
      const key = address + '_' + chainInfo?.caContractAddress;
      const caContract = caContracts?.[chainId]?.[key];
      if (caContract) return caContract;

      if (!pin || !AESEncryptPrivateKey) throw Error('Could not find wallet information');

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
    [AESEncryptPrivateKey, address, caContracts, dispatch, getChain, pin],
  );
}

export function useGetTokenContract() {
  const pin = usePin();
  const { AESEncryptPrivateKey, address } = useCurrentWalletInfo();
  const [{ tokenContracts }, dispatch] = useInterface();

  const getChain = useGetChain();

  return useCallback(
    async (chainId: ChainId) => {
      const chainInfo = getChain(chainId);
      if (!chainInfo) throw Error('Could not find chain information');
      const key = `${address}_${chainInfo.defaultToken.address}_${chainInfo.chainId}`;

      const tokenContract = tokenContracts?.[chainId]?.[key];
      if (tokenContract) return tokenContract;

      if (!pin || !AESEncryptPrivateKey) throw Error('Could not find wallet information');

      const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
      const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);

      const contract = await getContractBasic({
        contractAddress: chainInfo.defaultToken.address,
        rpcUrl: chainInfo.endPoint,
        account: wallet,
      });
      dispatch(setTokenContract({ [key]: contract as ContractBasic }, chainId));
      return contract as ContractBasic;
    },
    [AESEncryptPrivateKey, address, dispatch, getChain, pin, tokenContracts],
  );
}

export function useGetTokenViewContract() {
  const getChain = useGetChain();

  return useCallback(
    async (chainId: ChainId) => {
      const chainInfo = getChain(chainId);
      if (!chainInfo) throw Error('Could not find chain information');

      const contract = await getContractBasic({
        contractAddress: chainInfo.defaultToken.address,
        rpcUrl: chainInfo.endPoint,
        account: getDefaultWallet(),
      });
      return contract as ContractBasic;
    },
    [getChain],
  );
}
