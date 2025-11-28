import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TabMenuQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.TabType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.TabMenu_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type TabMenuQuery = {
  __typename?: 'Query';
  tabMenu: Array<{
    __typename?: 'tabMenu';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    index?: number | null;
    sort?: number | null;
    status?: string | null;
    title?: string | null;
    user_created?: string | null;
    user_updated?: string | null;
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
    type?: {
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
    } | null;
  }>;
};

export const TabMenuDocument = gql`
  query tabMenu(
    $filter: tabType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: tabMenu_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
  ) {
    tabMenu(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
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
      index
      sort
      status
      title
      type(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
      user_created
      user_updated
    }
  }
`;

/**
 * __useTabMenuQuery__
 *
 * To run a query within a React component, call `useTabMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useTabMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTabMenuQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      filter1: // value for 'filter1'
 *      sort1: // value for 'sort1'
 *      limit1: // value for 'limit1'
 *      offset1: // value for 'offset1'
 *      page1: // value for 'page1'
 *      search1: // value for 'search1'
 *   },
 * });
 */
export function useTabMenuQuery(baseOptions?: Apollo.QueryHookOptions<TabMenuQuery, TabMenuQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TabMenuQuery, TabMenuQueryVariables>(TabMenuDocument, options);
}
export function useTabMenuLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TabMenuQuery, TabMenuQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TabMenuQuery, TabMenuQueryVariables>(TabMenuDocument, options);
}
export type TabMenuQueryHookResult = ReturnType<typeof useTabMenuQuery>;
export type TabMenuLazyQueryHookResult = ReturnType<typeof useTabMenuLazyQuery>;
export type TabMenuQueryResult = Apollo.QueryResult<TabMenuQuery, TabMenuQueryVariables>;
