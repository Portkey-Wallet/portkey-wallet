import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TopMenu_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.TopMenu_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type TopMenu_AggregatedQuery = {
  __typename?: 'Query';
  topMenu_aggregated: Array<{
    __typename?: 'topMenu_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'topMenu_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      path?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      type?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      children?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'topMenu_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      path?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      type?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      children?: number | null;
    } | null;
    avg?: {
      __typename?: 'topMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sum?: {
      __typename?: 'topMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'topMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'topMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    min?: {
      __typename?: 'topMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    max?: {
      __typename?: 'topMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
  }>;
};

export const TopMenu_AggregatedDocument = gql`
  query topMenu_aggregated(
    $groupBy: [String]
    $filter: topMenu_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    topMenu_aggregated(
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
        path
        sort
        status
        title
        type
        user_created
        user_updated
        children
      }
      countDistinct {
        date_created
        date_updated
        id
        index
        path
        sort
        status
        title
        type
        user_created
        user_updated
        children
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
 * __useTopMenu_AggregatedQuery__
 *
 * To run a query within a React component, call `useTopMenu_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopMenu_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopMenu_AggregatedQuery({
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
export function useTopMenu_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<TopMenu_AggregatedQuery, TopMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TopMenu_AggregatedQuery, TopMenu_AggregatedQueryVariables>(
    TopMenu_AggregatedDocument,
    options,
  );
}
export function useTopMenu_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TopMenu_AggregatedQuery, TopMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TopMenu_AggregatedQuery, TopMenu_AggregatedQueryVariables>(
    TopMenu_AggregatedDocument,
    options,
  );
}
export type TopMenu_AggregatedQueryHookResult = ReturnType<typeof useTopMenu_AggregatedQuery>;
export type TopMenu_AggregatedLazyQueryHookResult = ReturnType<typeof useTopMenu_AggregatedLazyQuery>;
export type TopMenu_AggregatedQueryResult = Apollo.QueryResult<
  TopMenu_AggregatedQuery,
  TopMenu_AggregatedQueryVariables
>;
