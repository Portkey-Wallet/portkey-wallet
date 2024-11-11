import { TGraphQLClient } from '../types';
import { graphQLClientProvider } from './provider';

export const graphQLClientMap: Record<string, TGraphQLClient> = {};

export const getGraphQLClient = (graphqlUrl: string) => {
  if (graphQLClientMap[graphqlUrl]) {
    return graphQLClientMap[graphqlUrl];
  }
  const client = graphQLClientProvider(graphqlUrl);
  graphQLClientMap[graphqlUrl] = client;
  return client;
};
