import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeviceType_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DeviceType_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DeviceType_AggregatedQuery = {
  __typename?: 'Query';
  deviceType_aggregated: Array<{
    __typename?: 'deviceType_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'deviceType_aggregated_count';
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
      __typename?: 'deviceType_aggregated_count';
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
    avg?: {
      __typename?: 'deviceType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    sum?: {
      __typename?: 'deviceType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'deviceType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'deviceType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    min?: {
      __typename?: 'deviceType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    max?: {
      __typename?: 'deviceType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
  }>;
};

export const DeviceType_AggregatedDocument = gql`
  query deviceType_aggregated(
    $groupBy: [String]
    $filter: deviceType_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    deviceType_aggregated(
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
        value
      }
      sum {
        id
        sort
        value
      }
      avgDistinct {
        id
        sort
        value
      }
      sumDistinct {
        id
        sort
        value
      }
      min {
        id
        sort
        value
      }
      max {
        id
        sort
        value
      }
    }
  }
`;

/**
 * __useDeviceType_AggregatedQuery__
 *
 * To run a query within a React component, call `useDeviceType_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeviceType_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeviceType_AggregatedQuery({
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
export function useDeviceType_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<DeviceType_AggregatedQuery, DeviceType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DeviceType_AggregatedQuery, DeviceType_AggregatedQueryVariables>(
    DeviceType_AggregatedDocument,
    options,
  );
}
export function useDeviceType_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DeviceType_AggregatedQuery, DeviceType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DeviceType_AggregatedQuery, DeviceType_AggregatedQueryVariables>(
    DeviceType_AggregatedDocument,
    options,
  );
}
export type DeviceType_AggregatedQueryHookResult = ReturnType<typeof useDeviceType_AggregatedQuery>;
export type DeviceType_AggregatedLazyQueryHookResult = ReturnType<typeof useDeviceType_AggregatedLazyQuery>;
export type DeviceType_AggregatedQueryResult = Apollo.QueryResult<
  DeviceType_AggregatedQuery,
  DeviceType_AggregatedQueryVariables
>;
