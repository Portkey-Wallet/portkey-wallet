import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverTabData_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DiscoverTabData_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DiscoverTabData_AggregatedQuery = {
  __typename?: 'Query';
  discoverTabData_aggregated: Array<{
    __typename?: 'discoverTabData_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'discoverTabData_aggregated_count';
      id?: number | null;
      index?: number | null;
      name?: number | null;
      status?: number | null;
      value?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'discoverTabData_aggregated_count';
      id?: number | null;
      index?: number | null;
      name?: number | null;
      status?: number | null;
      value?: number | null;
    } | null;
    avg?: { __typename?: 'discoverTabData_aggregated_fields'; id?: number | null; index?: number | null } | null;
    sum?: { __typename?: 'discoverTabData_aggregated_fields'; id?: number | null; index?: number | null } | null;
    avgDistinct?: {
      __typename?: 'discoverTabData_aggregated_fields';
      id?: number | null;
      index?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'discoverTabData_aggregated_fields';
      id?: number | null;
      index?: number | null;
    } | null;
    min?: { __typename?: 'discoverTabData_aggregated_fields'; id?: number | null; index?: number | null } | null;
    max?: { __typename?: 'discoverTabData_aggregated_fields'; id?: number | null; index?: number | null } | null;
  }>;
};

export const DiscoverTabData_AggregatedDocument = gql`
  query discoverTabData_aggregated(
    $groupBy: [String]
    $filter: discoverTabData_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    discoverTabData_aggregated(
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
        name
        status
        value
      }
      countDistinct {
        id
        index
        name
        status
        value
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
 * __useDiscoverTabData_AggregatedQuery__
 *
 * To run a query within a React component, call `useDiscoverTabData_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverTabData_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverTabData_AggregatedQuery({
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
export function useDiscoverTabData_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverTabData_AggregatedQuery, DiscoverTabData_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverTabData_AggregatedQuery, DiscoverTabData_AggregatedQueryVariables>(
    DiscoverTabData_AggregatedDocument,
    options,
  );
}
export function useDiscoverTabData_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverTabData_AggregatedQuery, DiscoverTabData_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverTabData_AggregatedQuery, DiscoverTabData_AggregatedQueryVariables>(
    DiscoverTabData_AggregatedDocument,
    options,
  );
}
export type DiscoverTabData_AggregatedQueryHookResult = ReturnType<typeof useDiscoverTabData_AggregatedQuery>;
export type DiscoverTabData_AggregatedLazyQueryHookResult = ReturnType<typeof useDiscoverTabData_AggregatedLazyQuery>;
export type DiscoverTabData_AggregatedQueryResult = Apollo.QueryResult<
  DiscoverTabData_AggregatedQuery,
  DiscoverTabData_AggregatedQueryVariables
>;
