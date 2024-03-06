import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKitPage_MediaKitQueryVariables = Types.Exact<{
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
  filter2?: Types.InputMaybe<Types.MediaKit_Filter>;
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
  filter4?: Types.InputMaybe<Types.Boilerplate_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  filter5?: Types.InputMaybe<Types.MediaKit_Filter>;
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
  filter8?: Types.InputMaybe<Types.MediaKitPage_Filter>;
  sort8?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit8?: Types.InputMaybe<Types.Scalars['Int']>;
  offset8?: Types.InputMaybe<Types.Scalars['Int']>;
  page8?: Types.InputMaybe<Types.Scalars['Int']>;
  search8?: Types.InputMaybe<Types.Scalars['String']>;
  filter9?: Types.InputMaybe<Types.MediaKitPage_Boilerplate_Filter>;
  sort9?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit9?: Types.InputMaybe<Types.Scalars['Int']>;
  offset9?: Types.InputMaybe<Types.Scalars['Int']>;
  page9?: Types.InputMaybe<Types.Scalars['Int']>;
  search9?: Types.InputMaybe<Types.Scalars['String']>;
  filter10?: Types.InputMaybe<Types.MediaKitPage_Filter>;
  sort10?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit10?: Types.InputMaybe<Types.Scalars['Int']>;
  offset10?: Types.InputMaybe<Types.Scalars['Int']>;
  page10?: Types.InputMaybe<Types.Scalars['Int']>;
  search10?: Types.InputMaybe<Types.Scalars['String']>;
  filter11?: Types.InputMaybe<Types.MediaKitPage_MediaKit_Filter>;
  sort11?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit11?: Types.InputMaybe<Types.Scalars['Int']>;
  offset11?: Types.InputMaybe<Types.Scalars['Int']>;
  page11?: Types.InputMaybe<Types.Scalars['Int']>;
  search11?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type MediaKitPage_MediaKitQuery = {
  __typename?: 'Query';
  mediaKitPage_mediaKit: Array<{
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
        charset?: string | null;
        description?: string | null;
        duration?: number | null;
        embed?: string | null;
        filename_disk?: string | null;
        filename_download: string;
        filesize?: any | null;
        folder?: string | null;
        height?: number | null;
        id: string;
        location?: string | null;
        metadata?: any | null;
        modified_by?: string | null;
        modified_on?: any | null;
        storage: string;
        tags?: any | null;
        title?: string | null;
        type?: string | null;
        uploaded_by?: string | null;
        uploaded_on?: any | null;
        width?: number | null;
        metadata_func?: { __typename?: 'count_functions'; count?: number | null } | null;
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
      } | null;
      svg?: {
        __typename?: 'directus_files';
        charset?: string | null;
        description?: string | null;
        duration?: number | null;
        embed?: string | null;
        filename_disk?: string | null;
        filename_download: string;
        filesize?: any | null;
        folder?: string | null;
        height?: number | null;
        id: string;
        location?: string | null;
        metadata?: any | null;
        modified_by?: string | null;
        modified_on?: any | null;
        storage: string;
        tags?: any | null;
        title?: string | null;
        type?: string | null;
        uploaded_by?: string | null;
        uploaded_on?: any | null;
        width?: number | null;
        metadata_func?: { __typename?: 'count_functions'; count?: number | null } | null;
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
      } | null;
    } | null;
    mediaKitPage_id?: {
      __typename?: 'mediaKitPage';
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
      allMediaKitZip?: {
        __typename?: 'directus_files';
        charset?: string | null;
        description?: string | null;
        duration?: number | null;
        embed?: string | null;
        filename_disk?: string | null;
        filename_download: string;
        filesize?: any | null;
        folder?: string | null;
        height?: number | null;
        id: string;
        location?: string | null;
        metadata?: any | null;
        modified_by?: string | null;
        modified_on?: any | null;
        storage: string;
        tags?: any | null;
        title?: string | null;
        type?: string | null;
        uploaded_by?: string | null;
        uploaded_on?: any | null;
        width?: number | null;
        metadata_func?: { __typename?: 'count_functions'; count?: number | null } | null;
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
      boilerplateList?: Array<{
        __typename?: 'mediaKitPage_boilerplate';
        id: string;
        boilerplate_id?: {
          __typename?: 'boilerplate';
          date_created?: any | null;
          date_updated?: any | null;
          id: string;
          index?: number | null;
          name?: string | null;
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
        } | null;
        mediaKitPage_id?: {
          __typename?: 'mediaKitPage';
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
          boilerplateList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
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
            } | null;
            mediaKitPage_id?: {
              __typename?: 'mediaKitPage';
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
      } | null> | null;
    } | null;
  }>;
};

export const MediaKitPage_MediaKitDocument = gql`
  query mediaKitPage_mediaKit(
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
    $filter2: mediaKit_filter
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
    $filter4: boilerplate_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $filter5: mediaKit_filter
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
    $filter8: mediaKitPage_filter
    $sort8: [String]
    $limit8: Int
    $offset8: Int
    $page8: Int
    $search8: String
    $filter9: mediaKitPage_boilerplate_filter
    $sort9: [String]
    $limit9: Int
    $offset9: Int
    $page9: Int
    $search9: String
    $filter10: mediaKitPage_filter
    $sort10: [String]
    $limit10: Int
    $offset10: Int
    $page10: Int
    $search10: String
    $filter11: mediaKitPage_mediaKit_filter
    $sort11: [String]
    $limit11: Int
    $offset11: Int
    $page11: Int
    $search11: String
  ) {
    mediaKitPage_mediaKit(
      filter: $filter11
      sort: $sort11
      limit: $limit11
      offset: $offset11
      page: $page11
      search: $search11
    ) {
      id
      mediaKit_id(filter: $filter2, sort: $sort2, limit: $limit2, offset: $offset2, page: $page2, search: $search2) {
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
        png(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
          charset
          description
          duration
          embed
          filename_disk
          filename_download
          filesize
          folder
          height
          id
          location
          metadata
          metadata_func {
            count
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
          storage
          tags
          tags_func {
            count
          }
          title
          type
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
          width
        }
        sort
        status
        svg(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
          charset
          description
          duration
          embed
          filename_disk
          filename_download
          filesize
          folder
          height
          id
          location
          metadata
          metadata_func {
            count
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
          storage
          tags
          tags_func {
            count
          }
          title
          type
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
          width
        }
        user_created
        user_updated
      }
      mediaKitPage_id(
        filter: $filter10
        sort: $sort10
        limit: $limit10
        offset: $offset10
        page: $page10
        search: $search10
      ) {
        allMediaKitZip(
          filter: $filter3
          sort: $sort3
          limit: $limit3
          offset: $offset3
          page: $page3
          search: $search3
        ) {
          charset
          description
          duration
          embed
          filename_disk
          filename_download
          filesize
          folder
          height
          id
          location
          metadata
          metadata_func {
            count
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
          storage
          tags
          tags_func {
            count
          }
          title
          type
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
          width
        }
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
        boilerplateList(
          filter: $filter9
          sort: $sort9
          limit: $limit9
          offset: $offset9
          page: $page9
          search: $search9
        ) {
          boilerplate_id(
            filter: $filter4
            sort: $sort4
            limit: $limit4
            offset: $offset4
            page: $page4
            search: $search4
          ) {
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
            url
            user_created
            user_updated
          }
          id
          mediaKitPage_id(
            filter: $filter8
            sort: $sort8
            limit: $limit8
            offset: $offset8
            page: $page8
            search: $search8
          ) {
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
            boilerplateList_func {
              count
            }
            mediaKitList(
              filter: $filter7
              sort: $sort7
              limit: $limit7
              offset: $offset7
              page: $page7
              search: $search7
            ) {
              id
              mediaKit_id(
                filter: $filter5
                sort: $sort5
                limit: $limit5
                offset: $offset5
                page: $page5
                search: $search5
              ) {
                backgroundColor
                date_created
                date_updated
                id
                index
                name
                sort
                status
                user_created
                user_updated
              }
              mediaKitPage_id(
                filter: $filter6
                sort: $sort6
                limit: $limit6
                offset: $offset6
                page: $page6
                search: $search6
              ) {
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
    }
  }
`;

/**
 * __useMediaKitPage_MediaKitQuery__
 *
 * To run a query within a React component, call `useMediaKitPage_MediaKitQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKitPage_MediaKitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKitPage_MediaKitQuery({
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
 *      filter8: // value for 'filter8'
 *      sort8: // value for 'sort8'
 *      limit8: // value for 'limit8'
 *      offset8: // value for 'offset8'
 *      page8: // value for 'page8'
 *      search8: // value for 'search8'
 *      filter9: // value for 'filter9'
 *      sort9: // value for 'sort9'
 *      limit9: // value for 'limit9'
 *      offset9: // value for 'offset9'
 *      page9: // value for 'page9'
 *      search9: // value for 'search9'
 *      filter10: // value for 'filter10'
 *      sort10: // value for 'sort10'
 *      limit10: // value for 'limit10'
 *      offset10: // value for 'offset10'
 *      page10: // value for 'page10'
 *      search10: // value for 'search10'
 *      filter11: // value for 'filter11'
 *      sort11: // value for 'sort11'
 *      limit11: // value for 'limit11'
 *      offset11: // value for 'offset11'
 *      page11: // value for 'page11'
 *      search11: // value for 'search11'
 *   },
 * });
 */
export function useMediaKitPage_MediaKitQuery(
  baseOptions?: Apollo.QueryHookOptions<MediaKitPage_MediaKitQuery, MediaKitPage_MediaKitQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKitPage_MediaKitQuery, MediaKitPage_MediaKitQueryVariables>(
    MediaKitPage_MediaKitDocument,
    options,
  );
}
export function useMediaKitPage_MediaKitLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MediaKitPage_MediaKitQuery, MediaKitPage_MediaKitQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MediaKitPage_MediaKitQuery, MediaKitPage_MediaKitQueryVariables>(
    MediaKitPage_MediaKitDocument,
    options,
  );
}
export type MediaKitPage_MediaKitQueryHookResult = ReturnType<typeof useMediaKitPage_MediaKitQuery>;
export type MediaKitPage_MediaKitLazyQueryHookResult = ReturnType<typeof useMediaKitPage_MediaKitLazyQuery>;
export type MediaKitPage_MediaKitQueryResult = Apollo.QueryResult<
  MediaKitPage_MediaKitQuery,
  MediaKitPage_MediaKitQueryVariables
>;
