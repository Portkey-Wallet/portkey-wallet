import { useCallback, useMemo } from 'react';
import { useCurrentNetworkInfo } from '../network';
import { request } from '@portkey-wallet/api/api-did';
import { useDAppChain } from '../chainList';

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

export const useGetSwapRoutes = () => {
  const baseURL = useAwakenApiUrl();
  const dAppChain = useDAppChain();

  return useCallback(
    async ({ symbolIn, symbolOut, isFocusValueIn, amountIn, amountOut }: TGetSwapRoutesParams) => {
      const res = await request.awakenApi.getSwapRoutes({
        baseURL,
        params: {
          ChainId: dAppChain?.chainId || '',
          symbolIn,
          symbolOut,
          routeType: isFocusValueIn ? 0 : 1,
          amountIn,
          amountOut,
        },
      });
      if (!res) throw new Error('no swap route');
      return res?.data;
    },
    [baseURL, dAppChain?.chainId],
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

export type TGetAwakenTokenPriceParams = {
  chainId: string;
  tokenAddress: string;
  symbol: string;
};
export const useGetAwakenTokenPrice = () => {
  const baseURL = useAwakenApiUrl();

  return useCallback(
    async (params: TGetAwakenTokenPriceParams): Promise<string | undefined> => {
      const res = await request.awakenApi.getAwakenTokenPrice({
        baseURL,
        params,
      });
      return res.data;
    },
    [baseURL],
  );
};
