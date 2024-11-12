import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export type TGraphQLClient = ApolloClient<NormalizedCacheObject>;

export type TGraphQLParamsType<T> = T extends (...arg: infer P) => any ? P[1] : T;
