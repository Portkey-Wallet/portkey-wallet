import { ApolloClient, InMemoryCache, HttpLink, DefaultOptions } from '@apollo/client';

export const graphQLClientProvider = (graphqlUrl: string, defaultOptions: DefaultOptions = {}) => {
  console.log('graphQLClientProvider init: ', graphqlUrl);
  return new ApolloClient({
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
};
