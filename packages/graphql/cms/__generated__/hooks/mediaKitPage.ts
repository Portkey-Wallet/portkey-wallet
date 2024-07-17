import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKitPageQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.MediaKit_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.MediaKitPage_MediaKit_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  filter2?: Types.InputMaybe<Types.MediaKitPage_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
  filter3?: Types.InputMaybe<Types.MediaKitPage_MediaKit_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type MediaKitPageQuery = {
  __typename?: 'Query';
  mediaKitPage?: {
    __typename?: 'mediaKitPage';
    allMediaKitZip?: string | null;
    boilerplateContent?: string | null;
    boilerplateTitle?: string | null;
    content: string;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    mediaKitDescription?: string | null;
    status?: string | null;
    title: string;
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
    mediaKitList?: Array<{
      __typename?: 'mediaKitPage_mediaKit';
      id: string;
      mediaKit_id?: {
        __typename?: 'mediaKit';
        backgroundColor?: string | null;
        date_created?: any | null;
        date_updated?: any | null;
        id: string;
        index?: number | null;
        name: string;
        png?: string | null;
        sort?: number | null;
        status?: string | null;
        svg?: string | null;
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
      } | null;
      mediaKitPage_id?: {
        __typename?: 'mediaKitPage';
        allMediaKitZip?: string | null;
        boilerplateContent?: string | null;
        boilerplateTitle?: string | null;
        content: string;
        date_created?: any | null;
        date_updated?: any | null;
        id: string;
        mediaKitDescription?: string | null;
        status?: string | null;
        title: string;
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
        mediaKitList?: Array<{ __typename?: 'mediaKitPage_mediaKit'; id: string } | null> | null;
        mediaKitList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
      } | null;
    } | null> | null;
    mediaKitList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  } | null;
};

export const MediaKitPageDocument = gql`
  query mediaKitPage(
    $filter: mediaKit_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: mediaKitPage_mediaKit_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $filter2: mediaKitPage_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
    $filter3: mediaKitPage_mediaKit_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
  ) {
    mediaKitPage {
      allMediaKitZip
      boilerplateContent
      boilerplateTitle
      content
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
      mediaKitDescription
      status
      title
      user_created
      user_updated
      mediaKitList(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
        id
        mediaKit_id(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
          backgroundColor
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
          name
          png
          sort
          status
          svg
          user_created
          user_updated
        }
        mediaKitPage_id(
          filter: $filter2
          sort: $sort2
          limit: $limit2
          offset: $offset2
          page: $page2
          search: $search2
        ) {
          allMediaKitZip
          boilerplateContent
          boilerplateTitle
          content
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
          mediaKitDescription
          status
          title
          user_created
          user_updated
          mediaKitList(
            filter: $filter1
            sort: $sort1
            limit: $limit1
            offset: $offset1
            page: $page1
            search: $search1
          ) {
            id
          }
          mediaKitList_func {
            count
          }
        }
      }
      mediaKitList_func {
        count
      }
    }
  }
`;

/**
 * __useMediaKitPageQuery__
 *
 * To run a query within a React component, call `useMediaKitPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKitPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKitPageQuery({
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
 *      filter3: // value for 'filter3'
 *      sort3: // value for 'sort3'
 *      limit3: // value for 'limit3'
 *      offset3: // value for 'offset3'
 *      page3: // value for 'page3'
 *      search3: // value for 'search3'
 *   },
 * });
 */
export function useMediaKitPageQuery(
  baseOptions?: Apollo.QueryHookOptions<MediaKitPageQuery, MediaKitPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKitPageQuery, MediaKitPageQueryVariables>(MediaKitPageDocument, options);
}
export function useMediaKitPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MediaKitPageQuery, MediaKitPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MediaKitPageQuery, MediaKitPageQueryVariables>(MediaKitPageDocument, options);
}
export type MediaKitPageQueryHookResult = ReturnType<typeof useMediaKitPageQuery>;
export type MediaKitPageLazyQueryHookResult = ReturnType<typeof useMediaKitPageLazyQuery>;
export type MediaKitPageQueryResult = Apollo.QueryResult<MediaKitPageQuery, MediaKitPageQueryVariables>;
