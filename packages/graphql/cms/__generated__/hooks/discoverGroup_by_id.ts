import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverGroup_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.DiscoverItem_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.DiscoverGroup_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  filter2?: Types.InputMaybe<Types.DiscoverItem_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type DiscoverGroup_By_IdQuery = {
  __typename?: 'Query';
  discoverGroup_by_id?: {
    __typename?: 'discoverGroup';
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
    items?: Array<{
      __typename?: 'discoverItem';
      appLink?: string | null;
      date_created?: any | null;
      date_updated?: any | null;
      description?: string | null;
      extensionLink?: string | null;
      id: string;
      imgUrl?: string | null;
      index?: number | null;
      sort?: number | null;
      status?: string | null;
      title?: string | null;
      url?: string | null;
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
      group?: {
        __typename?: 'discoverGroup';
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
        items?: Array<{
          __typename?: 'discoverItem';
          appLink?: string | null;
          date_created?: any | null;
          date_updated?: any | null;
          description?: string | null;
          extensionLink?: string | null;
          id: string;
          imgUrl?: string | null;
          index?: number | null;
          sort?: number | null;
          status?: string | null;
          title?: string | null;
          url?: string | null;
          user_created?: string | null;
          user_updated?: string | null;
        } | null> | null;
        items_func?: { __typename?: 'count_functions'; count?: number | null } | null;
      } | null;
    } | null> | null;
    items_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  } | null;
};

export const DiscoverGroup_By_IdDocument = gql`
  query discoverGroup_by_id(
    $filter: discoverItem_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: discoverGroup_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $filter2: discoverItem_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
    $id: ID!
  ) {
    discoverGroup_by_id(id: $id) {
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
      user_created
      user_updated
      items(filter: $filter2, sort: $sort2, limit: $limit2, offset: $offset2, page: $page2, search: $search2) {
        appLink
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
        description
        extensionLink
        group(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
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
          user_created
          user_updated
          items(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
            appLink
            date_created
            date_updated
            description
            extensionLink
            id
            imgUrl
            index
            sort
            status
            title
            url
            user_created
            user_updated
          }
          items_func {
            count
          }
        }
        id
        imgUrl
        index
        sort
        status
        title
        url
        user_created
        user_updated
      }
      items_func {
        count
      }
    }
  }
`;

/**
 * __useDiscoverGroup_By_IdQuery__
 *
 * To run a query within a React component, call `useDiscoverGroup_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverGroup_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverGroup_By_IdQuery({
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
 *      filter2: // value for 'filter2'
 *      sort2: // value for 'sort2'
 *      limit2: // value for 'limit2'
 *      offset2: // value for 'offset2'
 *      page2: // value for 'page2'
 *      search2: // value for 'search2'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDiscoverGroup_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<DiscoverGroup_By_IdQuery, DiscoverGroup_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverGroup_By_IdQuery, DiscoverGroup_By_IdQueryVariables>(
    DiscoverGroup_By_IdDocument,
    options,
  );
}
export function useDiscoverGroup_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverGroup_By_IdQuery, DiscoverGroup_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverGroup_By_IdQuery, DiscoverGroup_By_IdQueryVariables>(
    DiscoverGroup_By_IdDocument,
    options,
  );
}
export type DiscoverGroup_By_IdQueryHookResult = ReturnType<typeof useDiscoverGroup_By_IdQuery>;
export type DiscoverGroup_By_IdLazyQueryHookResult = ReturnType<typeof useDiscoverGroup_By_IdLazyQuery>;
export type DiscoverGroup_By_IdQueryResult = Apollo.QueryResult<
  DiscoverGroup_By_IdQuery,
  DiscoverGroup_By_IdQueryVariables
>;
