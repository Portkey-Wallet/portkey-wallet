import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeviceBrand_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DeviceBrand_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DeviceBrand_AggregatedQuery = {
  __typename?: 'Query';
  deviceBrand_aggregated: Array<{
    __typename?: 'deviceBrand_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'deviceBrand_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      label?: number | null;
      sort?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'deviceBrand_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      label?: number | null;
      sort?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    avg?: { __typename?: 'deviceBrand_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sum?: { __typename?: 'deviceBrand_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    avgDistinct?: { __typename?: 'deviceBrand_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sumDistinct?: { __typename?: 'deviceBrand_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    min?: { __typename?: 'deviceBrand_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    max?: { __typename?: 'deviceBrand_aggregated_fields'; id?: number | null; sort?: number | null } | null;
  }>;
};

export const DeviceBrand_AggregatedDocument = gql`
  query deviceBrand_aggregated(
    $groupBy: [String]
    $filter: deviceBrand_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    deviceBrand_aggregated(
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
        label
        sort
        status
        user_created
        user_updated
        value
      }
      countDistinct {
        date_created
        date_updated
        id
        label
        sort
        status
        user_created
        user_updated
        value
      }
      avg {
        id
        sort
      }
      sum {
        id
        sort
      }
      avgDistinct {
        id
        sort
      }
      sumDistinct {
        id
        sort
      }
      min {
        id
        sort
      }
      max {
        id
        sort
      }
    }
  }
`;

/**
 * __useDeviceBrand_AggregatedQuery__
 *
 * To run a query within a React component, call `useDeviceBrand_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeviceBrand_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeviceBrand_AggregatedQuery({
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
export function useDeviceBrand_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<DeviceBrand_AggregatedQuery, DeviceBrand_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DeviceBrand_AggregatedQuery, DeviceBrand_AggregatedQueryVariables>(
    DeviceBrand_AggregatedDocument,
    options,
  );
}
export function useDeviceBrand_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DeviceBrand_AggregatedQuery, DeviceBrand_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DeviceBrand_AggregatedQuery, DeviceBrand_AggregatedQueryVariables>(
    DeviceBrand_AggregatedDocument,
    options,
  );
}
export type DeviceBrand_AggregatedQueryHookResult = ReturnType<typeof useDeviceBrand_AggregatedQuery>;
export type DeviceBrand_AggregatedLazyQueryHookResult = ReturnType<typeof useDeviceBrand_AggregatedLazyQuery>;
export type DeviceBrand_AggregatedQueryResult = Apollo.QueryResult<
  DeviceBrand_AggregatedQuery,
  DeviceBrand_AggregatedQueryVariables
>;
