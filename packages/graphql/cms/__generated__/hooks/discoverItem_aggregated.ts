import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverItem_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DiscoverItem_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DiscoverItem_AggregatedQuery = {
  __typename?: 'Query';
  discoverItem_aggregated: Array<{
    __typename?: 'discoverItem_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'discoverItem_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      description?: number | null;
      group?: number | null;
      id?: number | null;
      imgUrl?: number | null;
      index?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      url?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      appLink?: number | null;
      extensionLink?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'discoverItem_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      description?: number | null;
      group?: number | null;
      id?: number | null;
      imgUrl?: number | null;
      index?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      url?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      appLink?: number | null;
      extensionLink?: number | null;
    } | null;
    avg?: {
      __typename?: 'discoverItem_aggregated_fields';
      group?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sum?: {
      __typename?: 'discoverItem_aggregated_fields';
      group?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'discoverItem_aggregated_fields';
      group?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'discoverItem_aggregated_fields';
      group?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    min?: {
      __typename?: 'discoverItem_aggregated_fields';
      group?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    max?: {
      __typename?: 'discoverItem_aggregated_fields';
      group?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
  }>;
};

export const DiscoverItem_AggregatedDocument = gql`
  query discoverItem_aggregated(
    $groupBy: [String]
    $filter: discoverItem_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    discoverItem_aggregated(
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
        description
        group
        id
        imgUrl
        index
        sort
        status
        title
        url
        user_created
        user_updated
        appLink
        extensionLink
      }
      countDistinct {
        date_created
        date_updated
        description
        group
        id
        imgUrl
        index
        sort
        status
        title
        url
        user_created
        user_updated
        appLink
        extensionLink
      }
      avg {
        group
        id
        index
        sort
      }
      sum {
        group
        id
        index
        sort
      }
      avgDistinct {
        group
        id
        index
        sort
      }
      sumDistinct {
        group
        id
        index
        sort
      }
      min {
        group
        id
        index
        sort
      }
      max {
        group
        id
        index
        sort
      }
    }
  }
`;

/**
 * __useDiscoverItem_AggregatedQuery__
 *
 * To run a query within a React component, call `useDiscoverItem_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverItem_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverItem_AggregatedQuery({
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
export function useDiscoverItem_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverItem_AggregatedQuery, DiscoverItem_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverItem_AggregatedQuery, DiscoverItem_AggregatedQueryVariables>(
    DiscoverItem_AggregatedDocument,
    options,
  );
}
export function useDiscoverItem_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverItem_AggregatedQuery, DiscoverItem_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverItem_AggregatedQuery, DiscoverItem_AggregatedQueryVariables>(
    DiscoverItem_AggregatedDocument,
    options,
  );
}
export type DiscoverItem_AggregatedQueryHookResult = ReturnType<typeof useDiscoverItem_AggregatedQuery>;
export type DiscoverItem_AggregatedLazyQueryHookResult = ReturnType<typeof useDiscoverItem_AggregatedLazyQuery>;
export type DiscoverItem_AggregatedQueryResult = Apollo.QueryResult<
  DiscoverItem_AggregatedQuery,
  DiscoverItem_AggregatedQueryVariables
>;
