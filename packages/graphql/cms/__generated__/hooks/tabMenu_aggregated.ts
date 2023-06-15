import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TabMenu_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.TabMenu_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type TabMenu_AggregatedQuery = {
  __typename?: 'Query';
  tabMenu_aggregated: Array<{
    __typename?: 'tabMenu_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'tabMenu_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      type?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'tabMenu_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      type?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    avg?: {
      __typename?: 'tabMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sum?: {
      __typename?: 'tabMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'tabMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'tabMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    min?: {
      __typename?: 'tabMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    max?: {
      __typename?: 'tabMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
  }>;
};

export const TabMenu_AggregatedDocument = gql`
  query tabMenu_aggregated(
    $groupBy: [String]
    $filter: tabMenu_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    tabMenu_aggregated(
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
        index
        sort
        status
        title
        type
        user_created
        user_updated
      }
      countDistinct {
        date_created
        date_updated
        id
        index
        sort
        status
        title
        type
        user_created
        user_updated
      }
      avg {
        id
        index
        sort
        type
      }
      sum {
        id
        index
        sort
        type
      }
      avgDistinct {
        id
        index
        sort
        type
      }
      sumDistinct {
        id
        index
        sort
        type
      }
      min {
        id
        index
        sort
        type
      }
      max {
        id
        index
        sort
        type
      }
    }
  }
`;

/**
 * __useTabMenu_AggregatedQuery__
 *
 * To run a query within a React component, call `useTabMenu_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useTabMenu_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTabMenu_AggregatedQuery({
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
export function useTabMenu_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<TabMenu_AggregatedQuery, TabMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TabMenu_AggregatedQuery, TabMenu_AggregatedQueryVariables>(
    TabMenu_AggregatedDocument,
    options,
  );
}
export function useTabMenu_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TabMenu_AggregatedQuery, TabMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TabMenu_AggregatedQuery, TabMenu_AggregatedQueryVariables>(
    TabMenu_AggregatedDocument,
    options,
  );
}
export type TabMenu_AggregatedQueryHookResult = ReturnType<typeof useTabMenu_AggregatedQuery>;
export type TabMenu_AggregatedLazyQueryHookResult = ReturnType<typeof useTabMenu_AggregatedLazyQuery>;
export type TabMenu_AggregatedQueryResult = Apollo.QueryResult<
  TabMenu_AggregatedQuery,
  TabMenu_AggregatedQueryVariables
>;
