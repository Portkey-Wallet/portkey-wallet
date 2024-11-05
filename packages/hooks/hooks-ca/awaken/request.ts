import { useCallback, useMemo } from 'react';
import { useCurrentNetworkInfo } from '../network';
import { request } from '@portkey-wallet/api/api-did';
import { useCurrentDAppChain } from '../chainList';

const useAwakenApiUrl = () => {
  const network = useCurrentNetworkInfo();
  return useMemo(() => network.awakenUrl || '', [network.awakenUrl]);
};

export type TGetSwapRoutesParams = {
  symbolIn: string;
  symbolOut: string;
  isFocusValueIn: boolean;
  amountIn?: string;
  amountOut?: string;
};

export const useGetPairPathApi = () => {
  const baseURL = useAwakenApiUrl();
  const currentDAppChain = useCurrentDAppChain();

  return useCallback(
    async ({ symbolIn, symbolOut, isFocusValueIn, amountIn, amountOut }: TGetSwapRoutesParams) => {
      const res = await request.awakenApi.getSwapRoutes({
        baseURL,
        params: {
          ChainId: currentDAppChain?.chainId || '',
          symbolIn,
          symbolOut,
          routeType: isFocusValueIn ? 0 : 1,
          amountIn,
          amountOut,
        },
      });
      if (!res) throw new Error('no pair path');
      return res?.data?.items || [];
    },
    [baseURL, currentDAppChain?.chainId],
  );
};

export const useGetAwakenGasFee = () => {
  const baseURL = useAwakenApiUrl();

  return useCallback(async (): Promise<string | undefined> => {
    const res = await request.awakenApi.getAwakenGasFee({
      baseURL,
    });
    return res?.data?.transactionFee;
  }, [baseURL]);
};
