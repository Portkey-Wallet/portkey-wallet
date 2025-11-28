import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKit_By_IdQueryVariables = Types.Exact<{
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
  id: Types.Scalars['ID'];
}>;

export type MediaKit_By_IdQuery = {
  __typename?: 'Query';
  mediaKit_by_id?: {
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
};

export const MediaKit_By_IdDocument = gql`
  query mediaKit_by_id(
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
    $id: ID!
  ) {
    mediaKit_by_id(id: $id) {
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
  }
`;

/**
 * __useMediaKit_By_IdQuery__
 *
 * To run a query within a React component, call `useMediaKit_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKit_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKit_By_IdQuery({
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMediaKit_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>(MediaKit_By_IdDocument, options);
}
export function useMediaKit_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>(MediaKit_By_IdDocument, options);
}
export type MediaKit_By_IdQueryHookResult = ReturnType<typeof useMediaKit_By_IdQuery>;
export type MediaKit_By_IdLazyQueryHookResult = ReturnType<typeof useMediaKit_By_IdLazyQuery>;
export type MediaKit_By_IdQueryResult = Apollo.QueryResult<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>;
