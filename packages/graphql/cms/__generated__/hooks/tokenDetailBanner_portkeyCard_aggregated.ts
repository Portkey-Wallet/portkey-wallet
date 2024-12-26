import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TokenDetailBanner_PortkeyCard_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.TokenDetailBanner_PortkeyCard_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type TokenDetailBanner_PortkeyCard_AggregatedQuery = {
  __typename?: 'Query';
  tokenDetailBanner_portkeyCard_aggregated: Array<{
    __typename?: 'tokenDetailBanner_portkeyCard_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'tokenDetailBanner_portkeyCard_aggregated_count';
      id?: number | null;
      portkeyCard_id?: number | null;
      tokenDetailBanner_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'tokenDetailBanner_portkeyCard_aggregated_count';
      id?: number | null;
      portkeyCard_id?: number | null;
      tokenDetailBanner_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'tokenDetailBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      portkeyCard_id?: number | null;
      tokenDetailBanner_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'tokenDetailBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      portkeyCard_id?: number | null;
      tokenDetailBanner_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'tokenDetailBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      portkeyCard_id?: number | null;
      tokenDetailBanner_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'tokenDetailBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      portkeyCard_id?: number | null;
      tokenDetailBanner_id?: number | null;
    } | null;
    min?: {
      __typename?: 'tokenDetailBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      portkeyCard_id?: number | null;
      tokenDetailBanner_id?: number | null;
    } | null;
    max?: {
      __typename?: 'tokenDetailBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      portkeyCard_id?: number | null;
      tokenDetailBanner_id?: number | null;
    } | null;
  }>;
};

export const TokenDetailBanner_PortkeyCard_AggregatedDocument = gql`
  query tokenDetailBanner_portkeyCard_aggregated(
    $groupBy: [String]
    $filter: tokenDetailBanner_portkeyCard_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    tokenDetailBanner_portkeyCard_aggregated(
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
        portkeyCard_id
        tokenDetailBanner_id
      }
      countDistinct {
        id
        portkeyCard_id
        tokenDetailBanner_id
      }
      avg {
        id
        portkeyCard_id
        tokenDetailBanner_id
      }
      sum {
        id
        portkeyCard_id
        tokenDetailBanner_id
      }
      avgDistinct {
        id
        portkeyCard_id
        tokenDetailBanner_id
      }
      sumDistinct {
        id
        portkeyCard_id
        tokenDetailBanner_id
      }
      min {
        id
        portkeyCard_id
        tokenDetailBanner_id
      }
      max {
        id
        portkeyCard_id
        tokenDetailBanner_id
      }
    }
  }
`;

/**
 * __useTokenDetailBanner_PortkeyCard_AggregatedQuery__
 *
 * To run a query within a React component, call `useTokenDetailBanner_PortkeyCard_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenDetailBanner_PortkeyCard_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenDetailBanner_PortkeyCard_AggregatedQuery({
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
export function useTokenDetailBanner_PortkeyCard_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    TokenDetailBanner_PortkeyCard_AggregatedQuery,
    TokenDetailBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    TokenDetailBanner_PortkeyCard_AggregatedQuery,
    TokenDetailBanner_PortkeyCard_AggregatedQueryVariables
  >(TokenDetailBanner_PortkeyCard_AggregatedDocument, options);
}
export function useTokenDetailBanner_PortkeyCard_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TokenDetailBanner_PortkeyCard_AggregatedQuery,
    TokenDetailBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TokenDetailBanner_PortkeyCard_AggregatedQuery,
    TokenDetailBanner_PortkeyCard_AggregatedQueryVariables
  >(TokenDetailBanner_PortkeyCard_AggregatedDocument, options);
}
export type TokenDetailBanner_PortkeyCard_AggregatedQueryHookResult = ReturnType<
  typeof useTokenDetailBanner_PortkeyCard_AggregatedQuery
>;
export type TokenDetailBanner_PortkeyCard_AggregatedLazyQueryHookResult = ReturnType<
  typeof useTokenDetailBanner_PortkeyCard_AggregatedLazyQuery
>;
export type TokenDetailBanner_PortkeyCard_AggregatedQueryResult = Apollo.QueryResult<
  TokenDetailBanner_PortkeyCard_AggregatedQuery,
  TokenDetailBanner_PortkeyCard_AggregatedQueryVariables
>;
