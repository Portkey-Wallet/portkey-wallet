import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpgradePush_AppVersion_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.UpgradePush_AppVersion_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type UpgradePush_AppVersion_AggregatedQuery = {
  __typename?: 'Query';
  upgradePush_appVersion_aggregated: Array<{
    __typename?: 'upgradePush_appVersion_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'upgradePush_appVersion_aggregated_count';
      appVersion_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'upgradePush_appVersion_aggregated_count';
      appVersion_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'upgradePush_appVersion_aggregated_fields';
      appVersion_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'upgradePush_appVersion_aggregated_fields';
      appVersion_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'upgradePush_appVersion_aggregated_fields';
      appVersion_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'upgradePush_appVersion_aggregated_fields';
      appVersion_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    min?: {
      __typename?: 'upgradePush_appVersion_aggregated_fields';
      appVersion_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
    max?: {
      __typename?: 'upgradePush_appVersion_aggregated_fields';
      appVersion_id?: number | null;
      id?: number | null;
      upgradePush_id?: number | null;
    } | null;
  }>;
};

export const UpgradePush_AppVersion_AggregatedDocument = gql`
  query upgradePush_appVersion_aggregated(
    $groupBy: [String]
    $filter: upgradePush_appVersion_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    upgradePush_appVersion_aggregated(
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
        appVersion_id
        id
        upgradePush_id
      }
      countDistinct {
        appVersion_id
        id
        upgradePush_id
      }
      avg {
        appVersion_id
        id
        upgradePush_id
      }
      sum {
        appVersion_id
        id
        upgradePush_id
      }
      avgDistinct {
        appVersion_id
        id
        upgradePush_id
      }
      sumDistinct {
        appVersion_id
        id
        upgradePush_id
      }
      min {
        appVersion_id
        id
        upgradePush_id
      }
      max {
        appVersion_id
        id
        upgradePush_id
      }
    }
  }
`;

/**
 * __useUpgradePush_AppVersion_AggregatedQuery__
 *
 * To run a query within a React component, call `useUpgradePush_AppVersion_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradePush_AppVersion_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradePush_AppVersion_AggregatedQuery({
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
export function useUpgradePush_AppVersion_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UpgradePush_AppVersion_AggregatedQuery,
    UpgradePush_AppVersion_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UpgradePush_AppVersion_AggregatedQuery, UpgradePush_AppVersion_AggregatedQueryVariables>(
    UpgradePush_AppVersion_AggregatedDocument,
    options,
  );
}
export function useUpgradePush_AppVersion_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UpgradePush_AppVersion_AggregatedQuery,
    UpgradePush_AppVersion_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UpgradePush_AppVersion_AggregatedQuery, UpgradePush_AppVersion_AggregatedQueryVariables>(
    UpgradePush_AppVersion_AggregatedDocument,
    options,
  );
}
export type UpgradePush_AppVersion_AggregatedQueryHookResult = ReturnType<
  typeof useUpgradePush_AppVersion_AggregatedQuery
>;
export type UpgradePush_AppVersion_AggregatedLazyQueryHookResult = ReturnType<
  typeof useUpgradePush_AppVersion_AggregatedLazyQuery
>;
export type UpgradePush_AppVersion_AggregatedQueryResult = Apollo.QueryResult<
  UpgradePush_AppVersion_AggregatedQuery,
  UpgradePush_AppVersion_AggregatedQueryVariables
>;
