// the rate store is to get rates of tokens to USDT/CNY....,  update the rates will be updated every 10min

// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type ELFRateResponseType = {
  USDT: string | number;
};

// Define a service using a base URL and expected endpoints
export const rateApi = createApi({
  reducerPath: 'rateApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://explorer.aelf.io/api/' }),
  endpoints: builder => ({
    getRateByName: builder.query<string, { fsym: string; tsyms: string[] }>({
      query: ({ fsym, tsyms }) => `token/price?fsym=${fsym}&tsyms=${tsyms.join(',')}`,
    }),
    getELFRate: builder.query<ELFRateResponseType, object>({
      query: () => `token/price?fsym=${'ELF'}&tsyms=${['USDT', 'BTC', 'CNY'].join(',')}`,
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetRateByNameQuery, useGetELFRateQuery } = rateApi;
