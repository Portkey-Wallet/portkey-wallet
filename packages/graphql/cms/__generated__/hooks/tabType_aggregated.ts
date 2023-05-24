import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TabType_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.TabType_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type TabType_AggregatedQuery = {
  __typename?: 'Query';
  tabType_aggregated: Array<{
    __typename?: 'tabType_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'tabType_aggregated_count';
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
      __typename?: 'tabType_aggregated_count';
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
    avg?: { __typename?: 'tabType_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sum?: { __typename?: 'tabType_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    avgDistinct?: { __typename?: 'tabType_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sumDistinct?: { __typename?: 'tabType_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    min?: { __typename?: 'tabType_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    max?: { __typename?: 'tabType_aggregated_fields'; id?: number | null; sort?: number | null } | null;
  }>;
};

export const TabType_AggregatedDocument = gql`
  query tabType_aggregated(
    $groupBy: [String]
    $filter: tabType_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    tabType_aggregated(
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
 * __useTabType_AggregatedQuery__
 *
 * To run a query within a React component, call `useTabType_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useTabType_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTabType_AggregatedQuery({
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
export function useTabType_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<TabType_AggregatedQuery, TabType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TabType_AggregatedQuery, TabType_AggregatedQueryVariables>(
    TabType_AggregatedDocument,
    options,
  );
}
export function useTabType_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TabType_AggregatedQuery, TabType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TabType_AggregatedQuery, TabType_AggregatedQueryVariables>(
    TabType_AggregatedDocument,
    options,
  );
}
export type TabType_AggregatedQueryHookResult = ReturnType<typeof useTabType_AggregatedQuery>;
export type TabType_AggregatedLazyQueryHookResult = ReturnType<typeof useTabType_AggregatedLazyQuery>;
export type TabType_AggregatedQueryResult = Apollo.QueryResult<
  TabType_AggregatedQuery,
  TabType_AggregatedQueryVariables
>;
