import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { NetworkType } from '@portkey-wallet/types';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';
import { graphQLClientProvider } from '../client';

export const networkClientMap: Record<string, ApolloClient<NormalizedCacheObject>> = {};

export const getApolloClient = (networkType: NetworkType) => {
  if (!networkClientMap[networkType]) {
    const graphqlUrl = NetworkList.find(item => item.networkType === networkType)?.cmsUrl || '';
    networkClientMap[networkType] = graphQLClientProvider(graphqlUrl);
  }
  return networkClientMap[networkType];
};
