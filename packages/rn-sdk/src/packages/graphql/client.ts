import { ApolloClient, InMemoryCache, HttpLink, DefaultOptions } from '@apollo/client';

export const graphQLClientProvider = (graphqlUrl: string, defaultOptions: DefaultOptions = {}) =>
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
