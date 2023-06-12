import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NavigationType_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.NavigationType_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type NavigationType_AggregatedQuery = {
  __typename?: 'Query';
  navigationType_aggregated: Array<{
    __typename?: 'navigationType_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'navigationType_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      description?: number | null;
      id?: number | null;
      sort?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'navigationType_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      description?: number | null;
      id?: number | null;
      sort?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    avg?: {
      __typename?: 'navigationType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    sum?: {
      __typename?: 'navigationType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'navigationType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'navigationType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    min?: {
      __typename?: 'navigationType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
    max?: {
      __typename?: 'navigationType_aggregated_fields';
      id?: number | null;
      sort?: number | null;
      value?: number | null;
    } | null;
  }>;
};

export const NavigationType_AggregatedDocument = gql`
  query navigationType_aggregated(
    $groupBy: [String]
    $filter: navigationType_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    navigationType_aggregated(
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
        description
        id
        sort
        status
        user_created
        user_updated
        value
      }
      countDistinct {
        date_created
        date_updated
        description
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
 * __useNavigationType_AggregatedQuery__
 *
 * To run a query within a React component, call `useNavigationType_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useNavigationType_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNavigationType_AggregatedQuery({
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
export function useNavigationType_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<NavigationType_AggregatedQuery, NavigationType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NavigationType_AggregatedQuery, NavigationType_AggregatedQueryVariables>(
    NavigationType_AggregatedDocument,
    options,
  );
}
export function useNavigationType_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NavigationType_AggregatedQuery, NavigationType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NavigationType_AggregatedQuery, NavigationType_AggregatedQueryVariables>(
    NavigationType_AggregatedDocument,
    options,
  );
}
export type NavigationType_AggregatedQueryHookResult = ReturnType<typeof useNavigationType_AggregatedQuery>;
export type NavigationType_AggregatedLazyQueryHookResult = ReturnType<typeof useNavigationType_AggregatedLazyQuery>;
export type NavigationType_AggregatedQueryResult = Apollo.QueryResult<
  NavigationType_AggregatedQuery,
  NavigationType_AggregatedQueryVariables
>;
