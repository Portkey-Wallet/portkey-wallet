import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { NetworkType } from 'packages/types';
import { NetworkList } from 'packages/constants/constants-ca/network';
import { graphQLClientProvider } from '../client';

export const networkClientMap: Record<string, ApolloClient<NormalizedCacheObject>> = {};

export const getApolloClient = (networkType: NetworkType) => {
  if (!networkClientMap[networkType]) {
    const graphqlUrl = NetworkList.find(item => item.networkType === networkType)?.graphqlUrl || '';
    console.log('graphqlUrl', graphqlUrl);
    networkClientMap[networkType] = graphQLClientProvider(graphqlUrl);
  }
  return networkClientMap[networkType];
};
