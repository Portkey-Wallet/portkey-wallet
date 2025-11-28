import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SocialMediaQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.SocialMedia_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type SocialMediaQuery = {
  __typename?: 'Query';
  socialMedia: Array<{
    __typename?: 'socialMedia';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    index?: number | null;
    link?: string | null;
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
    svgUrl?: {
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
  }>;
};

export const SocialMediaDocument = gql`
  query socialMedia(
    $filter: directus_files_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: socialMedia_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
  ) {
    socialMedia(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
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
      link
      sort
      status
      svgUrl(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
      title
      user_created
      user_updated
    }
  }
`;

/**
 * __useSocialMediaQuery__
 *
 * To run a query within a React component, call `useSocialMediaQuery` and pass it any options that fit your needs.
 * When your component renders, `useSocialMediaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSocialMediaQuery({
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
export function useSocialMediaQuery(
  baseOptions?: Apollo.QueryHookOptions<SocialMediaQuery, SocialMediaQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SocialMediaQuery, SocialMediaQueryVariables>(SocialMediaDocument, options);
}
export function useSocialMediaLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SocialMediaQuery, SocialMediaQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SocialMediaQuery, SocialMediaQueryVariables>(SocialMediaDocument, options);
}
export type SocialMediaQueryHookResult = ReturnType<typeof useSocialMediaQuery>;
export type SocialMediaLazyQueryHookResult = ReturnType<typeof useSocialMediaLazyQuery>;
export type SocialMediaQueryResult = Apollo.QueryResult<SocialMediaQuery, SocialMediaQueryVariables>;
