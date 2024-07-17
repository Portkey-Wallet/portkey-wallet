import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpgradePush_DeviceType_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.UpgradePush_DeviceType_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type UpgradePush_DeviceType_AggregatedQuery = {
  __typename?: 'Query';
  upgradePush_deviceType_aggregated: Array<{
    __typename?: 'upgradePush_deviceType_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'upgradePush_deviceType_aggregated_count';
      deviceType_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'upgradePush_deviceType_aggregated_count';
      deviceType_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'upgradePush_deviceType_aggregated_fields';
      deviceType_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'upgradePush_deviceType_aggregated_fields';
      deviceType_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'upgradePush_deviceType_aggregated_fields';
      deviceType_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'upgradePush_deviceType_aggregated_fields';
      deviceType_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    min?: {
      __typename?: 'upgradePush_deviceType_aggregated_fields';
      deviceType_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    max?: {
      __typename?: 'upgradePush_deviceType_aggregated_fields';
      deviceType_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
  }>;
};

export const UpgradePush_DeviceType_AggregatedDocument = gql`
  query upgradePush_deviceType_aggregated(
    $groupBy: [String]
    $filter: upgradePush_deviceType_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    upgradePush_deviceType_aggregated(
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
        deviceType_id
        id
        upgradePush_id
      }
      countDistinct {
        deviceType_id
        id
        upgradePush_id
      }
      avg {
        deviceType_id
        id
        upgradePush_id
      }
      sum {
        deviceType_id
        id
        upgradePush_id
      }
      avgDistinct {
        deviceType_id
        id
        upgradePush_id
      }
      sumDistinct {
        deviceType_id
        id
        upgradePush_id
      }
      min {
        deviceType_id
        id
        upgradePush_id
      }
      max {
        deviceType_id
        id
        upgradePush_id
      }
    }
  }
`;

/**
 * __useUpgradePush_DeviceType_AggregatedQuery__
 *
 * To run a query within a React component, call `useUpgradePush_DeviceType_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradePush_DeviceType_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradePush_DeviceType_AggregatedQuery({
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
export function useUpgradePush_DeviceType_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UpgradePush_DeviceType_AggregatedQuery,
    UpgradePush_DeviceType_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UpgradePush_DeviceType_AggregatedQuery, UpgradePush_DeviceType_AggregatedQueryVariables>(
    UpgradePush_DeviceType_AggregatedDocument,
    options,
  );
}
export function useUpgradePush_DeviceType_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UpgradePush_DeviceType_AggregatedQuery,
    UpgradePush_DeviceType_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UpgradePush_DeviceType_AggregatedQuery, UpgradePush_DeviceType_AggregatedQueryVariables>(
    UpgradePush_DeviceType_AggregatedDocument,
    options,
  );
}
export type UpgradePush_DeviceType_AggregatedQueryHookResult = ReturnType<
  typeof useUpgradePush_DeviceType_AggregatedQuery
>;
export type UpgradePush_DeviceType_AggregatedLazyQueryHookResult = ReturnType<
  typeof useUpgradePush_DeviceType_AggregatedLazyQuery
>;
export type UpgradePush_DeviceType_AggregatedQueryResult = Apollo.QueryResult<
  UpgradePush_DeviceType_AggregatedQuery,
  UpgradePush_DeviceType_AggregatedQueryVariables
>;
