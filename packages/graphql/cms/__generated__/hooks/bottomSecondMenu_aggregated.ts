import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BottomSecondMenu_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.BottomSecondMenu_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type BottomSecondMenu_AggregatedQuery = {
  __typename?: 'Query';
  bottomSecondMenu_aggregated: Array<{
    __typename?: 'bottomSecondMenu_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'bottomSecondMenu_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      path?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      type?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'bottomSecondMenu_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      path?: number | null;
      sort?: number | null;
      status?: number | null;
      title?: number | null;
      type?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    avg?: {
      __typename?: 'bottomSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sum?: {
      __typename?: 'bottomSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'bottomSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'bottomSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    min?: {
      __typename?: 'bottomSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    max?: {
      __typename?: 'bottomSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
  }>;
};

export const BottomSecondMenu_AggregatedDocument = gql`
  query bottomSecondMenu_aggregated(
    $groupBy: [String]
    $filter: bottomSecondMenu_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    bottomSecondMenu_aggregated(
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
        parent
        path
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
        parent
        path
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
        parent
        sort
        type
      }
      sum {
        id
        index
        parent
        sort
        type
      }
      avgDistinct {
        id
        index
        parent
        sort
        type
      }
      sumDistinct {
        id
        index
        parent
        sort
        type
      }
      min {
        id
        index
        parent
        sort
        type
      }
      max {
        id
        index
        parent
        sort
        type
      }
    }
  }
`;

/**
 * __useBottomSecondMenu_AggregatedQuery__
 *
 * To run a query within a React component, call `useBottomSecondMenu_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useBottomSecondMenu_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBottomSecondMenu_AggregatedQuery({
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
export function useBottomSecondMenu_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<BottomSecondMenu_AggregatedQuery, BottomSecondMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BottomSecondMenu_AggregatedQuery, BottomSecondMenu_AggregatedQueryVariables>(
    BottomSecondMenu_AggregatedDocument,
    options,
  );
}
export function useBottomSecondMenu_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    BottomSecondMenu_AggregatedQuery,
    BottomSecondMenu_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BottomSecondMenu_AggregatedQuery, BottomSecondMenu_AggregatedQueryVariables>(
    BottomSecondMenu_AggregatedDocument,
    options,
  );
}
export type BottomSecondMenu_AggregatedQueryHookResult = ReturnType<typeof useBottomSecondMenu_AggregatedQuery>;
export type BottomSecondMenu_AggregatedLazyQueryHookResult = ReturnType<typeof useBottomSecondMenu_AggregatedLazyQuery>;
export type BottomSecondMenu_AggregatedQueryResult = Apollo.QueryResult<
  BottomSecondMenu_AggregatedQuery,
  BottomSecondMenu_AggregatedQueryVariables
>;
