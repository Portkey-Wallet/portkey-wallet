import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverGroup_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DiscoverGroup_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DiscoverGroup_AggregatedQuery = {
  __typename?: 'Query';
  discoverGroup_aggregated: Array<{
    __typename?: 'discoverGroup_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'discoverGroup_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      items?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'discoverGroup_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      items?: number | null;
    } | null;
    avg?: {
      __typename?: 'discoverGroup_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sum?: {
      __typename?: 'discoverGroup_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'discoverGroup_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'discoverGroup_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    min?: {
      __typename?: 'discoverGroup_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    max?: {
      __typename?: 'discoverGroup_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
  }>;
};

export const DiscoverGroup_AggregatedDocument = gql`
  query discoverGroup_aggregated(
    $groupBy: [String]
    $filter: discoverGroup_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    discoverGroup_aggregated(
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
        date_created
        date_updated
        id
        index
        sort
        status
        title
        user_created
        user_updated
        items
      }
      countDistinct {
        date_created
        date_updated
        id
        index
        sort
        status
        title
        user_created
        user_updated
        items
      }
      avg {
        id
        index
        sort
      }
      sum {
        id
        index
        sort
      }
      avgDistinct {
        id
        index
        sort
      }
      sumDistinct {
        id
        index
        sort
      }
      min {
        id
        index
        sort
      }
      max {
        id
        index
        sort
      }
    }
  }
`;

/**
 * __useDiscoverGroup_AggregatedQuery__
 *
 * To run a query within a React component, call `useDiscoverGroup_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverGroup_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverGroup_AggregatedQuery({
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
export function useDiscoverGroup_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverGroup_AggregatedQuery, DiscoverGroup_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverGroup_AggregatedQuery, DiscoverGroup_AggregatedQueryVariables>(
    DiscoverGroup_AggregatedDocument,
    options,
  );
}
export function useDiscoverGroup_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverGroup_AggregatedQuery, DiscoverGroup_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverGroup_AggregatedQuery, DiscoverGroup_AggregatedQueryVariables>(
    DiscoverGroup_AggregatedDocument,
    options,
  );
}
export type DiscoverGroup_AggregatedQueryHookResult = ReturnType<typeof useDiscoverGroup_AggregatedQuery>;
export type DiscoverGroup_AggregatedLazyQueryHookResult = ReturnType<typeof useDiscoverGroup_AggregatedLazyQuery>;
export type DiscoverGroup_AggregatedQueryResult = Apollo.QueryResult<
  DiscoverGroup_AggregatedQuery,
  DiscoverGroup_AggregatedQueryVariables
>;
