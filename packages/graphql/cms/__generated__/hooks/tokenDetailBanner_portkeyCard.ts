import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TokenDetailBanner_PortkeyCardQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.TokenDetailBanner_Filter>;
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
  filter3?: Types.InputMaybe<Types.TokenDetailBanner_PortkeyCard_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
  filter4?: Types.InputMaybe<Types.TokenDetailBanner_Filter>;
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
  filter6?: Types.InputMaybe<Types.TokenDetailBanner_PortkeyCard_Filter>;
  sort6?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit6?: Types.InputMaybe<Types.Scalars['Int']>;
  offset6?: Types.InputMaybe<Types.Scalars['Int']>;
  page6?: Types.InputMaybe<Types.Scalars['Int']>;
  search6?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type TokenDetailBanner_PortkeyCardQuery = {
  __typename?: 'Query';
  tokenDetailBanner_portkeyCard: Array<{
    __typename?: 'tokenDetailBanner_portkeyCard';
    id: string;
    tokenDetailBanner_id?: {
      __typename?: 'tokenDetailBanner';
      id: string;
      status?: string | null;
      chainId?: string | null;
      symbol?: string | null;
      items?: Array<{
        __typename?: 'tokenDetailBanner_portkeyCard';
        id: string;
        tokenDetailBanner_id?: {
          __typename?: 'tokenDetailBanner';
          id: string;
          status?: string | null;
          chainId?: string | null;
          symbol?: string | null;
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
  }>;
};

export const TokenDetailBanner_PortkeyCardDocument = gql`
  query tokenDetailBanner_portkeyCard(
    $filter: tokenDetailBanner_filter
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
    $filter3: tokenDetailBanner_portkeyCard_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
    $filter4: tokenDetailBanner_filter
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
    $filter6: tokenDetailBanner_portkeyCard_filter
    $sort6: [String]
    $limit6: Int
    $offset6: Int
    $page6: Int
    $search6: String
  ) {
    tokenDetailBanner_portkeyCard(
      filter: $filter6
      sort: $sort6
      limit: $limit6
      offset: $offset6
      page: $page6
      search: $search6
    ) {
      id
      tokenDetailBanner_id(
        filter: $filter4
        sort: $sort4
        limit: $limit4
        offset: $offset4
        page: $page4
        search: $search4
      ) {
        id
        status
        chainId
        symbol
        items(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
          id
          tokenDetailBanner_id(
            filter: $filter
            sort: $sort
            limit: $limit
            offset: $offset
            page: $page
            search: $search
          ) {
            id
            status
            chainId
            symbol
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
 * __useTokenDetailBanner_PortkeyCardQuery__
 *
 * To run a query within a React component, call `useTokenDetailBanner_PortkeyCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenDetailBanner_PortkeyCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenDetailBanner_PortkeyCardQuery({
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
 *   },
 * });
 */
export function useTokenDetailBanner_PortkeyCardQuery(
  baseOptions?: Apollo.QueryHookOptions<
    TokenDetailBanner_PortkeyCardQuery,
    TokenDetailBanner_PortkeyCardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TokenDetailBanner_PortkeyCardQuery, TokenDetailBanner_PortkeyCardQueryVariables>(
    TokenDetailBanner_PortkeyCardDocument,
    options,
  );
}
export function useTokenDetailBanner_PortkeyCardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TokenDetailBanner_PortkeyCardQuery,
    TokenDetailBanner_PortkeyCardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TokenDetailBanner_PortkeyCardQuery, TokenDetailBanner_PortkeyCardQueryVariables>(
    TokenDetailBanner_PortkeyCardDocument,
    options,
  );
}
export type TokenDetailBanner_PortkeyCardQueryHookResult = ReturnType<typeof useTokenDetailBanner_PortkeyCardQuery>;
export type TokenDetailBanner_PortkeyCardLazyQueryHookResult = ReturnType<
  typeof useTokenDetailBanner_PortkeyCardLazyQuery
>;
export type TokenDetailBanner_PortkeyCardQueryResult = Apollo.QueryResult<
  TokenDetailBanner_PortkeyCardQuery,
  TokenDetailBanner_PortkeyCardQueryVariables
>;
