import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverLearnGroup_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DiscoverLearnGroup_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DiscoverLearnGroup_AggregatedQuery = {
  __typename?: 'Query';
  discoverLearnGroup_aggregated: Array<{
    __typename?: 'discoverLearnGroup_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'discoverLearnGroup_aggregated_count';
      id?: number | null;
      index?: number | null;
      status?: number | null;
      title?: number | null;
      value?: number | null;
      items?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'discoverLearnGroup_aggregated_count';
      id?: number | null;
      index?: number | null;
      status?: number | null;
      title?: number | null;
      value?: number | null;
      items?: number | null;
    } | null;
    avg?: { __typename?: 'discoverLearnGroup_aggregated_fields'; id?: number | null; index?: number | null } | null;
    sum?: { __typename?: 'discoverLearnGroup_aggregated_fields'; id?: number | null; index?: number | null } | null;
    avgDistinct?: {
      __typename?: 'discoverLearnGroup_aggregated_fields';
      id?: number | null;
      index?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'discoverLearnGroup_aggregated_fields';
      id?: number | null;
      index?: number | null;
    } | null;
    min?: { __typename?: 'discoverLearnGroup_aggregated_fields'; id?: number | null; index?: number | null } | null;
    max?: { __typename?: 'discoverLearnGroup_aggregated_fields'; id?: number | null; index?: number | null } | null;
  }>;
};

export const DiscoverLearnGroup_AggregatedDocument = gql`
  query discoverLearnGroup_aggregated(
    $groupBy: [String]
    $filter: discoverLearnGroup_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    discoverLearnGroup_aggregated(
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
        index
        status
        title
        value
        items
      }
      countDistinct {
        id
        index
        status
        title
        value
        items
      }
      avg {
        id
        index
      }
      sum {
        id
        index
      }
      avgDistinct {
        id
        index
      }
      sumDistinct {
        id
        index
      }
      min {
        id
        index
      }
      max {
        id
        index
      }
    }
  }
`;

/**
 * __useDiscoverLearnGroup_AggregatedQuery__
 *
 * To run a query within a React component, call `useDiscoverLearnGroup_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverLearnGroup_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverLearnGroup_AggregatedQuery({
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
export function useDiscoverLearnGroup_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    DiscoverLearnGroup_AggregatedQuery,
    DiscoverLearnGroup_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverLearnGroup_AggregatedQuery, DiscoverLearnGroup_AggregatedQueryVariables>(
    DiscoverLearnGroup_AggregatedDocument,
    options,
  );
}
export function useDiscoverLearnGroup_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverLearnGroup_AggregatedQuery,
    DiscoverLearnGroup_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverLearnGroup_AggregatedQuery, DiscoverLearnGroup_AggregatedQueryVariables>(
    DiscoverLearnGroup_AggregatedDocument,
    options,
  );
}
export type DiscoverLearnGroup_AggregatedQueryHookResult = ReturnType<typeof useDiscoverLearnGroup_AggregatedQuery>;
export type DiscoverLearnGroup_AggregatedLazyQueryHookResult = ReturnType<
  typeof useDiscoverLearnGroup_AggregatedLazyQuery
>;
export type DiscoverLearnGroup_AggregatedQueryResult = Apollo.QueryResult<
  DiscoverLearnGroup_AggregatedQuery,
  DiscoverLearnGroup_AggregatedQueryVariables
>;
