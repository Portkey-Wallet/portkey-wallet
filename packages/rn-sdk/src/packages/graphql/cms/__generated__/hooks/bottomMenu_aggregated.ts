import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BottomMenu_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.BottomMenu_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type BottomMenu_AggregatedQuery = {
  __typename?: 'Query';
  bottomMenu_aggregated: Array<{
    __typename?: 'bottomMenu_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'bottomMenu_aggregated_count';
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
      __typename?: 'bottomMenu_aggregated_count';
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
      __typename?: 'bottomMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sum?: {
      __typename?: 'bottomMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'bottomMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'bottomMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    min?: {
      __typename?: 'bottomMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    max?: {
      __typename?: 'bottomMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
  }>;
};

export const BottomMenu_AggregatedDocument = gql`
  query bottomMenu_aggregated(
    $groupBy: [String]
    $filter: bottomMenu_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    bottomMenu_aggregated(
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
 * __useBottomMenu_AggregatedQuery__
 *
 * To run a query within a React component, call `useBottomMenu_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useBottomMenu_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBottomMenu_AggregatedQuery({
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
export function useBottomMenu_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<BottomMenu_AggregatedQuery, BottomMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BottomMenu_AggregatedQuery, BottomMenu_AggregatedQueryVariables>(
    BottomMenu_AggregatedDocument,
    options,
  );
}
export function useBottomMenu_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<BottomMenu_AggregatedQuery, BottomMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BottomMenu_AggregatedQuery, BottomMenu_AggregatedQueryVariables>(
    BottomMenu_AggregatedDocument,
    options,
  );
}
export type BottomMenu_AggregatedQueryHookResult = ReturnType<typeof useBottomMenu_AggregatedQuery>;
export type BottomMenu_AggregatedLazyQueryHookResult = ReturnType<typeof useBottomMenu_AggregatedLazyQuery>;
export type BottomMenu_AggregatedQueryResult = Apollo.QueryResult<
  BottomMenu_AggregatedQuery,
  BottomMenu_AggregatedQueryVariables
>;
