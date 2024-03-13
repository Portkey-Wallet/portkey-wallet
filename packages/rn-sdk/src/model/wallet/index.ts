import { PortkeyConfig, setCurrChainId } from 'global/constants';
import useEffectOnce from 'hooks/useEffectOnce';
import { callGetHolderInfoMethod } from 'model/contract/handler';
import { getCaInfoByAccountIdentifierOrSessionId } from 'model/global';
import { getTempWalletConfig, isWalletUnlocked } from 'model/verify/core';
import { NetworkController } from 'network/controller';
import { CaInfo } from 'network/dto/guardian';
import { useState } from 'react';
import { handleCachedValue } from 'service/storage/cache';

export const getUnlockedWallet = async ({
  getMultiCaAddresses,
}: GetWalletConfig = DefaultConfig): Promise<UnlockedWallet> => {
  if (!(await isWalletUnlocked())) throw new Error('wallet is not unlocked');
  const {
    sessionId,
    accountIdentifier,
    fromRecovery,
    originalChainId = 'AELF',
    privateKey,
    publicKey,
    address,
    caInfo: originalCaInfo,
  } = (await getTempWalletConfig()) || {};
  let checkedOriginalChainId = originalChainId;
  if (accountIdentifier && !originalChainId) {
    const chainInfo = await NetworkController.getRegisterResult(accountIdentifier);
    checkedOriginalChainId = chainInfo.result?.originChainId || originalChainId;
  }
  const endPointUrl = await PortkeyConfig.endPointUrl();
  setCurrChainId(checkedOriginalChainId as any);
  const caInfo =
    originalCaInfo ??
    (await getCaInfoByAccountIdentifierOrSessionId(originalChainId, accountIdentifier, fromRecovery, sessionId));
  if (!caInfo) throw new Error('caInfo is not exist');
  let multiCaAddresses: {
    [key: string]: string;
  } = {};
  multiCaAddresses[originalChainId] = caInfo.caAddress;
  if (getMultiCaAddresses) {
    multiCaAddresses = await getCachedCaAddress(endPointUrl, caInfo, originalChainId);
  }
  return {
    caInfo,
    originChainId: checkedOriginalChainId,
    privateKey,
    publicKey,
    address,
    multiCaAddresses,
    name: 'Wallet 01', // TODO will be changed later
  };
};

const getCachedCaAddress = async (endPoint: string, originalCaInfo: CaInfo, originalChainId: string) => {
  return handleCachedValue({
    getIdentifier: async () => {
      const caHash = originalCaInfo.caHash;
      return `${caHash}_${endPoint}`;
    },
    getValueIfNonExist: async () => {
      const { items } = await NetworkController.getNetworkInfo();
      const multiCaAddresses: {
        [key: string]: string;
      } = {};
      multiCaAddresses[originalChainId] = originalCaInfo.caAddress;
      for (const item of items) {
        if (item.chainId === originalChainId) continue;
        const res = await callGetHolderInfoMethod(originalCaInfo.caHash, item.caContractAddress, item.endPoint);
        if (res?.error) {
          console.log('getMultiCaAddresses error, chain: ', item.chainId, 'res: ', res?.error);
          continue;
        } else {
          console.log('getMultiCaAddresses success, chain: ', item.chainId, 'res: ', res?.data);
          multiCaAddresses[item.chainId] = res?.data?.caAddress;
        }
      }
      return multiCaAddresses;
    },
    target: 'TEMP',
  });
};

export const useUnlockedWallet = (config: GetWalletConfig = DefaultConfig) => {
  const [wallet, setWallet] = useState<UnlockedWallet>();
  useEffectOnce(async () => {
    const tempWallet = await getUnlockedWallet(config);
    setWallet(tempWallet);
  });
  return {
    wallet,
  };
};

export type GetWalletConfig = {
  getMultiCaAddresses?: boolean;
};

const DefaultConfig: GetWalletConfig = {
  getMultiCaAddresses: false,
};

export type UnlockedWallet = {
  /**
   * the ca info on the origin chain marked by originChainId.
   */
  caInfo: {
    /**
     * caHash is account's unique identifier, which is shared by all chains.
     */
    caHash: string;
    /**
     * the caAddress on the origin chain.
     */
    caAddress: string;
  };
  /**
   * If getMultiCaAddresses===true, the multiCaAddresses will be returned, containing all caAddresses on all existing chains.
   */
  multiCaAddresses: {
    [key: string]: string;
  };
  name: string;
  originChainId: string;
} & {
  privateKey: string;
  publicKey: string;
  address: string;
};
