import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKitPageQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  filter2?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
  filter3?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
  filter4?: Types.InputMaybe<Types.MediaKit_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  filter5?: Types.InputMaybe<Types.MediaKitPage_MediaKit_Filter>;
  sort5?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit5?: Types.InputMaybe<Types.Scalars['Int']>;
  offset5?: Types.InputMaybe<Types.Scalars['Int']>;
  page5?: Types.InputMaybe<Types.Scalars['Int']>;
  search5?: Types.InputMaybe<Types.Scalars['String']>;
  filter6?: Types.InputMaybe<Types.MediaKitPage_Filter>;
  sort6?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit6?: Types.InputMaybe<Types.Scalars['Int']>;
  offset6?: Types.InputMaybe<Types.Scalars['Int']>;
  page6?: Types.InputMaybe<Types.Scalars['Int']>;
  search6?: Types.InputMaybe<Types.Scalars['String']>;
  filter7?: Types.InputMaybe<Types.MediaKitPage_MediaKit_Filter>;
  sort7?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit7?: Types.InputMaybe<Types.Scalars['Int']>;
  offset7?: Types.InputMaybe<Types.Scalars['Int']>;
  page7?: Types.InputMaybe<Types.Scalars['Int']>;
  search7?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type MediaKitPageQuery = {
  __typename?: 'Query';
  mediaKitPage?: {
    __typename?: 'mediaKitPage';
    content: string;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    status?: string | null;
    title: string;
    user_created?: string | null;
    user_updated?: string | null;
    boilerplateContent?: string | null;
    boilerplateTitle?: string | null;
    mediaKitDescription?: string | null;
    allMediaKitZip?: {
      __typename?: 'directus_files';
      id: string;
      storage: string;
      filename_disk?: string | null;
      filename_download: string;
      title?: string | null;
      type?: string | null;
      folder?: string | null;
      uploaded_by?: string | null;
      uploaded_on?: any | null;
      modified_by?: string | null;
      modified_on?: any | null;
      charset?: string | null;
      filesize?: any | null;
      width?: number | null;
      height?: number | null;
      duration?: number | null;
      embed?: string | null;
      description?: string | null;
      location?: string | null;
      tags?: any | null;
      metadata?: any | null;
      uploaded_on_func?: {
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
      modified_on_func?: {
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
      tags_func?: { __typename?: 'count_functions'; count?: number | null } | null;
      metadata_func?: { __typename?: 'count_functions'; count?: number | null } | null;
    } | null;
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
      mediaKitPage_id?: {
        __typename?: 'mediaKitPage';
        content: string;
        date_created?: any | null;
        date_updated?: any | null;
        id: string;
        status?: string | null;
        title: string;
        user_created?: string | null;
        user_updated?: string | null;
        boilerplateContent?: string | null;
        boilerplateTitle?: string | null;
        mediaKitDescription?: string | null;
        allMediaKitZip?: {
          __typename?: 'directus_files';
          id: string;
          storage: string;
          filename_disk?: string | null;
          filename_download: string;
          title?: string | null;
          type?: string | null;
          folder?: string | null;
          uploaded_by?: string | null;
          uploaded_on?: any | null;
          modified_by?: string | null;
          modified_on?: any | null;
          charset?: string | null;
          filesize?: any | null;
          width?: number | null;
          height?: number | null;
          duration?: number | null;
          embed?: string | null;
          description?: string | null;
          location?: string | null;
          tags?: any | null;
          metadata?: any | null;
        } | null;
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
            sort?: number | null;
            status?: string | null;
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
            png?: {
              __typename?: 'directus_files';
              id: string;
              storage: string;
              filename_disk?: string | null;
              filename_download: string;
              title?: string | null;
              type?: string | null;
              folder?: string | null;
              uploaded_by?: string | null;
              uploaded_on?: any | null;
              modified_by?: string | null;
              modified_on?: any | null;
              charset?: string | null;
              filesize?: any | null;
              width?: number | null;
              height?: number | null;
              duration?: number | null;
              embed?: string | null;
              description?: string | null;
              location?: string | null;
              tags?: any | null;
              metadata?: any | null;
              uploaded_on_func?: {
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
              modified_on_func?: {
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
              tags_func?: { __typename?: 'count_functions'; count?: number | null } | null;
              metadata_func?: { __typename?: 'count_functions'; count?: number | null } | null;
            } | null;
            svg?: {
              __typename?: 'directus_files';
              id: string;
              storage: string;
              filename_disk?: string | null;
              filename_download: string;
              title?: string | null;
              type?: string | null;
              folder?: string | null;
              uploaded_by?: string | null;
              uploaded_on?: any | null;
              modified_by?: string | null;
              modified_on?: any | null;
              charset?: string | null;
              filesize?: any | null;
              width?: number | null;
              height?: number | null;
              duration?: number | null;
              embed?: string | null;
              description?: string | null;
              location?: string | null;
              tags?: any | null;
              metadata?: any | null;
              uploaded_on_func?: {
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
              modified_on_func?: {
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
              tags_func?: { __typename?: 'count_functions'; count?: number | null } | null;
              metadata_func?: { __typename?: 'count_functions'; count?: number | null } | null;
            } | null;
          } | null;
        } | null> | null;
        mediaKitList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
      } | null;
    } | null> | null;
    mediaKitList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  } | null;
};

export const MediaKitPageDocument = gql`
  query mediaKitPage(
    $filter: directus_files_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: directus_files_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $filter2: directus_files_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
    $filter3: directus_files_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
    $filter4: mediaKit_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $filter5: mediaKitPage_mediaKit_filter
    $sort5: [String]
    $limit5: Int
    $offset5: Int
    $page5: Int
    $search5: String
    $filter6: mediaKitPage_filter
    $sort6: [String]
    $limit6: Int
    $offset6: Int
    $page6: Int
    $search6: String
    $filter7: mediaKitPage_mediaKit_filter
    $sort7: [String]
    $limit7: Int
    $offset7: Int
    $page7: Int
    $search7: String
  ) {
    mediaKitPage {
      allMediaKitZip(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
        id
        storage
        filename_disk
        filename_download
        title
        type
        folder
        uploaded_by
        uploaded_on
        uploaded_on_func {
          year
          month
          week
          day
          weekday
          hour
          minute
          second
        }
        modified_by
        modified_on
        modified_on_func {
          year
          month
          week
          day
          weekday
          hour
          minute
          second
        }
        charset
        filesize
        width
        height
        duration
        embed
        description
        location
        tags
        tags_func {
          count
        }
        metadata
        metadata_func {
          count
        }
      }
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
      status
      title
      user_created
      user_updated
      boilerplateContent
      boilerplateTitle
      mediaKitDescription
      mediaKitList(filter: $filter7, sort: $sort7, limit: $limit7, offset: $offset7, page: $page7, search: $search7) {
        id
        mediaKitPage_id(
          filter: $filter6
          sort: $sort6
          limit: $limit6
          offset: $offset6
          page: $page6
          search: $search6
        ) {
          allMediaKitZip(
            filter: $filter1
            sort: $sort1
            limit: $limit1
            offset: $offset1
            page: $page1
            search: $search1
          ) {
            id
            storage
            filename_disk
            filename_download
            title
            type
            folder
            uploaded_by
            uploaded_on
            modified_by
            modified_on
            charset
            filesize
            width
            height
            duration
            embed
            description
            location
            tags
            metadata
          }
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
          status
          title
          user_created
          user_updated
          boilerplateContent
          boilerplateTitle
          mediaKitDescription
          mediaKitList(
            filter: $filter5
            sort: $sort5
            limit: $limit5
            offset: $offset5
            page: $page5
            search: $search5
          ) {
            id
            mediaKit_id(
              filter: $filter4
              sort: $sort4
              limit: $limit4
              offset: $offset4
              page: $page4
              search: $search4
            ) {
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
              png(filter: $filter2, sort: $sort2, limit: $limit2, offset: $offset2, page: $page2, search: $search2) {
                id
                storage
                filename_disk
                filename_download
                title
                type
                folder
                uploaded_by
                uploaded_on
                uploaded_on_func {
                  year
                  month
                  week
                  day
                  weekday
                  hour
                  minute
                  second
                }
                modified_by
                modified_on
                modified_on_func {
                  year
                  month
                  week
                  day
                  weekday
                  hour
                  minute
                  second
                }
                charset
                filesize
                width
                height
                duration
                embed
                description
                location
                tags
                tags_func {
                  count
                }
                metadata
                metadata_func {
                  count
                }
              }
              sort
              status
              svg(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
                id
                storage
                filename_disk
                filename_download
                title
                type
                folder
                uploaded_by
                uploaded_on
                uploaded_on_func {
                  year
                  month
                  week
                  day
                  weekday
                  hour
                  minute
                  second
                }
                modified_by
                modified_on
                modified_on_func {
                  year
                  month
                  week
                  day
                  weekday
                  hour
                  minute
                  second
                }
                charset
                filesize
                width
                height
                duration
                embed
                description
                location
                tags
                tags_func {
                  count
                }
                metadata
                metadata_func {
                  count
                }
              }
              user_created
              user_updated
            }
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
 *      filter4: // value for 'filter4'
 *      sort4: // value for 'sort4'
 *      limit4: // value for 'limit4'
 *      offset4: // value for 'offset4'
 *      page4: // value for 'page4'
 *      search4: // value for 'search4'
 *      filter5: // value for 'filter5'
 *      sort5: // value for 'sort5'
 *      limit5: // value for 'limit5'
 *      offset5: // value for 'offset5'
 *      page5: // value for 'page5'
 *      search5: // value for 'search5'
 *      filter6: // value for 'filter6'
 *      sort6: // value for 'sort6'
 *      limit6: // value for 'limit6'
 *      offset6: // value for 'offset6'
 *      page6: // value for 'page6'
 *      search6: // value for 'search6'
 *      filter7: // value for 'filter7'
 *      sort7: // value for 'sort7'
 *      limit7: // value for 'limit7'
 *      offset7: // value for 'offset7'
 *      page7: // value for 'page7'
 *      search7: // value for 'search7'
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
