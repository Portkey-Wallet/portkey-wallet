import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverEarnData_PortkeyCard_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DiscoverEarnData_PortkeyCard_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DiscoverEarnData_PortkeyCard_AggregatedQuery = {
  __typename?: 'Query';
  discoverEarnData_portkeyCard_aggregated: Array<{
    __typename?: 'discoverEarnData_portkeyCard_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'discoverEarnData_portkeyCard_aggregated_count';
      discoverEarnData_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'discoverEarnData_portkeyCard_aggregated_count';
      discoverEarnData_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'discoverEarnData_portkeyCard_aggregated_fields';
      discoverEarnData_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'discoverEarnData_portkeyCard_aggregated_fields';
      discoverEarnData_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'discoverEarnData_portkeyCard_aggregated_fields';
      discoverEarnData_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'discoverEarnData_portkeyCard_aggregated_fields';
      discoverEarnData_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    min?: {
      __typename?: 'discoverEarnData_portkeyCard_aggregated_fields';
      discoverEarnData_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    max?: {
      __typename?: 'discoverEarnData_portkeyCard_aggregated_fields';
      discoverEarnData_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
  }>;
};

export const DiscoverEarnData_PortkeyCard_AggregatedDocument = gql`
  query discoverEarnData_portkeyCard_aggregated(
    $groupBy: [String]
    $filter: discoverEarnData_portkeyCard_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    discoverEarnData_portkeyCard_aggregated(
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
        discoverEarnData_id
        id
        portkeyCard_id
      }
      countDistinct {
        discoverEarnData_id
        id
        portkeyCard_id
      }
      avg {
        discoverEarnData_id
        id
        portkeyCard_id
      }
      sum {
        discoverEarnData_id
        id
        portkeyCard_id
      }
      avgDistinct {
        discoverEarnData_id
        id
        portkeyCard_id
      }
      sumDistinct {
        discoverEarnData_id
        id
        portkeyCard_id
      }
      min {
        discoverEarnData_id
        id
        portkeyCard_id
      }
      max {
        discoverEarnData_id
        id
        portkeyCard_id
      }
    }
  }
`;

/**
 * __useDiscoverEarnData_PortkeyCard_AggregatedQuery__
 *
 * To run a query within a React component, call `useDiscoverEarnData_PortkeyCard_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverEarnData_PortkeyCard_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverEarnData_PortkeyCard_AggregatedQuery({
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
export function useDiscoverEarnData_PortkeyCard_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    DiscoverEarnData_PortkeyCard_AggregatedQuery,
    DiscoverEarnData_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    DiscoverEarnData_PortkeyCard_AggregatedQuery,
    DiscoverEarnData_PortkeyCard_AggregatedQueryVariables
  >(DiscoverEarnData_PortkeyCard_AggregatedDocument, options);
}
export function useDiscoverEarnData_PortkeyCard_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverEarnData_PortkeyCard_AggregatedQuery,
    DiscoverEarnData_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DiscoverEarnData_PortkeyCard_AggregatedQuery,
    DiscoverEarnData_PortkeyCard_AggregatedQueryVariables
  >(DiscoverEarnData_PortkeyCard_AggregatedDocument, options);
}
export type DiscoverEarnData_PortkeyCard_AggregatedQueryHookResult = ReturnType<
  typeof useDiscoverEarnData_PortkeyCard_AggregatedQuery
>;
export type DiscoverEarnData_PortkeyCard_AggregatedLazyQueryHookResult = ReturnType<
  typeof useDiscoverEarnData_PortkeyCard_AggregatedLazyQuery
>;
export type DiscoverEarnData_PortkeyCard_AggregatedQueryResult = Apollo.QueryResult<
  DiscoverEarnData_PortkeyCard_AggregatedQuery,
  DiscoverEarnData_PortkeyCard_AggregatedQueryVariables
>;
