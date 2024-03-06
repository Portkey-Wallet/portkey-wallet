import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Home_DApp_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.DApp_Filter>;
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
  filter3?: Types.InputMaybe<Types.DApp_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
  filter4?: Types.InputMaybe<Types.Home_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  filter5?: Types.InputMaybe<Types.Home_DApp_Filter>;
  sort5?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit5?: Types.InputMaybe<Types.Scalars['Int']>;
  offset5?: Types.InputMaybe<Types.Scalars['Int']>;
  page5?: Types.InputMaybe<Types.Scalars['Int']>;
  search5?: Types.InputMaybe<Types.Scalars['String']>;
  filter6?: Types.InputMaybe<Types.Home_Filter>;
  sort6?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit6?: Types.InputMaybe<Types.Scalars['Int']>;
  offset6?: Types.InputMaybe<Types.Scalars['Int']>;
  page6?: Types.InputMaybe<Types.Scalars['Int']>;
  search6?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type Home_DApp_By_IdQuery = {
  __typename?: 'Query';
  home_dApp_by_id?: {
    __typename?: 'home_dApp';
    id: string;
    dApp_id?: {
      __typename?: 'dApp';
      date_created?: any | null;
      date_updated?: any | null;
      id: string;
      index?: number | null;
      name?: string | null;
      status?: string | null;
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
      logo?: {
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
    home_id?: {
      __typename?: 'home';
      dAppSectionTitle?: string | null;
      date_updated?: any | null;
      id: string;
      user_updated?: string | null;
      videoContent?: string | null;
      videoTitle?: string | null;
      videoUrl?: string | null;
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
      focusImage?: {
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
      dAppList?: Array<{
        __typename?: 'home_dApp';
        id: string;
        dApp_id?: {
          __typename?: 'dApp';
          date_created?: any | null;
          date_updated?: any | null;
          id: string;
          index?: number | null;
          name?: string | null;
          status?: string | null;
          url?: string | null;
          user_created?: string | null;
          user_updated?: string | null;
        } | null;
        home_id?: {
          __typename?: 'home';
          dAppSectionTitle?: string | null;
          date_updated?: any | null;
          id: string;
          user_updated?: string | null;
          videoContent?: string | null;
          videoTitle?: string | null;
          videoUrl?: string | null;
          dAppList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export const Home_DApp_By_IdDocument = gql`
  query home_dApp_by_id(
    $filter: directus_files_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: dApp_filter
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
    $filter3: dApp_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
    $filter4: home_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $filter5: home_dApp_filter
    $sort5: [String]
    $limit5: Int
    $offset5: Int
    $page5: Int
    $search5: String
    $filter6: home_filter
    $sort6: [String]
    $limit6: Int
    $offset6: Int
    $page6: Int
    $search6: String
    $id: ID!
  ) {
    home_dApp_by_id(id: $id) {
      dApp_id(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
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
        logo(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
        name
        status
        url
        user_created
        user_updated
      }
      home_id(filter: $filter6, sort: $sort6, limit: $limit6, offset: $offset6, page: $page6, search: $search6) {
        dAppSectionTitle
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
        focusImage(filter: $filter2, sort: $sort2, limit: $limit2, offset: $offset2, page: $page2, search: $search2) {
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
        id
        user_updated
        videoContent
        videoTitle
        videoUrl
        dAppList(filter: $filter5, sort: $sort5, limit: $limit5, offset: $offset5, page: $page5, search: $search5) {
          dApp_id(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
            date_created
            date_updated
            id
            index
            name
            status
            url
            user_created
            user_updated
          }
          home_id(filter: $filter4, sort: $sort4, limit: $limit4, offset: $offset4, page: $page4, search: $search4) {
            dAppSectionTitle
            date_updated
            id
            user_updated
            videoContent
            videoTitle
            videoUrl
            dAppList_func {
              count
            }
          }
          id
        }
      }
      id
    }
  }
`;

/**
 * __useHome_DApp_By_IdQuery__
 *
 * To run a query within a React component, call `useHome_DApp_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useHome_DApp_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHome_DApp_By_IdQuery({
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHome_DApp_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<Home_DApp_By_IdQuery, Home_DApp_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Home_DApp_By_IdQuery, Home_DApp_By_IdQueryVariables>(Home_DApp_By_IdDocument, options);
}
export function useHome_DApp_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Home_DApp_By_IdQuery, Home_DApp_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Home_DApp_By_IdQuery, Home_DApp_By_IdQueryVariables>(Home_DApp_By_IdDocument, options);
}
export type Home_DApp_By_IdQueryHookResult = ReturnType<typeof useHome_DApp_By_IdQuery>;
export type Home_DApp_By_IdLazyQueryHookResult = ReturnType<typeof useHome_DApp_By_IdLazyQuery>;
export type Home_DApp_By_IdQueryResult = Apollo.QueryResult<Home_DApp_By_IdQuery, Home_DApp_By_IdQueryVariables>;
