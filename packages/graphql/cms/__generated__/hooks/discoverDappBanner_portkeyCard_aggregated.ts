import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverDappBanner_PortkeyCard_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DiscoverDappBanner_PortkeyCard_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DiscoverDappBanner_PortkeyCard_AggregatedQuery = {
  __typename?: 'Query';
  discoverDappBanner_portkeyCard_aggregated: Array<{
    __typename?: 'discoverDappBanner_portkeyCard_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'discoverDappBanner_portkeyCard_aggregated_count';
      id?: number | null;
      discoverDappBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'discoverDappBanner_portkeyCard_aggregated_count';
      id?: number | null;
      discoverDappBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'discoverDappBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverDappBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'discoverDappBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverDappBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'discoverDappBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverDappBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'discoverDappBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverDappBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    min?: {
      __typename?: 'discoverDappBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverDappBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    max?: {
      __typename?: 'discoverDappBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverDappBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
  }>;
};

export const DiscoverDappBanner_PortkeyCard_AggregatedDocument = gql`
  query discoverDappBanner_portkeyCard_aggregated(
    $groupBy: [String]
    $filter: discoverDappBanner_portkeyCard_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    discoverDappBanner_portkeyCard_aggregated(
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
        discoverDappBanner_id
        portkeyCard_id
      }
      countDistinct {
        id
        discoverDappBanner_id
        portkeyCard_id
      }
      avg {
        id
        discoverDappBanner_id
        portkeyCard_id
      }
      sum {
        id
        discoverDappBanner_id
        portkeyCard_id
      }
      avgDistinct {
        id
        discoverDappBanner_id
        portkeyCard_id
      }
      sumDistinct {
        id
        discoverDappBanner_id
        portkeyCard_id
      }
      min {
        id
        discoverDappBanner_id
        portkeyCard_id
      }
      max {
        id
        discoverDappBanner_id
        portkeyCard_id
      }
    }
  }
`;

/**
 * __useDiscoverDappBanner_PortkeyCard_AggregatedQuery__
 *
 * To run a query within a React component, call `useDiscoverDappBanner_PortkeyCard_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverDappBanner_PortkeyCard_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverDappBanner_PortkeyCard_AggregatedQuery({
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
export function useDiscoverDappBanner_PortkeyCard_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    DiscoverDappBanner_PortkeyCard_AggregatedQuery,
    DiscoverDappBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    DiscoverDappBanner_PortkeyCard_AggregatedQuery,
    DiscoverDappBanner_PortkeyCard_AggregatedQueryVariables
  >(DiscoverDappBanner_PortkeyCard_AggregatedDocument, options);
}
export function useDiscoverDappBanner_PortkeyCard_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverDappBanner_PortkeyCard_AggregatedQuery,
    DiscoverDappBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DiscoverDappBanner_PortkeyCard_AggregatedQuery,
    DiscoverDappBanner_PortkeyCard_AggregatedQueryVariables
  >(DiscoverDappBanner_PortkeyCard_AggregatedDocument, options);
}
export type DiscoverDappBanner_PortkeyCard_AggregatedQueryHookResult = ReturnType<
  typeof useDiscoverDappBanner_PortkeyCard_AggregatedQuery
>;
export type DiscoverDappBanner_PortkeyCard_AggregatedLazyQueryHookResult = ReturnType<
  typeof useDiscoverDappBanner_PortkeyCard_AggregatedLazyQuery
>;
export type DiscoverDappBanner_PortkeyCard_AggregatedQueryResult = Apollo.QueryResult<
  DiscoverDappBanner_PortkeyCard_AggregatedQuery,
  DiscoverDappBanner_PortkeyCard_AggregatedQueryVariables
>;
