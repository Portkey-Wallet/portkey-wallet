import { ChainId, ChainType } from '@portkey/types';
/**
 * format address like "aaa...bbb" to "ELF_aaa...bbb_AELF"
 * @param address
 * @param chainId
 * @param chainType
 * @returns
 */
export const addressFormat = (address?: string, chainId?: ChainId, chainType: ChainType = 'aelf'): string => {
  if (!address) return '';
  if (chainType !== 'aelf') return address;

  const arr = address.split('_');
  if (address.includes('_') && arr.length < 3) return address;
  if (address.includes('_')) return `ELF_${arr[1]}_${chainId}`;
  return `ELF_${address}_${chainId}`;
};
