import AElf from 'aelf-sdk';
import { COMMON_PRIVATE } from 'packages/constants';
import { AElfInterface } from 'packages/types/aelf';
import { ChainId } from 'packages/types';
import { isValidBase58 } from './reg';
import { getTxResult } from 'packages/contracts/utils';
const Wallet = AElf.wallet;

export function isEqAddress(a1?: string, a2?: string) {
  return a1?.toLocaleLowerCase() === a2?.toLocaleLowerCase();
}

export function isAelfAddress(value?: string) {
  if (!value || !isValidBase58(value)) return false;
  if (value.includes('_') && value.split('_').length < 3) return false;
  try {
    return !!AElf.utils.decodeAddressRep(value);
  } catch {
    return false;
  }
}

export const getChainNumber = (chainId: string) => {
  return AElf.utils.chainIdConvertor.base58ToChainId(chainId);
};

export function isDIDAelfAddress(value?: string) {
  if (!value || !isValidBase58(value)) return false;
  if (value.includes('_') && value.split('_').length === 2) {
    const arr = value.split('_');
    const res = arr[0].length > arr[1].length ? arr[0] : arr[1];
    try {
      return !!AElf.utils.decodeAddressRep(res);
    } catch {
      return false;
    }
  }
  try {
    return !!AElf.utils.decodeAddressRep(value);
  } catch {
    return false;
  }
}

const initAddressInfo = {
  prefix: '',
  address: '',
  suffix: '',
};
export const getAddressInfo = (value: string): { prefix: string; address: string; suffix: string } => {
  const arr = value.split('_');
  if (arr.length > 3 || arr.length === 0) return initAddressInfo;
  if (arr.length === 3) return { prefix: arr[0], address: arr[1], suffix: arr[2] };
  if (arr.length === 1) return { ...initAddressInfo, address: value };
  // arr.length === 2
  if (isAelfAddress(arr[0])) return { ...initAddressInfo, address: arr[0], suffix: arr[1] };
  return { ...initAddressInfo, prefix: arr[0], address: arr[1] };
};

export function getEntireDIDAelfAddress(value: string, defaultPrefix = 'ELF', defaultSuffix = 'AELF') {
  const arr = value.split('_');
  if (arr.length > 3 || arr.length === 0) return '';
  if (arr.length === 3) return value;
  if (arr.length === 1) return `${defaultPrefix}_${value}_${defaultSuffix}`;
  // arr.length === 2
  if (isAelfAddress(arr[0])) return `${defaultPrefix}_${value}`;
  return `${value}_${defaultSuffix}`;
}

export function isAllowAelfAddress(value: string) {
  const arr = value.split('_');
  if (arr.length > 3 || arr.length === 0) return false;
  if (arr.length === 3 || arr.length === 1) return isAelfAddress(value);
  // arr.length === 2
  for (let i = 0; i < arr.length; i++) {
    if (isAelfAddress(arr[i])) return true;
  }
  return false;
}

export function getAelfAddress(value = '') {
  const arr = value.split('_');
  if (arr.length === 3) return arr[1];
  for (let i = 0; i < arr.length; i++) {
    if (isAelfAddress(arr[i])) return arr[i];
  }
  return value;
}

export function getWallet(privateKey = COMMON_PRIVATE) {
  return Wallet.getWalletByPrivateKey(privateKey);
}

export const getAelfInstance = (rpcUrl: string) => {
  return new AElf(new AElf.providers.HttpProvider(rpcUrl, 20000));
};
export const getAelfTxResult = (rpcUrl: string, txId: string) => {
  const aelf = getAelfInstance(rpcUrl);
  return getTxResult(aelf, txId);
};
export const getELFContract = async (rpcUrl: string, tokenAddress: string, privateKey?: string) => {
  const aelf = getAelfInstance(rpcUrl);
  const wallet = privateKey ? Wallet.getWalletByPrivateKey(privateKey) : getWallet();
  return await aelf.chain.contractAt(tokenAddress, wallet);
};

const isWrappedBytes = (resolvedType: any, name: string) => {
  if (!resolvedType?.name || resolvedType?.name !== name) {
    return false;
  }
  if (!resolvedType?.fieldsArray || resolvedType?.fieldsArray.length !== 1) {
    return false;
  }
  return resolvedType?.fieldsArray[0].type === 'bytes';
};

const isAddress = (resolvedType: any) => isWrappedBytes(resolvedType, 'Address');

const isHash = (resolvedType: any) => isWrappedBytes(resolvedType, 'Hash');

export function transformArrayToMap(inputType: any, origin: any[]) {
  if (!origin) return '';
  if (!Array.isArray(origin)) return origin;
  if (origin.length === 0) return '';
  if (isAddress(inputType) || isHash(inputType)) return origin[0];

  const { fieldsArray } = inputType;
  const fieldsLength = (fieldsArray || []).length;

  if (fieldsLength === 0) return origin;

  if (fieldsLength === 1) {
    const i = fieldsArray[0];
    return { [i.name]: origin[0] };
  }

  let result = origin;
  Array.isArray(fieldsArray) &&
    Array.isArray(origin) &&
    fieldsArray.forEach((i, k) => {
      result = {
        ...result,
        [i.name]: origin[k],
      };
    });
  return result;
}

export type EncodedParams = {
  instance: AElfInterface;
  functionName: string;
  paramsOption: any;
  contract: any;
};
/**
 * encodedTx
 * @returns raw string / { error: { message } }
 */
export const encodedTx = async ({ instance, functionName, paramsOption, contract }: EncodedParams) => {
  try {
    const chainStatus = await instance.chain.getChainStatus();
    const raw = await contract[functionName].getSignedTx(paramsOption, {
      height: chainStatus?.BestChainHeight,
      hash: chainStatus?.BestChainHash,
    });
    return raw;
  } catch (e) {
    return { error: e };
  }
};

/**
 * to check if the transfer is crossChain
 * @param toAddress
 * @param fromChainId
 */
export const isCrossChain = (toAddress: string, fromChainId: ChainId): boolean => {
  if (!toAddress.includes('_')) return false;
  const arr = toAddress.split('_');
  const addressChainId = arr[arr.length - 1];
  // no suffix
  if (isAelfAddress(addressChainId)) {
    return false;
  }
  return addressChainId !== fromChainId;
};
