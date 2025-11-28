import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TokenDetailBanner_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.TokenDetailBanner_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type TokenDetailBanner_AggregatedQuery = {
  __typename?: 'Query';
  tokenDetailBanner_aggregated: Array<{
    __typename?: 'tokenDetailBanner_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'tokenDetailBanner_aggregated_count';
      chainId?: number | null;
      id?: number | null;
      status?: number | null;
      symbol?: number | null;
      items?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'tokenDetailBanner_aggregated_count';
      chainId?: number | null;
      id?: number | null;
      status?: number | null;
      symbol?: number | null;
      items?: number | null;
    } | null;
    avg?: { __typename?: 'tokenDetailBanner_aggregated_fields'; id?: number | null } | null;
    sum?: { __typename?: 'tokenDetailBanner_aggregated_fields'; id?: number | null } | null;
    avgDistinct?: { __typename?: 'tokenDetailBanner_aggregated_fields'; id?: number | null } | null;
    sumDistinct?: { __typename?: 'tokenDetailBanner_aggregated_fields'; id?: number | null } | null;
    min?: { __typename?: 'tokenDetailBanner_aggregated_fields'; id?: number | null } | null;
    max?: { __typename?: 'tokenDetailBanner_aggregated_fields'; id?: number | null } | null;
  }>;
};

export const TokenDetailBanner_AggregatedDocument = gql`
  query tokenDetailBanner_aggregated(
    $groupBy: [String]
    $filter: tokenDetailBanner_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    tokenDetailBanner_aggregated(
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
        chainId
        id
        status
        symbol
        items
      }
      countDistinct {
        chainId
        id
        status
        symbol
        items
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
 * __useTokenDetailBanner_AggregatedQuery__
 *
 * To run a query within a React component, call `useTokenDetailBanner_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenDetailBanner_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenDetailBanner_AggregatedQuery({
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
export function useTokenDetailBanner_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<TokenDetailBanner_AggregatedQuery, TokenDetailBanner_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TokenDetailBanner_AggregatedQuery, TokenDetailBanner_AggregatedQueryVariables>(
    TokenDetailBanner_AggregatedDocument,
    options,
  );
}
export function useTokenDetailBanner_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TokenDetailBanner_AggregatedQuery,
    TokenDetailBanner_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TokenDetailBanner_AggregatedQuery, TokenDetailBanner_AggregatedQueryVariables>(
    TokenDetailBanner_AggregatedDocument,
    options,
  );
}
export type TokenDetailBanner_AggregatedQueryHookResult = ReturnType<typeof useTokenDetailBanner_AggregatedQuery>;
export type TokenDetailBanner_AggregatedLazyQueryHookResult = ReturnType<
  typeof useTokenDetailBanner_AggregatedLazyQuery
>;
export type TokenDetailBanner_AggregatedQueryResult = Apollo.QueryResult<
  TokenDetailBanner_AggregatedQuery,
  TokenDetailBanner_AggregatedQueryVariables
>;
