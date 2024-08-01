import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HomeBannerQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Directus_Files_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.CardType_Filter>;
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
  filter3?: Types.InputMaybe<Types.HomeBanner_PortkeyCard_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
  filter4?: Types.InputMaybe<Types.HomeBanner_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  filter5?: Types.InputMaybe<Types.HomeBanner_PortkeyCard_Filter>;
  sort5?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit5?: Types.InputMaybe<Types.Scalars['Int']>;
  offset5?: Types.InputMaybe<Types.Scalars['Int']>;
  page5?: Types.InputMaybe<Types.Scalars['Int']>;
  search5?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type HomeBannerQuery = {
  __typename?: 'Query';
  homeBanner?: {
    __typename?: 'homeBanner';
    id: string;
    status?: string | null;
    items?: Array<{
      __typename?: 'homeBanner_portkeyCard';
      id: string;
      homeBanner_id?: {
        __typename?: 'homeBanner';
        id: string;
        status?: string | null;
        items?: Array<{
          __typename?: 'homeBanner_portkeyCard';
          id: string;
          portkeyCard_id?: {
            __typename?: 'portkeyCard';
            appLink?: string | null;
            buttonTitle?: string | null;
            description?: string | null;
            extensionLink?: string | null;
            id: string;
            index?: any | null;
            status?: string | null;
            title?: string | null;
            url?: string | null;
            value?: string | null;
            imgUrl?: {
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
            type?: {
              __typename?: 'cardType';
              id: string;
              label?: string | null;
              status?: string | null;
              value?: string | null;
            } | null;
          } | null;
        } | null> | null;
        items_func?: { __typename?: 'count_functions'; count?: number | null } | null;
      } | null;
    } | null> | null;
    items_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  } | null;
};

export const HomeBannerDocument = gql`
  query homeBanner(
    $filter: directus_files_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: cardType_filter
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
    $filter3: homeBanner_portkeyCard_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
    $filter4: homeBanner_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $filter5: homeBanner_portkeyCard_filter
    $sort5: [String]
    $limit5: Int
    $offset5: Int
    $page5: Int
    $search5: String
  ) {
    homeBanner {
      id
      status
      items(filter: $filter5, sort: $sort5, limit: $limit5, offset: $offset5, page: $page5, search: $search5) {
        homeBanner_id(
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
            portkeyCard_id(
              filter: $filter2
              sort: $sort2
              limit: $limit2
              offset: $offset2
              page: $page2
              search: $search2
            ) {
              appLink
              buttonTitle
              description
              extensionLink
              id
              imgUrl(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
              index
              status
              title
              type(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
                id
                label
                status
                value
              }
              url
              value
            }
          }
          items_func {
            count
          }
        }
        id
      }
      items_func {
        count
      }
    }
  }
`;

/**
 * __useHomeBannerQuery__
 *
 * To run a query within a React component, call `useHomeBannerQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeBannerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeBannerQuery({
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
 *   },
 * });
 */
export function useHomeBannerQuery(baseOptions?: Apollo.QueryHookOptions<HomeBannerQuery, HomeBannerQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HomeBannerQuery, HomeBannerQueryVariables>(HomeBannerDocument, options);
}
export function useHomeBannerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<HomeBannerQuery, HomeBannerQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HomeBannerQuery, HomeBannerQueryVariables>(HomeBannerDocument, options);
}
export type HomeBannerQueryHookResult = ReturnType<typeof useHomeBannerQuery>;
export type HomeBannerLazyQueryHookResult = ReturnType<typeof useHomeBannerLazyQuery>;
export type HomeBannerQueryResult = Apollo.QueryResult<HomeBannerQuery, HomeBannerQueryVariables>;
