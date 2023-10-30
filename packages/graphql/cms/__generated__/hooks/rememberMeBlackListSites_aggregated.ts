import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RememberMeBlackListSites_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.RememberMeBlackListSites_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type RememberMeBlackListSites_AggregatedQuery = {
  __typename?: 'Query';
  rememberMeBlackListSites_aggregated: Array<{
    __typename?: 'rememberMeBlackListSites_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'rememberMeBlackListSites_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      name?: number | null;
      sort?: number | null;
      status?: number | null;
      url?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'rememberMeBlackListSites_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      name?: number | null;
      sort?: number | null;
      status?: number | null;
      url?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    avg?: {
      __typename?: 'rememberMeBlackListSites_aggregated_fields';
      id?: number | null;
      sort?: number | null;
    } | null;
    sum?: {
      __typename?: 'rememberMeBlackListSites_aggregated_fields';
      id?: number | null;
      sort?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'rememberMeBlackListSites_aggregated_fields';
      id?: number | null;
      sort?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'rememberMeBlackListSites_aggregated_fields';
      id?: number | null;
      sort?: number | null;
    } | null;
    min?: {
      __typename?: 'rememberMeBlackListSites_aggregated_fields';
      id?: number | null;
      sort?: number | null;
    } | null;
    max?: {
      __typename?: 'rememberMeBlackListSites_aggregated_fields';
      id?: number | null;
      sort?: number | null;
    } | null;
  }>;
};

export const RememberMeBlackListSites_AggregatedDocument = gql`
  query rememberMeBlackListSites_aggregated(
    $groupBy: [String]
    $filter: rememberMeBlackListSites_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    rememberMeBlackListSites_aggregated(
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
        name
        sort
        status
        url
        user_created
        user_updated
      }
      countDistinct {
        date_created
        date_updated
        id
        name
        sort
        status
        url
        user_created
        user_updated
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
 * __useRememberMeBlackListSites_AggregatedQuery__
 *
 * To run a query within a React component, call `useRememberMeBlackListSites_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useRememberMeBlackListSites_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRememberMeBlackListSites_AggregatedQuery({
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
export function useRememberMeBlackListSites_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    RememberMeBlackListSites_AggregatedQuery,
    RememberMeBlackListSites_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RememberMeBlackListSites_AggregatedQuery, RememberMeBlackListSites_AggregatedQueryVariables>(
    RememberMeBlackListSites_AggregatedDocument,
    options,
  );
}
export function useRememberMeBlackListSites_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    RememberMeBlackListSites_AggregatedQuery,
    RememberMeBlackListSites_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    RememberMeBlackListSites_AggregatedQuery,
    RememberMeBlackListSites_AggregatedQueryVariables
  >(RememberMeBlackListSites_AggregatedDocument, options);
}
export type RememberMeBlackListSites_AggregatedQueryHookResult = ReturnType<
  typeof useRememberMeBlackListSites_AggregatedQuery
>;
export type RememberMeBlackListSites_AggregatedLazyQueryHookResult = ReturnType<
  typeof useRememberMeBlackListSites_AggregatedLazyQuery
>;
export type RememberMeBlackListSites_AggregatedQueryResult = Apollo.QueryResult<
  RememberMeBlackListSites_AggregatedQuery,
  RememberMeBlackListSites_AggregatedQueryVariables
>;
