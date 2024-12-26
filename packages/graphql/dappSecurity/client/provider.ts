import { ApolloClient, InMemoryCache, HttpLink, DefaultOptions } from '@apollo/client';
import { TGraphQLClient } from '../types';

export const graphQLClientProvider = (graphqlUrl: string, defaultOptions: DefaultOptions = {}): TGraphQLClient =>
  new ApolloClient({
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
      ...defaultOptions,
    },
    link: new HttpLink({ uri: graphqlUrl }),
  });
