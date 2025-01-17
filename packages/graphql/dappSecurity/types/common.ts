import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TCommonGraphQLResult } from '.';

export type TGraphQLClient = ApolloClient<NormalizedCacheObject>;

export type TGraphQLParamsType<T> = T extends (...arg: infer P) => any ? P[1] : T;

export type TGraphQLFunc<T, R> = (client: TGraphQLClient, params: T) => TCommonGraphQLResult<R>;
