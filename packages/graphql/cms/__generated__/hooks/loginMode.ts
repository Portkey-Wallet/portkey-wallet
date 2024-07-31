import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginModeQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.LoginType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.LoginType_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  filter2?: Types.InputMaybe<Types.LoginModeMatch_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
  filter3?: Types.InputMaybe<Types.LoginMode_LoginModeMatch_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
  filter4?: Types.InputMaybe<Types.LoginMode_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  filter5?: Types.InputMaybe<Types.LoginMode_LoginModeMatch_Filter>;
  sort5?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit5?: Types.InputMaybe<Types.Scalars['Int']>;
  offset5?: Types.InputMaybe<Types.Scalars['Int']>;
  page5?: Types.InputMaybe<Types.Scalars['Int']>;
  search5?: Types.InputMaybe<Types.Scalars['String']>;
  filter6?: Types.InputMaybe<Types.LoginMode_Filter>;
  sort6?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit6?: Types.InputMaybe<Types.Scalars['Int']>;
  offset6?: Types.InputMaybe<Types.Scalars['Int']>;
  page6?: Types.InputMaybe<Types.Scalars['Int']>;
  search6?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type LoginModeQuery = {
  __typename?: 'Query';
  loginMode: Array<{
    __typename?: 'loginMode';
    androidIndex: any;
    androidRecommend: boolean;
    defaultSwitch: boolean;
    extensionIndex: any;
    extensionRecommend: boolean;
    id: string;
    iOSIndex: any;
    iOSRecommend: boolean;
    status?: string | null;
    type?: { __typename?: 'loginType'; id: string; label: string; status?: string | null; value: string } | null;
    matchList?: Array<{
      __typename?: 'loginMode_loginModeMatch';
      id: string;
      loginMode_id?: {
        __typename?: 'loginMode';
        androidIndex: any;
        androidRecommend: boolean;
        defaultSwitch: boolean;
        extensionIndex: any;
        extensionRecommend: boolean;
        id: string;
        iOSIndex: any;
        iOSRecommend: boolean;
        status?: string | null;
        type?: { __typename?: 'loginType'; id: string; label: string; status?: string | null; value: string } | null;
        matchList?: Array<{
          __typename?: 'loginMode_loginModeMatch';
          id: string;
          loginModeMatch_id?: {
            __typename?: 'loginModeMatch';
            description: string;
            id: string;
            matchRuleList: any;
            matchSwitch: boolean;
            status?: string | null;
            weight: any;
            matchRuleList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
          } | null;
        } | null> | null;
        matchList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
      } | null;
    } | null> | null;
    matchList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  }>;
};

export const LoginModeDocument = gql`
  query loginMode(
    $filter: loginType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: loginType_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $filter2: loginModeMatch_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
    $filter3: loginMode_loginModeMatch_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
    $filter4: loginMode_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $filter5: loginMode_loginModeMatch_filter
    $sort5: [String]
    $limit5: Int
    $offset5: Int
    $page5: Int
    $search5: String
    $filter6: loginMode_filter
    $sort6: [String]
    $limit6: Int
    $offset6: Int
    $page6: Int
    $search6: String
  ) {
    loginMode(filter: $filter6, sort: $sort6, limit: $limit6, offset: $offset6, page: $page6, search: $search6) {
      androidIndex
      androidRecommend
      defaultSwitch
      extensionIndex
      extensionRecommend
      id
      iOSIndex
      iOSRecommend
      status
      type(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
        id
        label
        status
        value
      }
      matchList(filter: $filter5, sort: $sort5, limit: $limit5, offset: $offset5, page: $page5, search: $search5) {
        id
        loginMode_id(filter: $filter4, sort: $sort4, limit: $limit4, offset: $offset4, page: $page4, search: $search4) {
          androidIndex
          androidRecommend
          defaultSwitch
          extensionIndex
          extensionRecommend
          id
          iOSIndex
          iOSRecommend
          status
          type(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
            id
            label
            status
            value
          }
          matchList(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
            id
            loginModeMatch_id(
              filter: $filter2
              sort: $sort2
              limit: $limit2
              offset: $offset2
              page: $page2
              search: $search2
            ) {
              description
              id
              matchRuleList
              matchRuleList_func {
                count
              }
              matchSwitch
              status
              weight
            }
          }
          matchList_func {
            count
          }
        }
      }
      matchList_func {
        count
      }
    }
  }
`;

/**
 * __useLoginModeQuery__
 *
 * To run a query within a React component, call `useLoginModeQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginModeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginModeQuery({
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
export function useLoginModeQuery(baseOptions?: Apollo.QueryHookOptions<LoginModeQuery, LoginModeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginModeQuery, LoginModeQueryVariables>(LoginModeDocument, options);
}
export function useLoginModeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginModeQuery, LoginModeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginModeQuery, LoginModeQueryVariables>(LoginModeDocument, options);
}
export type LoginModeQueryHookResult = ReturnType<typeof useLoginModeQuery>;
export type LoginModeLazyQueryHookResult = ReturnType<typeof useLoginModeLazyQuery>;
export type LoginModeQueryResult = Apollo.QueryResult<LoginModeQuery, LoginModeQueryVariables>;
