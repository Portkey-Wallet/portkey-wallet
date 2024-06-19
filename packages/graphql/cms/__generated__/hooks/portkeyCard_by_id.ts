import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PortkeyCard_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type PortkeyCard_By_IdQuery = {
  __typename?: 'Query';
  portkeyCard_by_id?: {
    __typename?: 'portkeyCard';
    id: string;
    status?: string | null;
    index?: any | null;
    title?: string | null;
    value?: string | null;
    description?: string | null;
    buttonTitle?: string | null;
    url?: string | null;
    type?: number | null;
    appLink?: string | null;
    extensionLink?: string | null;
    imgUrl?: {
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
};

export const PortkeyCard_By_IdDocument = gql`
  query portkeyCard_by_id(
    $filter: directus_files_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $id: ID!
  ) {
    portkeyCard_by_id(id: $id) {
      id
      status
      index
      title
      value
      description
      buttonTitle
      imgUrl(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
      url
      type
      appLink
      extensionLink
    }
  }
`;

/**
 * __usePortkeyCard_By_IdQuery__
 *
 * To run a query within a React component, call `usePortkeyCard_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortkeyCard_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortkeyCard_By_IdQuery({
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
export function usePortkeyCard_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>(PortkeyCard_By_IdDocument, options);
}
export function usePortkeyCard_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>(
    PortkeyCard_By_IdDocument,
    options,
  );
}
export type PortkeyCard_By_IdQueryHookResult = ReturnType<typeof usePortkeyCard_By_IdQuery>;
export type PortkeyCard_By_IdLazyQueryHookResult = ReturnType<typeof usePortkeyCard_By_IdLazyQuery>;
export type PortkeyCard_By_IdQueryResult = Apollo.QueryResult<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>;
