import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SocialMedia_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type SocialMedia_By_IdQuery = {
  __typename?: 'Query';
  socialMedia_by_id?: {
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
  } | null;
};

export const SocialMedia_By_IdDocument = gql`
  query socialMedia_by_id(
    $filter: directus_files_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $id: ID!
  ) {
    socialMedia_by_id(id: $id) {
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
 * __useSocialMedia_By_IdQuery__
 *
 * To run a query within a React component, call `useSocialMedia_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSocialMedia_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSocialMedia_By_IdQuery({
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
export function useSocialMedia_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>(SocialMedia_By_IdDocument, options);
}
export function useSocialMedia_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>(
    SocialMedia_By_IdDocument,
    options,
  );
}
export type SocialMedia_By_IdQueryHookResult = ReturnType<typeof useSocialMedia_By_IdQuery>;
export type SocialMedia_By_IdLazyQueryHookResult = ReturnType<typeof useSocialMedia_By_IdLazyQuery>;
export type SocialMedia_By_IdQueryResult = Apollo.QueryResult<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>;
