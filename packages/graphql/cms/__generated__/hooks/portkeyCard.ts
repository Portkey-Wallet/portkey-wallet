import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PortkeyCardQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.PortkeyCard_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type PortkeyCardQuery = {
  __typename?: 'Query';
  portkeyCard: Array<{
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
  }>;
};

export const PortkeyCardDocument = gql`
  query portkeyCard(
    $filter: directus_files_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: portkeyCard_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
  ) {
    portkeyCard(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
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
 * __usePortkeyCardQuery__
 *
 * To run a query within a React component, call `usePortkeyCardQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortkeyCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortkeyCardQuery({
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
export function usePortkeyCardQuery(
  baseOptions?: Apollo.QueryHookOptions<PortkeyCardQuery, PortkeyCardQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PortkeyCardQuery, PortkeyCardQueryVariables>(PortkeyCardDocument, options);
}
export function usePortkeyCardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PortkeyCardQuery, PortkeyCardQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PortkeyCardQuery, PortkeyCardQueryVariables>(PortkeyCardDocument, options);
}
export type PortkeyCardQueryHookResult = ReturnType<typeof usePortkeyCardQuery>;
export type PortkeyCardLazyQueryHookResult = ReturnType<typeof usePortkeyCardLazyQuery>;
export type PortkeyCardQueryResult = Apollo.QueryResult<PortkeyCardQuery, PortkeyCardQueryVariables>;
