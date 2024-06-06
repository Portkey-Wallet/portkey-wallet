import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverLearnGroup_PortkeyCard_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DiscoverLearnGroup_PortkeyCard_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DiscoverLearnGroup_PortkeyCard_AggregatedQuery = {
  __typename?: 'Query';
  discoverLearnGroup_portkeyCard_aggregated: Array<{
    __typename?: 'discoverLearnGroup_portkeyCard_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'discoverLearnGroup_portkeyCard_aggregated_count';
      id?: number | null;
      discoverLearnGroup_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'discoverLearnGroup_portkeyCard_aggregated_count';
      id?: number | null;
      discoverLearnGroup_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'discoverLearnGroup_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverLearnGroup_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'discoverLearnGroup_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverLearnGroup_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'discoverLearnGroup_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverLearnGroup_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'discoverLearnGroup_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverLearnGroup_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    min?: {
      __typename?: 'discoverLearnGroup_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverLearnGroup_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    max?: {
      __typename?: 'discoverLearnGroup_portkeyCard_aggregated_fields';
      id?: number | null;
      discoverLearnGroup_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
  }>;
};

export const DiscoverLearnGroup_PortkeyCard_AggregatedDocument = gql`
  query discoverLearnGroup_portkeyCard_aggregated(
    $groupBy: [String]
    $filter: discoverLearnGroup_portkeyCard_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    discoverLearnGroup_portkeyCard_aggregated(
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
        discoverLearnGroup_id
        portkeyCard_id
      }
      countDistinct {
        id
        discoverLearnGroup_id
        portkeyCard_id
      }
      avg {
        id
        discoverLearnGroup_id
        portkeyCard_id
      }
      sum {
        id
        discoverLearnGroup_id
        portkeyCard_id
      }
      avgDistinct {
        id
        discoverLearnGroup_id
        portkeyCard_id
      }
      sumDistinct {
        id
        discoverLearnGroup_id
        portkeyCard_id
      }
      min {
        id
        discoverLearnGroup_id
        portkeyCard_id
      }
      max {
        id
        discoverLearnGroup_id
        portkeyCard_id
      }
    }
  }
`;

/**
 * __useDiscoverLearnGroup_PortkeyCard_AggregatedQuery__
 *
 * To run a query within a React component, call `useDiscoverLearnGroup_PortkeyCard_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverLearnGroup_PortkeyCard_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverLearnGroup_PortkeyCard_AggregatedQuery({
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
export function useDiscoverLearnGroup_PortkeyCard_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    DiscoverLearnGroup_PortkeyCard_AggregatedQuery,
    DiscoverLearnGroup_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    DiscoverLearnGroup_PortkeyCard_AggregatedQuery,
    DiscoverLearnGroup_PortkeyCard_AggregatedQueryVariables
  >(DiscoverLearnGroup_PortkeyCard_AggregatedDocument, options);
}
export function useDiscoverLearnGroup_PortkeyCard_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverLearnGroup_PortkeyCard_AggregatedQuery,
    DiscoverLearnGroup_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DiscoverLearnGroup_PortkeyCard_AggregatedQuery,
    DiscoverLearnGroup_PortkeyCard_AggregatedQueryVariables
  >(DiscoverLearnGroup_PortkeyCard_AggregatedDocument, options);
}
export type DiscoverLearnGroup_PortkeyCard_AggregatedQueryHookResult = ReturnType<
  typeof useDiscoverLearnGroup_PortkeyCard_AggregatedQuery
>;
export type DiscoverLearnGroup_PortkeyCard_AggregatedLazyQueryHookResult = ReturnType<
  typeof useDiscoverLearnGroup_PortkeyCard_AggregatedLazyQuery
>;
export type DiscoverLearnGroup_PortkeyCard_AggregatedQueryResult = Apollo.QueryResult<
  DiscoverLearnGroup_PortkeyCard_AggregatedQuery,
  DiscoverLearnGroup_PortkeyCard_AggregatedQueryVariables
>;
