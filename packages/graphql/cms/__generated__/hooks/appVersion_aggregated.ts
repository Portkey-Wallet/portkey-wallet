import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AppVersion_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.AppVersion_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type AppVersion_AggregatedQuery = {
  __typename?: 'Query';
  appVersion_aggregated: Array<{
    __typename?: 'appVersion_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'appVersion_aggregated_count';
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
      __typename?: 'appVersion_aggregated_count';
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
    avg?: { __typename?: 'appVersion_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sum?: { __typename?: 'appVersion_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    avgDistinct?: { __typename?: 'appVersion_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sumDistinct?: { __typename?: 'appVersion_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    min?: { __typename?: 'appVersion_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    max?: { __typename?: 'appVersion_aggregated_fields'; id?: number | null; sort?: number | null } | null;
  }>;
};

export const AppVersion_AggregatedDocument = gql`
  query appVersion_aggregated(
    $groupBy: [String]
    $filter: appVersion_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    appVersion_aggregated(
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
 * __useAppVersion_AggregatedQuery__
 *
 * To run a query within a React component, call `useAppVersion_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppVersion_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppVersion_AggregatedQuery({
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
export function useAppVersion_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<AppVersion_AggregatedQuery, AppVersion_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppVersion_AggregatedQuery, AppVersion_AggregatedQueryVariables>(
    AppVersion_AggregatedDocument,
    options,
  );
}
export function useAppVersion_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AppVersion_AggregatedQuery, AppVersion_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppVersion_AggregatedQuery, AppVersion_AggregatedQueryVariables>(
    AppVersion_AggregatedDocument,
    options,
  );
}
export type AppVersion_AggregatedQueryHookResult = ReturnType<typeof useAppVersion_AggregatedQuery>;
export type AppVersion_AggregatedLazyQueryHookResult = ReturnType<typeof useAppVersion_AggregatedLazyQuery>;
export type AppVersion_AggregatedQueryResult = Apollo.QueryResult<
  AppVersion_AggregatedQuery,
  AppVersion_AggregatedQueryVariables
>;
