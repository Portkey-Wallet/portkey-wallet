import { getGraphQLClient } from '../client';
import { useCallback, useMemo } from 'react';
import { TGraphQLParamsType } from '../types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { getContractUpgradeTime } from '../request';

const AWAKEN_GRAPHQL_URL_MAP: Record<string, string> = {
  test: 'https://test-indexer-api.aefinder.io/api/app/graphql/genesisapp',
  mainnet: 'https://indexer-api.aefinder.io/api/app/graphql/genesisapp',
};

export const useGraphQLClient = () => {
  const isMainnet = useIsMainnet();
  return useMemo(() => {
    const url = isMainnet ? AWAKEN_GRAPHQL_URL_MAP['mainnet'] : AWAKEN_GRAPHQL_URL_MAP['test'];
    return getGraphQLClient(url);
  }, [isMainnet]);
};

export const useGetContractUpgradeTime = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getContractUpgradeTime>) => getContractUpgradeTime(client, params),
    [client],
  );
};
