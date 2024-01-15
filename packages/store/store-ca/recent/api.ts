import { request } from '@portkey-wallet/api/api-did';

export function fetchRecentTransactionUsers({
  skipCount = 0,
  maxResultCount = 10,
  caAddressInfos,
}: {
  skipCount?: number;
  maxResultCount?: number;
  caAddressInfos?: { chainId: string; caAddress: string }[];
}): Promise<any> {
  return request.recent.fetchRecentTransactionUsers({
    params: {
      caAddressInfos,
      skipCount,
      maxResultCount,
    },
  });
}
