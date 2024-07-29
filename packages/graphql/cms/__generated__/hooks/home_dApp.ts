import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Home_DAppQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Home_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.Home_DApp_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  filter2?: Types.InputMaybe<Types.Home_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
  filter3?: Types.InputMaybe<Types.Home_DApp_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type Home_DAppQuery = {
  __typename?: 'Query';
  home_dApp: Array<{
    __typename?: 'home_dApp';
    dApp_id?: number | null;
    id: string;
    home_id?: {
      __typename?: 'home';
      dAppSectionTitle?: string | null;
      date_updated?: any | null;
      focusImage?: string | null;
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
      dAppList?: Array<{
        __typename?: 'home_dApp';
        dApp_id?: number | null;
        id: string;
        home_id?: {
          __typename?: 'home';
          dAppSectionTitle?: string | null;
          date_updated?: any | null;
          focusImage?: string | null;
          id: string;
          user_updated?: string | null;
          videoContent?: string | null;
          videoTitle?: string | null;
          videoUrl?: string | null;
          dAppList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
        } | null;
      } | null> | null;
    } | null;
  }>;
};

export const Home_DAppDocument = gql`
  query home_dApp(
    $filter: home_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: home_dApp_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $filter2: home_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
    $filter3: home_dApp_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
  ) {
    home_dApp(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
      dApp_id
      home_id(filter: $filter2, sort: $sort2, limit: $limit2, offset: $offset2, page: $page2, search: $search2) {
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
        focusImage
        id
        user_updated
        videoContent
        videoTitle
        videoUrl
        dAppList(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
          dApp_id
          home_id(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
            dAppSectionTitle
            date_updated
            focusImage
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
 * __useHome_DAppQuery__
 *
 * To run a query within a React component, call `useHome_DAppQuery` and pass it any options that fit your needs.
 * When your component renders, `useHome_DAppQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHome_DAppQuery({
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
 *   },
 * });
 */
export function useHome_DAppQuery(baseOptions?: Apollo.QueryHookOptions<Home_DAppQuery, Home_DAppQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Home_DAppQuery, Home_DAppQueryVariables>(Home_DAppDocument, options);
}
export function useHome_DAppLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Home_DAppQuery, Home_DAppQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Home_DAppQuery, Home_DAppQueryVariables>(Home_DAppDocument, options);
}
export type Home_DAppQueryHookResult = ReturnType<typeof useHome_DAppQuery>;
export type Home_DAppLazyQueryHookResult = ReturnType<typeof useHome_DAppLazyQuery>;
export type Home_DAppQueryResult = Apollo.QueryResult<Home_DAppQuery, Home_DAppQueryVariables>;
