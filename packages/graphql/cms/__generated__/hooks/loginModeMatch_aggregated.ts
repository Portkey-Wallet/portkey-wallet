import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginModeMatch_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.LoginModeMatch_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type LoginModeMatch_AggregatedQuery = {
  __typename?: 'Query';
  loginModeMatch_aggregated: Array<{
    __typename?: 'loginModeMatch_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'loginModeMatch_aggregated_count';
      id?: number | null;
      status?: number | null;
      weight?: number | null;
      matchSwitch?: number | null;
      matchRuleList?: number | null;
      description?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'loginModeMatch_aggregated_count';
      id?: number | null;
      status?: number | null;
      weight?: number | null;
      matchSwitch?: number | null;
      matchRuleList?: number | null;
      description?: number | null;
    } | null;
    avg?: { __typename?: 'loginModeMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
    sum?: { __typename?: 'loginModeMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
    avgDistinct?: {
      __typename?: 'loginModeMatch_aggregated_fields';
      id?: number | null;
      weight?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'loginModeMatch_aggregated_fields';
      id?: number | null;
      weight?: number | null;
    } | null;
    min?: { __typename?: 'loginModeMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
    max?: { __typename?: 'loginModeMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
  }>;
};

export const LoginModeMatch_AggregatedDocument = gql`
  query loginModeMatch_aggregated(
    $groupBy: [String]
    $filter: loginModeMatch_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    loginModeMatch_aggregated(
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
        status
        weight
        matchSwitch
        matchRuleList
        description
      }
      countDistinct {
        id
        status
        weight
        matchSwitch
        matchRuleList
        description
      }
      avg {
        id
        weight
      }
      sum {
        id
        weight
      }
      avgDistinct {
        id
        weight
      }
      sumDistinct {
        id
        weight
      }
      min {
        id
        weight
      }
      max {
        id
        weight
      }
    }
  }
`;

/**
 * __useLoginModeMatch_AggregatedQuery__
 *
 * To run a query within a React component, call `useLoginModeMatch_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginModeMatch_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginModeMatch_AggregatedQuery({
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
export function useLoginModeMatch_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginModeMatch_AggregatedQuery, LoginModeMatch_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginModeMatch_AggregatedQuery, LoginModeMatch_AggregatedQueryVariables>(
    LoginModeMatch_AggregatedDocument,
    options,
  );
}
export function useLoginModeMatch_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginModeMatch_AggregatedQuery, LoginModeMatch_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginModeMatch_AggregatedQuery, LoginModeMatch_AggregatedQueryVariables>(
    LoginModeMatch_AggregatedDocument,
    options,
  );
}
export type LoginModeMatch_AggregatedQueryHookResult = ReturnType<typeof useLoginModeMatch_AggregatedQuery>;
export type LoginModeMatch_AggregatedLazyQueryHookResult = ReturnType<typeof useLoginModeMatch_AggregatedLazyQuery>;
export type LoginModeMatch_AggregatedQueryResult = Apollo.QueryResult<
  LoginModeMatch_AggregatedQuery,
  LoginModeMatch_AggregatedQueryVariables
>;
