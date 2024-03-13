import { request } from 'packages/api/api-did';

export function fetchRecentTransactionUsers({
  caAddresses = [],
  skipCount = 0,
  maxResultCount = 10,
  caAddressInfos,
}: {
  caAddresses?: string[];
  skipCount?: number;
  maxResultCount?: number;
  caAddressInfos?: { chainId: string; caAddress: string }[];
}): Promise<any> {
  return request.recent.fetchRecentTransactionUsers({
    params: {
      caAddresses,
      caAddressInfos,
      skipCount,
      maxResultCount,
    },
  });
}
