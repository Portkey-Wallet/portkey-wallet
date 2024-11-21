import { getLimitOrderRemainingUnfilled, getPairReserve } from '../request';
import { getGraphQLClient } from '../client';
import { useCallback, useMemo } from 'react';
import { TGraphQLParamsType } from '../types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

const AWAKEN_GRAPHQL_URL_MAP: Record<string, string> = {
  test: 'https://app-testnet.aefinder.io/awaken/e55a9e430bd14ebb95ef81378906fd5f/graphql',
  mainnet: 'https://app.aefinder.io/awaken/995f8e7e957d43d6b1706a4e351e2e47/graphql',
};

export const useAwakenGraphQLClient = () => {
  const isMainnet = useIsMainnet();
  return useMemo(() => {
    const url = isMainnet ? AWAKEN_GRAPHQL_URL_MAP['mainnet'] : AWAKEN_GRAPHQL_URL_MAP['test'];
    return getGraphQLClient(url);
  }, [isMainnet]);
};

export const useGetLimitOrderRemainingUnfilled = () => {
  const client = useAwakenGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getLimitOrderRemainingUnfilled>) =>
      getLimitOrderRemainingUnfilled(client, params),
    [client],
  );
};

export const useGetPairReserve = () => {
  const client = useAwakenGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getPairReserve>) => getPairReserve(client, params), [client]);
};
