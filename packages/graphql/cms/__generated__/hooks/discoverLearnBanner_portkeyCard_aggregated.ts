import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverLearnBanner_PortkeyCard_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DiscoverLearnBanner_PortkeyCard_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DiscoverLearnBanner_PortkeyCard_AggregatedQuery = {
  __typename?: 'Query';
  discoverLearnBanner_portkeyCard_aggregated: Array<{
    __typename?: 'discoverLearnBanner_portkeyCard_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'discoverLearnBanner_portkeyCard_aggregated_count';
      discoverLearnBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'discoverLearnBanner_portkeyCard_aggregated_count';
      discoverLearnBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'discoverLearnBanner_portkeyCard_aggregated_fields';
      discoverLearnBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'discoverLearnBanner_portkeyCard_aggregated_fields';
      discoverLearnBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'discoverLearnBanner_portkeyCard_aggregated_fields';
      discoverLearnBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'discoverLearnBanner_portkeyCard_aggregated_fields';
      discoverLearnBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    min?: {
      __typename?: 'discoverLearnBanner_portkeyCard_aggregated_fields';
      discoverLearnBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    max?: {
      __typename?: 'discoverLearnBanner_portkeyCard_aggregated_fields';
      discoverLearnBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
  }>;
};

export const DiscoverLearnBanner_PortkeyCard_AggregatedDocument = gql`
  query discoverLearnBanner_portkeyCard_aggregated(
    $groupBy: [String]
    $filter: discoverLearnBanner_portkeyCard_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    discoverLearnBanner_portkeyCard_aggregated(
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
        discoverLearnBanner_id
        id
        portkeyCard_id
      }
      countDistinct {
        discoverLearnBanner_id
        id
        portkeyCard_id
      }
      avg {
        discoverLearnBanner_id
        id
        portkeyCard_id
      }
      sum {
        discoverLearnBanner_id
        id
        portkeyCard_id
      }
      avgDistinct {
        discoverLearnBanner_id
        id
        portkeyCard_id
      }
      sumDistinct {
        discoverLearnBanner_id
        id
        portkeyCard_id
      }
      min {
        discoverLearnBanner_id
        id
        portkeyCard_id
      }
      max {
        discoverLearnBanner_id
        id
        portkeyCard_id
      }
    }
  }
`;

/**
 * __useDiscoverLearnBanner_PortkeyCard_AggregatedQuery__
 *
 * To run a query within a React component, call `useDiscoverLearnBanner_PortkeyCard_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverLearnBanner_PortkeyCard_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverLearnBanner_PortkeyCard_AggregatedQuery({
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
export function useDiscoverLearnBanner_PortkeyCard_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    DiscoverLearnBanner_PortkeyCard_AggregatedQuery,
    DiscoverLearnBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    DiscoverLearnBanner_PortkeyCard_AggregatedQuery,
    DiscoverLearnBanner_PortkeyCard_AggregatedQueryVariables
  >(DiscoverLearnBanner_PortkeyCard_AggregatedDocument, options);
}
export function useDiscoverLearnBanner_PortkeyCard_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverLearnBanner_PortkeyCard_AggregatedQuery,
    DiscoverLearnBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DiscoverLearnBanner_PortkeyCard_AggregatedQuery,
    DiscoverLearnBanner_PortkeyCard_AggregatedQueryVariables
  >(DiscoverLearnBanner_PortkeyCard_AggregatedDocument, options);
}
export type DiscoverLearnBanner_PortkeyCard_AggregatedQueryHookResult = ReturnType<
  typeof useDiscoverLearnBanner_PortkeyCard_AggregatedQuery
>;
export type DiscoverLearnBanner_PortkeyCard_AggregatedLazyQueryHookResult = ReturnType<
  typeof useDiscoverLearnBanner_PortkeyCard_AggregatedLazyQuery
>;
export type DiscoverLearnBanner_PortkeyCard_AggregatedQueryResult = Apollo.QueryResult<
  DiscoverLearnBanner_PortkeyCard_AggregatedQuery,
  DiscoverLearnBanner_PortkeyCard_AggregatedQueryVariables
>;
