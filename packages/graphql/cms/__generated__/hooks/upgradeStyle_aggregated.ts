import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpgradeStyle_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.UpgradeStyle_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type UpgradeStyle_AggregatedQuery = {
  __typename?: 'Query';
  upgradeStyle_aggregated: Array<{
    __typename?: 'upgradeStyle_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'upgradeStyle_aggregated_count';
      attribute?: number | null;
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      sort?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'upgradeStyle_aggregated_count';
      attribute?: number | null;
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      sort?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    avg?: {
      __typename?: 'upgradeStyle_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    sum?: {
      __typename?: 'upgradeStyle_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'upgradeStyle_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'upgradeStyle_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    min?: {
      __typename?: 'upgradeStyle_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    max?: {
      __typename?: 'upgradeStyle_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
  }>;
};

export const UpgradeStyle_AggregatedDocument = gql`
  query upgradeStyle_aggregated(
    $groupBy: [String]
    $filter: upgradeStyle_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    upgradeStyle_aggregated(
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
        attribute
        date_created
        date_updated
        id
        sort
        status
        user_created
        user_updated
        value
      }
      countDistinct {
        attribute
        date_created
        date_updated
        id
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
 * __useUpgradeStyle_AggregatedQuery__
 *
 * To run a query within a React component, call `useUpgradeStyle_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradeStyle_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradeStyle_AggregatedQuery({
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
export function useUpgradeStyle_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<UpgradeStyle_AggregatedQuery, UpgradeStyle_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UpgradeStyle_AggregatedQuery, UpgradeStyle_AggregatedQueryVariables>(
    UpgradeStyle_AggregatedDocument,
    options,
  );
}
export function useUpgradeStyle_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UpgradeStyle_AggregatedQuery, UpgradeStyle_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UpgradeStyle_AggregatedQuery, UpgradeStyle_AggregatedQueryVariables>(
    UpgradeStyle_AggregatedDocument,
    options,
  );
}
export type UpgradeStyle_AggregatedQueryHookResult = ReturnType<typeof useUpgradeStyle_AggregatedQuery>;
export type UpgradeStyle_AggregatedLazyQueryHookResult = ReturnType<typeof useUpgradeStyle_AggregatedLazyQuery>;
export type UpgradeStyle_AggregatedQueryResult = Apollo.QueryResult<
  UpgradeStyle_AggregatedQuery,
  UpgradeStyle_AggregatedQueryVariables
>;
