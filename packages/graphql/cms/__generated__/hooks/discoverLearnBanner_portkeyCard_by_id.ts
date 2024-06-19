import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverLearnBanner_PortkeyCard_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.DiscoverLearnBanner_Filter>;
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
  filter2?: Types.InputMaybe<Types.PortkeyCard_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
  filter3?: Types.InputMaybe<Types.DiscoverLearnBanner_PortkeyCard_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
  filter4?: Types.InputMaybe<Types.DiscoverLearnBanner_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  filter5?: Types.InputMaybe<Types.PortkeyCard_Filter>;
  sort5?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit5?: Types.InputMaybe<Types.Scalars['Int']>;
  offset5?: Types.InputMaybe<Types.Scalars['Int']>;
  page5?: Types.InputMaybe<Types.Scalars['Int']>;
  search5?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type DiscoverLearnBanner_PortkeyCard_By_IdQuery = {
  __typename?: 'Query';
  discoverLearnBanner_portkeyCard_by_id?: {
    __typename?: 'discoverLearnBanner_portkeyCard';
    id: string;
    discoverLearnBanner_id?: {
      __typename?: 'discoverLearnBanner';
      id: string;
      status?: string | null;
      items?: Array<{
        __typename?: 'discoverLearnBanner_portkeyCard';
        id: string;
        discoverLearnBanner_id?: {
          __typename?: 'discoverLearnBanner';
          id: string;
          status?: string | null;
          items_func?: { __typename?: 'count_functions'; count?: number | null } | null;
        } | null;
        portkeyCard_id?: {
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
      } | null> | null;
    } | null;
    portkeyCard_id?: {
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
    } | null;
  } | null;
};

export const DiscoverLearnBanner_PortkeyCard_By_IdDocument = gql`
  query discoverLearnBanner_portkeyCard_by_id(
    $filter: discoverLearnBanner_filter
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
    $filter2: portkeyCard_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
    $filter3: discoverLearnBanner_portkeyCard_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
    $filter4: discoverLearnBanner_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $filter5: portkeyCard_filter
    $sort5: [String]
    $limit5: Int
    $offset5: Int
    $page5: Int
    $search5: String
    $id: ID!
  ) {
    discoverLearnBanner_portkeyCard_by_id(id: $id) {
      id
      discoverLearnBanner_id(
        filter: $filter4
        sort: $sort4
        limit: $limit4
        offset: $offset4
        page: $page4
        search: $search4
      ) {
        id
        status
        items(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
          id
          discoverLearnBanner_id(
            filter: $filter
            sort: $sort
            limit: $limit
            offset: $offset
            page: $page
            search: $search
          ) {
            id
            status
            items_func {
              count
            }
          }
          portkeyCard_id(
            filter: $filter2
            sort: $sort2
            limit: $limit2
            offset: $offset2
            page: $page2
            search: $search2
          ) {
            id
            status
            index
            title
            value
            description
            buttonTitle
            imgUrl(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
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
      }
      portkeyCard_id(filter: $filter5, sort: $sort5, limit: $limit5, offset: $offset5, page: $page5, search: $search5) {
        id
        status
        index
        title
        value
        description
        buttonTitle
        url
        type
        appLink
        extensionLink
      }
    }
  }
`;

/**
 * __useDiscoverLearnBanner_PortkeyCard_By_IdQuery__
 *
 * To run a query within a React component, call `useDiscoverLearnBanner_PortkeyCard_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverLearnBanner_PortkeyCard_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverLearnBanner_PortkeyCard_By_IdQuery({
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDiscoverLearnBanner_PortkeyCard_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<
    DiscoverLearnBanner_PortkeyCard_By_IdQuery,
    DiscoverLearnBanner_PortkeyCard_By_IdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    DiscoverLearnBanner_PortkeyCard_By_IdQuery,
    DiscoverLearnBanner_PortkeyCard_By_IdQueryVariables
  >(DiscoverLearnBanner_PortkeyCard_By_IdDocument, options);
}
export function useDiscoverLearnBanner_PortkeyCard_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverLearnBanner_PortkeyCard_By_IdQuery,
    DiscoverLearnBanner_PortkeyCard_By_IdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DiscoverLearnBanner_PortkeyCard_By_IdQuery,
    DiscoverLearnBanner_PortkeyCard_By_IdQueryVariables
  >(DiscoverLearnBanner_PortkeyCard_By_IdDocument, options);
}
export type DiscoverLearnBanner_PortkeyCard_By_IdQueryHookResult = ReturnType<
  typeof useDiscoverLearnBanner_PortkeyCard_By_IdQuery
>;
export type DiscoverLearnBanner_PortkeyCard_By_IdLazyQueryHookResult = ReturnType<
  typeof useDiscoverLearnBanner_PortkeyCard_By_IdLazyQuery
>;
export type DiscoverLearnBanner_PortkeyCard_By_IdQueryResult = Apollo.QueryResult<
  DiscoverLearnBanner_PortkeyCard_By_IdQuery,
  DiscoverLearnBanner_PortkeyCard_By_IdQueryVariables
>;
