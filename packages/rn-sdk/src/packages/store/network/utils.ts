import { ChainActionError } from './types';
import AElf from 'aelf-sdk';
import { ChainType } from 'packages/types';
import { enumToMap, formatRpcUrl, isUrl } from 'packages/utils';
import { ChainItemType } from 'packages/types/chain';

type CheckRpcUrlParam = {
  chainList?: ChainItemType[];
  rpcUrl?: string;
  chainType?: ChainType;
  chainId?: string | number;
  blockExplorerURL?: string;
};

export const getElfChainStatus = async (rpcUrl: string) => {
  const aelf = new AElf(new AElf.providers.HttpProvider(formatRpcUrl(rpcUrl)));
  try {
    return await aelf.chain.getChainStatus();
  } catch (error) {
    throw new Error(ChainActionError.InvalidRpcUrl);
  }
};

export const checkRpcUrlFormat = async ({
  rpcUrl,
  chainType,
  chainId,
  blockExplorerURL,
}: Omit<CheckRpcUrlParam, 'chainList'>) => {
  if (!rpcUrl) throw new Error(ChainActionError.noValue);
  if (!isUrl(rpcUrl)) throw new Error(ChainActionError.InvalidRpcUrl);
  if (blockExplorerURL && !isUrl(blockExplorerURL)) throw new Error(ChainActionError.invalidExplorerURL);
  if (chainType === 'aelf') {
    const chainStatus = await getElfChainStatus(rpcUrl);
    if (chainId && chainId !== chainStatus.ChainId) throw new Error(ChainActionError.chainIdError);
    return chainStatus;
  } else if (chainType === 'ethereum') {
    // TODO ethereum
    throw new Error(ChainActionError.notSupported);
  } else {
    throw new Error(ChainActionError.notSupported);
  }
};

export const checkRpcUrl = async ({
  chainList = [],
  rpcUrl,
  chainType,
  key,
}: CheckRpcUrlParam & { key?: string }): Promise<string> => {
  const flag = chainList.some(chain => chain.rpcUrl === rpcUrl && chain.key !== key);
  if (flag) throw new Error(ChainActionError.rpcUrlAlreadyExists);
  const chainStatus = await checkRpcUrlFormat({ rpcUrl, chainType });
  return chainStatus.ChainId;
};

export const checkNetworkName = (
  chainList: ChainItemType[] = [],
  name: string,
  t?: (text: string) => string,
  key?: string,
) => {
  if (!name) throw new Error(t ? t(ChainActionError.noName) : ChainActionError.noName);
  console.log(key, name, chainList, 'key');
  if (name.length > 50) throw new Error(t ? t(ChainActionError.nameMaxLength) : ChainActionError.nameMaxLength);
  if (chainList?.some(item => item.networkName === name && item.key !== key))
    throw new Error(t ? t(ChainActionError.nameHave) : ChainActionError.nameHave);
  return true;
};

export const checkNetworkNameIsExist = (chainList: ChainItemType[] = [], name: string) => {
  return chainList?.some(item => item.networkName === name);
};

const networkError = enumToMap(ChainActionError);

export type NetWorkError = {
  chainId?: ChainActionError;
  rpcUrl?: ChainActionError;
  networkName?: ChainActionError;
  blockExplorerURL?: ChainActionError;
};

export const formatNetworkError = (error: any): NetWorkError | false => {
  const message = isNetworkError(error);
  if (!message) return message;
  switch (message) {
    case ChainActionError.chainIdError:
    case ChainActionError.noChainId:
      return { chainId: error.message };
    case ChainActionError.rpcUrlAlreadyExists:
    case ChainActionError.actionTypeError:
    case ChainActionError.notExist:
    case ChainActionError.notSupported:
    case ChainActionError.noValue:
    case ChainActionError.InvalidRpcUrl:
    case ChainActionError.hasRpcUrl:
      return { rpcUrl: error.message };
    case ChainActionError.nameHave:
    case ChainActionError.noName:
    case ChainActionError.nameMaxLength:
    case ChainActionError.hasName:
      return { networkName: error.message };
    case ChainActionError.invalidExplorerURL:
      return { blockExplorerURL: error.message };
  }
};

export function isNetworkError(error: any): ChainActionError | false {
  if (networkError[error?.message]) {
    return error.message;
  }
  return false;
}
