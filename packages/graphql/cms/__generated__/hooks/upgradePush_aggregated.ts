import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpgradePush_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.UpgradePush_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type UpgradePush_AggregatedQuery = {
  __typename?: 'Query';
  upgradePush_aggregated: Array<{
    __typename?: 'upgradePush_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'upgradePush_aggregated_count';
      appId?: number | null;
      content?: number | null;
      date_created?: number | null;
      date_updated?: number | null;
      downloadUrl?: number | null;
      id?: number | null;
      isApproved?: number | null;
      isForceUpdate?: number | null;
      operatingSystemVersions?: number | null;
      sort?: number | null;
      status?: number | null;
      styleType?: number | null;
      targetVersion?: number | null;
      title?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      appVersions?: number | null;
      countries?: number | null;
      deviceBrands?: number | null;
      deviceTypes?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'upgradePush_aggregated_count';
      appId?: number | null;
      content?: number | null;
      date_created?: number | null;
      date_updated?: number | null;
      downloadUrl?: number | null;
      id?: number | null;
      isApproved?: number | null;
      isForceUpdate?: number | null;
      operatingSystemVersions?: number | null;
      sort?: number | null;
      status?: number | null;
      styleType?: number | null;
      targetVersion?: number | null;
      title?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      appVersions?: number | null;
      countries?: number | null;
      deviceBrands?: number | null;
      deviceTypes?: number | null;
    } | null;
    avg?: {
      __typename?: 'upgradePush_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      styleType?: number | null;
      targetVersion?: number | null;
    } | null;
    sum?: {
      __typename?: 'upgradePush_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      styleType?: number | null;
      targetVersion?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'upgradePush_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      styleType?: number | null;
      targetVersion?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'upgradePush_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      styleType?: number | null;
      targetVersion?: number | null;
    } | null;
    min?: {
      __typename?: 'upgradePush_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      styleType?: number | null;
      targetVersion?: number | null;
    } | null;
    max?: {
      __typename?: 'upgradePush_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      styleType?: number | null;
      targetVersion?: number | null;
    } | null;
  }>;
};

export const UpgradePush_AggregatedDocument = gql`
  query upgradePush_aggregated(
    $groupBy: [String]
    $filter: upgradePush_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    upgradePush_aggregated(
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
        appId
        content
        date_created
        date_updated
        downloadUrl
        id
        isApproved
        isForceUpdate
        operatingSystemVersions
        sort
        status
        styleType
        targetVersion
        title
        user_created
        user_updated
        appVersions
        countries
        deviceBrands
        deviceTypes
      }
      countDistinct {
        appId
        content
        date_created
        date_updated
        downloadUrl
        id
        isApproved
        isForceUpdate
        operatingSystemVersions
        sort
        status
        styleType
        targetVersion
        title
        user_created
        user_updated
        appVersions
        countries
        deviceBrands
        deviceTypes
      }
      avg {
        id
        sort
        styleType
        targetVersion
      }
      sum {
        id
        sort
        styleType
        targetVersion
      }
      avgDistinct {
        id
        sort
        styleType
        targetVersion
      }
      sumDistinct {
        id
        sort
        styleType
        targetVersion
      }
      min {
        id
        sort
        styleType
        targetVersion
      }
      max {
        id
        sort
        styleType
        targetVersion
      }
    }
  }
`;

/**
 * __useUpgradePush_AggregatedQuery__
 *
 * To run a query within a React component, call `useUpgradePush_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradePush_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradePush_AggregatedQuery({
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
export function useUpgradePush_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<UpgradePush_AggregatedQuery, UpgradePush_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UpgradePush_AggregatedQuery, UpgradePush_AggregatedQueryVariables>(
    UpgradePush_AggregatedDocument,
    options,
  );
}
export function useUpgradePush_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UpgradePush_AggregatedQuery, UpgradePush_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UpgradePush_AggregatedQuery, UpgradePush_AggregatedQueryVariables>(
    UpgradePush_AggregatedDocument,
    options,
  );
}
export type UpgradePush_AggregatedQueryHookResult = ReturnType<typeof useUpgradePush_AggregatedQuery>;
export type UpgradePush_AggregatedLazyQueryHookResult = ReturnType<typeof useUpgradePush_AggregatedLazyQuery>;
export type UpgradePush_AggregatedQueryResult = Apollo.QueryResult<
  UpgradePush_AggregatedQuery,
  UpgradePush_AggregatedQueryVariables
>;
