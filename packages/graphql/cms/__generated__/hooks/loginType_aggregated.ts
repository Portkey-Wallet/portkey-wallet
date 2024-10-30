import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginType_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.LoginType_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type LoginType_AggregatedQuery = {
  __typename?: 'Query';
  loginType_aggregated: Array<{
    __typename?: 'loginType_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'loginType_aggregated_count';
      id?: number | null;
      label?: number | null;
      status?: number | null;
      value?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'loginType_aggregated_count';
      id?: number | null;
      label?: number | null;
      status?: number | null;
      value?: number | null;
    } | null;
    avg?: { __typename?: 'loginType_aggregated_fields'; id?: number | null } | null;
    sum?: { __typename?: 'loginType_aggregated_fields'; id?: number | null } | null;
    avgDistinct?: { __typename?: 'loginType_aggregated_fields'; id?: number | null } | null;
    sumDistinct?: { __typename?: 'loginType_aggregated_fields'; id?: number | null } | null;
    min?: { __typename?: 'loginType_aggregated_fields'; id?: number | null } | null;
    max?: { __typename?: 'loginType_aggregated_fields'; id?: number | null } | null;
  }>;
};

export const LoginType_AggregatedDocument = gql`
  query loginType_aggregated(
    $groupBy: [String]
    $filter: loginType_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    loginType_aggregated(
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
        label
        status
        value
      }
      countDistinct {
        id
        label
        status
        value
      }
      avg {
        id
      }
      sum {
        id
      }
      avgDistinct {
        id
      }
      sumDistinct {
        id
      }
      min {
        id
      }
      max {
        id
      }
    }
  }
`;

/**
 * __useLoginType_AggregatedQuery__
 *
 * To run a query within a React component, call `useLoginType_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginType_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginType_AggregatedQuery({
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
export function useLoginType_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginType_AggregatedQuery, LoginType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginType_AggregatedQuery, LoginType_AggregatedQueryVariables>(
    LoginType_AggregatedDocument,
    options,
  );
}
export function useLoginType_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginType_AggregatedQuery, LoginType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginType_AggregatedQuery, LoginType_AggregatedQueryVariables>(
    LoginType_AggregatedDocument,
    options,
  );
}
export type LoginType_AggregatedQueryHookResult = ReturnType<typeof useLoginType_AggregatedQuery>;
export type LoginType_AggregatedLazyQueryHookResult = ReturnType<typeof useLoginType_AggregatedLazyQuery>;
export type LoginType_AggregatedQueryResult = Apollo.QueryResult<
  LoginType_AggregatedQuery,
  LoginType_AggregatedQueryVariables
>;
