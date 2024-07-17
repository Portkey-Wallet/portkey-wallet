import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKitPage_MediaKit_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.MediaKit_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.MediaKit_Filter>;
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
  filter4?: Types.InputMaybe<Types.MediaKitPage_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type MediaKitPage_MediaKit_By_IdQuery = {
  __typename?: 'Query';
  mediaKitPage_mediaKit_by_id?: {
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
          mediaKitList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export const MediaKitPage_MediaKit_By_IdDocument = gql`
  query mediaKitPage_mediaKit_by_id(
    $filter: mediaKit_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: mediaKit_filter
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
    $filter4: mediaKitPage_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $id: ID!
  ) {
    mediaKitPage_mediaKit_by_id(id: $id) {
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
        filter: $filter4
        sort: $sort4
        limit: $limit4
        offset: $offset4
        page: $page4
        search: $search4
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
        mediaKitList(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
          id
          mediaKit_id(
            filter: $filter1
            sort: $sort1
            limit: $limit1
            offset: $offset1
            page: $page1
            search: $search1
          ) {
            backgroundColor
            date_created
            date_updated
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
            date_updated
            id
            mediaKitDescription
            status
            title
            user_created
            user_updated
            mediaKitList_func {
              count
            }
          }
        }
      }
    }
  }
`;

/**
 * __useMediaKitPage_MediaKit_By_IdQuery__
 *
 * To run a query within a React component, call `useMediaKitPage_MediaKit_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKitPage_MediaKit_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKitPage_MediaKit_By_IdQuery({
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
 *      filter4: // value for 'filter4'
 *      sort4: // value for 'sort4'
 *      limit4: // value for 'limit4'
 *      offset4: // value for 'offset4'
 *      page4: // value for 'page4'
 *      search4: // value for 'search4'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMediaKitPage_MediaKit_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<MediaKitPage_MediaKit_By_IdQuery, MediaKitPage_MediaKit_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKitPage_MediaKit_By_IdQuery, MediaKitPage_MediaKit_By_IdQueryVariables>(
    MediaKitPage_MediaKit_By_IdDocument,
    options,
  );
}
export function useMediaKitPage_MediaKit_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MediaKitPage_MediaKit_By_IdQuery,
    MediaKitPage_MediaKit_By_IdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MediaKitPage_MediaKit_By_IdQuery, MediaKitPage_MediaKit_By_IdQueryVariables>(
    MediaKitPage_MediaKit_By_IdDocument,
    options,
  );
}
export type MediaKitPage_MediaKit_By_IdQueryHookResult = ReturnType<typeof useMediaKitPage_MediaKit_By_IdQuery>;
export type MediaKitPage_MediaKit_By_IdLazyQueryHookResult = ReturnType<typeof useMediaKitPage_MediaKit_By_IdLazyQuery>;
export type MediaKitPage_MediaKit_By_IdQueryResult = Apollo.QueryResult<
  MediaKitPage_MediaKit_By_IdQuery,
  MediaKitPage_MediaKit_By_IdQueryVariables
>;
