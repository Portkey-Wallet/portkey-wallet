import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TopSecondMenu_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.TopSecondMenu_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type TopSecondMenu_AggregatedQuery = {
  __typename?: 'Query';
  topSecondMenu_aggregated: Array<{
    __typename?: 'topSecondMenu_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'topSecondMenu_aggregated_count';
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
      __typename?: 'topSecondMenu_aggregated_count';
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
      __typename?: 'topSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sum?: {
      __typename?: 'topSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'topSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'topSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    min?: {
      __typename?: 'topSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
    max?: {
      __typename?: 'topSecondMenu_aggregated_fields';
      id?: number | null;
      index?: number | null;
      parent?: number | null;
      sort?: number | null;
      type?: number | null;
    } | null;
  }>;
};

export const TopSecondMenu_AggregatedDocument = gql`
  query topSecondMenu_aggregated(
    $groupBy: [String]
    $filter: topSecondMenu_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    topSecondMenu_aggregated(
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
 * __useTopSecondMenu_AggregatedQuery__
 *
 * To run a query within a React component, call `useTopSecondMenu_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopSecondMenu_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopSecondMenu_AggregatedQuery({
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
export function useTopSecondMenu_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<TopSecondMenu_AggregatedQuery, TopSecondMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TopSecondMenu_AggregatedQuery, TopSecondMenu_AggregatedQueryVariables>(
    TopSecondMenu_AggregatedDocument,
    options,
  );
}
export function useTopSecondMenu_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TopSecondMenu_AggregatedQuery, TopSecondMenu_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TopSecondMenu_AggregatedQuery, TopSecondMenu_AggregatedQueryVariables>(
    TopSecondMenu_AggregatedDocument,
    options,
  );
}
export type TopSecondMenu_AggregatedQueryHookResult = ReturnType<typeof useTopSecondMenu_AggregatedQuery>;
export type TopSecondMenu_AggregatedLazyQueryHookResult = ReturnType<typeof useTopSecondMenu_AggregatedLazyQuery>;
export type TopSecondMenu_AggregatedQueryResult = Apollo.QueryResult<
  TopSecondMenu_AggregatedQuery,
  TopSecondMenu_AggregatedQueryVariables
>;
