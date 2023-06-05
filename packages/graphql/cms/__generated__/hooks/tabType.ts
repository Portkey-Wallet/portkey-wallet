import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TabTypeQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.TabType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type TabTypeQuery = {
  __typename?: 'Query';
  tabType: Array<{
    __typename?: 'tabType';
    attribute?: string | null;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    sort?: number | null;
    status?: string | null;
    user_created?: string | null;
    user_updated?: string | null;
    value?: string | null;
    date_created_func?: {
      __typename?: 'datetime_functions';
      year?: number | null;
      month?: number | null;
      week?: number | null;
      day?: number | null;
      weekday?: number | null;
      hour?: number | null;
      minute?: number | null;
      second?: number | null;
    } | null;
    date_updated_func?: {
      __typename?: 'datetime_functions';
      year?: number | null;
      month?: number | null;
      week?: number | null;
      day?: number | null;
      weekday?: number | null;
      hour?: number | null;
      minute?: number | null;
      second?: number | null;
    } | null;
  }>;
};

export const TabTypeDocument = gql`
  query tabType($filter: tabType_filter, $sort: [String], $limit: Int, $offset: Int, $page: Int, $search: String) {
    tabType(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      attribute
      date_created
      date_created_func {
        year
        month
        week
        day
        weekday
        hour
        minute
        second
      }
      date_updated
      date_updated_func {
        year
        month
        week
        day
        weekday
        hour
        minute
        second
      }
      id
      sort
      status
      user_created
      user_updated
      value
    }
  }
`;

/**
 * __useTabTypeQuery__
 *
 * To run a query within a React component, call `useTabTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useTabTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTabTypeQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useTabTypeQuery(baseOptions?: Apollo.QueryHookOptions<TabTypeQuery, TabTypeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TabTypeQuery, TabTypeQueryVariables>(TabTypeDocument, options);
}
export function useTabTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TabTypeQuery, TabTypeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TabTypeQuery, TabTypeQueryVariables>(TabTypeDocument, options);
}
export type TabTypeQueryHookResult = ReturnType<typeof useTabTypeQuery>;
export type TabTypeLazyQueryHookResult = ReturnType<typeof useTabTypeLazyQuery>;
export type TabTypeQueryResult = Apollo.QueryResult<TabTypeQuery, TabTypeQueryVariables>;
