import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginMode_LoginModeMatch_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.LoginMode_LoginModeMatch_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type LoginMode_LoginModeMatch_AggregatedQuery = {
  __typename?: 'Query';
  loginMode_loginModeMatch_aggregated: Array<{
    __typename?: 'loginMode_loginModeMatch_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'loginMode_loginModeMatch_aggregated_count';
      id?: number | null;
      loginMode_id?: number | null;
      loginModeMatch_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'loginMode_loginModeMatch_aggregated_count';
      id?: number | null;
      loginMode_id?: number | null;
      loginModeMatch_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'loginMode_loginModeMatch_aggregated_fields';
      id?: number | null;
      loginMode_id?: number | null;
      loginModeMatch_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'loginMode_loginModeMatch_aggregated_fields';
      id?: number | null;
      loginMode_id?: number | null;
      loginModeMatch_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'loginMode_loginModeMatch_aggregated_fields';
      id?: number | null;
      loginMode_id?: number | null;
      loginModeMatch_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'loginMode_loginModeMatch_aggregated_fields';
      id?: number | null;
      loginMode_id?: number | null;
      loginModeMatch_id?: number | null;
    } | null;
    min?: {
      __typename?: 'loginMode_loginModeMatch_aggregated_fields';
      id?: number | null;
      loginMode_id?: number | null;
      loginModeMatch_id?: number | null;
    } | null;
    max?: {
      __typename?: 'loginMode_loginModeMatch_aggregated_fields';
      id?: number | null;
      loginMode_id?: number | null;
      loginModeMatch_id?: number | null;
    } | null;
  }>;
};

export const LoginMode_LoginModeMatch_AggregatedDocument = gql`
  query loginMode_loginModeMatch_aggregated(
    $groupBy: [String]
    $filter: loginMode_loginModeMatch_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    loginMode_loginModeMatch_aggregated(
      groupBy: $groupBy
      filter: $filter
      limit: $limit
      offset: $offset
      page: $page
      search: $search
      sort: $sort
    ) {
      group
      countAll
      count {
        id
        loginMode_id
        loginModeMatch_id
      }
      countDistinct {
        id
        loginMode_id
        loginModeMatch_id
      }
      avg {
        id
        loginMode_id
        loginModeMatch_id
      }
      sum {
        id
        loginMode_id
        loginModeMatch_id
      }
      avgDistinct {
        id
        loginMode_id
        loginModeMatch_id
      }
      sumDistinct {
        id
        loginMode_id
        loginModeMatch_id
      }
      min {
        id
        loginMode_id
        loginModeMatch_id
      }
      max {
        id
        loginMode_id
        loginModeMatch_id
      }
    }
  }
`;

/**
 * __useLoginMode_LoginModeMatch_AggregatedQuery__
 *
 * To run a query within a React component, call `useLoginMode_LoginModeMatch_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginMode_LoginModeMatch_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginMode_LoginModeMatch_AggregatedQuery({
 *   variables: {
 *      groupBy: // value for 'groupBy'
 *      filter: // value for 'filter'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useLoginMode_LoginModeMatch_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoginMode_LoginModeMatch_AggregatedQuery,
    LoginMode_LoginModeMatch_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginMode_LoginModeMatch_AggregatedQuery, LoginMode_LoginModeMatch_AggregatedQueryVariables>(
    LoginMode_LoginModeMatch_AggregatedDocument,
    options,
  );
}
export function useLoginMode_LoginModeMatch_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoginMode_LoginModeMatch_AggregatedQuery,
    LoginMode_LoginModeMatch_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoginMode_LoginModeMatch_AggregatedQuery,
    LoginMode_LoginModeMatch_AggregatedQueryVariables
  >(LoginMode_LoginModeMatch_AggregatedDocument, options);
}
export type LoginMode_LoginModeMatch_AggregatedQueryHookResult = ReturnType<
  typeof useLoginMode_LoginModeMatch_AggregatedQuery
>;
export type LoginMode_LoginModeMatch_AggregatedLazyQueryHookResult = ReturnType<
  typeof useLoginMode_LoginModeMatch_AggregatedLazyQuery
>;
export type LoginMode_LoginModeMatch_AggregatedQueryResult = Apollo.QueryResult<
  LoginMode_LoginModeMatch_AggregatedQuery,
  LoginMode_LoginModeMatch_AggregatedQueryVariables
>;
