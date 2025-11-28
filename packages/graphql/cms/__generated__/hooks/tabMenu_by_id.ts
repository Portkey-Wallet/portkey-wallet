import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TabMenu_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.TabType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type TabMenu_By_IdQuery = {
  __typename?: 'Query';
  tabMenu_by_id?: {
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
  } | null;
};

export const TabMenu_By_IdDocument = gql`
  query tabMenu_by_id(
    $filter: tabType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $id: ID!
  ) {
    tabMenu_by_id(id: $id) {
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
 * __useTabMenu_By_IdQuery__
 *
 * To run a query within a React component, call `useTabMenu_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTabMenu_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTabMenu_By_IdQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTabMenu_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<TabMenu_By_IdQuery, TabMenu_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TabMenu_By_IdQuery, TabMenu_By_IdQueryVariables>(TabMenu_By_IdDocument, options);
}
export function useTabMenu_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TabMenu_By_IdQuery, TabMenu_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TabMenu_By_IdQuery, TabMenu_By_IdQueryVariables>(TabMenu_By_IdDocument, options);
}
export type TabMenu_By_IdQueryHookResult = ReturnType<typeof useTabMenu_By_IdQuery>;
export type TabMenu_By_IdLazyQueryHookResult = ReturnType<typeof useTabMenu_By_IdLazyQuery>;
export type TabMenu_By_IdQueryResult = Apollo.QueryResult<TabMenu_By_IdQuery, TabMenu_By_IdQueryVariables>;
