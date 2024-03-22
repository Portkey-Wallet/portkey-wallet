import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginMode_LoginModeMatchQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.LoginType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.LoginMode_Filter>;
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
  filter5?: Types.InputMaybe<Types.LoginModeMatch_Filter>;
  sort5?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit5?: Types.InputMaybe<Types.Scalars['Int']>;
  offset5?: Types.InputMaybe<Types.Scalars['Int']>;
  page5?: Types.InputMaybe<Types.Scalars['Int']>;
  search5?: Types.InputMaybe<Types.Scalars['String']>;
  filter6?: Types.InputMaybe<Types.LoginMode_LoginModeMatch_Filter>;
  sort6?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit6?: Types.InputMaybe<Types.Scalars['Int']>;
  offset6?: Types.InputMaybe<Types.Scalars['Int']>;
  page6?: Types.InputMaybe<Types.Scalars['Int']>;
  search6?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type LoginMode_LoginModeMatchQuery = {
  __typename?: 'Query';
  loginMode_loginModeMatch: Array<{
    __typename?: 'loginMode_loginModeMatch';
    id: string;
    loginMode_id?: {
      __typename?: 'loginMode';
      id: string;
      status?: string | null;
      extensionIndex: any;
      iOSIndex: any;
      androidIndex: any;
      extensionRecommend: boolean;
      iOSRecommend: boolean;
      androidRecommend: boolean;
      defaultSwitch: boolean;
      type?: { __typename?: 'loginType'; id: string; status?: string | null; label: string; value: string } | null;
      matchList?: Array<{
        __typename?: 'loginMode_loginModeMatch';
        id: string;
        loginMode_id?: {
          __typename?: 'loginMode';
          id: string;
          status?: string | null;
          extensionIndex: any;
          iOSIndex: any;
          androidIndex: any;
          extensionRecommend: boolean;
          iOSRecommend: boolean;
          androidRecommend: boolean;
          defaultSwitch: boolean;
          matchList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
        } | null;
        loginModeMatch_id?: {
          __typename?: 'loginModeMatch';
          id: string;
          status?: string | null;
          weight: any;
          matchSwitch: boolean;
          matchRuleList: any;
          description: string;
          matchRuleList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
        } | null;
      } | null> | null;
    } | null;
    loginModeMatch_id?: {
      __typename?: 'loginModeMatch';
      id: string;
      status?: string | null;
      weight: any;
      matchSwitch: boolean;
      matchRuleList: any;
      description: string;
    } | null;
  }>;
};

export const LoginMode_LoginModeMatchDocument = gql`
  query loginMode_loginModeMatch(
    $filter: loginType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: loginMode_filter
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
    $filter5: loginModeMatch_filter
    $sort5: [String]
    $limit5: Int
    $offset5: Int
    $page5: Int
    $search5: String
    $filter6: loginMode_loginModeMatch_filter
    $sort6: [String]
    $limit6: Int
    $offset6: Int
    $page6: Int
    $search6: String
  ) {
    loginMode_loginModeMatch(
      filter: $filter6
      sort: $sort6
      limit: $limit6
      offset: $offset6
      page: $page6
      search: $search6
    ) {
      id
      loginMode_id(filter: $filter4, sort: $sort4, limit: $limit4, offset: $offset4, page: $page4, search: $search4) {
        id
        status
        extensionIndex
        iOSIndex
        androidIndex
        extensionRecommend
        iOSRecommend
        androidRecommend
        defaultSwitch
        type(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
          id
          status
          label
          value
        }
        matchList(filter: $filter3, sort: $sort3, limit: $limit3, offset: $offset3, page: $page3, search: $search3) {
          id
          loginMode_id(
            filter: $filter1
            sort: $sort1
            limit: $limit1
            offset: $offset1
            page: $page1
            search: $search1
          ) {
            id
            status
            extensionIndex
            iOSIndex
            androidIndex
            extensionRecommend
            iOSRecommend
            androidRecommend
            defaultSwitch
            matchList_func {
              count
            }
          }
          loginModeMatch_id(
            filter: $filter2
            sort: $sort2
            limit: $limit2
            offset: $offset2
            page: $page2
            search: $search2
          ) {
            id
            status
            weight
            matchSwitch
            matchRuleList
            matchRuleList_func {
              count
            }
            description
          }
        }
      }
      loginModeMatch_id(
        filter: $filter5
        sort: $sort5
        limit: $limit5
        offset: $offset5
        page: $page5
        search: $search5
      ) {
        id
        status
        weight
        matchSwitch
        matchRuleList
        description
      }
    }
  }
`;

/**
 * __useLoginMode_LoginModeMatchQuery__
 *
 * To run a query within a React component, call `useLoginMode_LoginModeMatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginMode_LoginModeMatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginMode_LoginModeMatchQuery({
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
export function useLoginMode_LoginModeMatchQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginMode_LoginModeMatchQuery, LoginMode_LoginModeMatchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginMode_LoginModeMatchQuery, LoginMode_LoginModeMatchQueryVariables>(
    LoginMode_LoginModeMatchDocument,
    options,
  );
}
export function useLoginMode_LoginModeMatchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginMode_LoginModeMatchQuery, LoginMode_LoginModeMatchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginMode_LoginModeMatchQuery, LoginMode_LoginModeMatchQueryVariables>(
    LoginMode_LoginModeMatchDocument,
    options,
  );
}
export type LoginMode_LoginModeMatchQueryHookResult = ReturnType<typeof useLoginMode_LoginModeMatchQuery>;
export type LoginMode_LoginModeMatchLazyQueryHookResult = ReturnType<typeof useLoginMode_LoginModeMatchLazyQuery>;
export type LoginMode_LoginModeMatchQueryResult = Apollo.QueryResult<
  LoginMode_LoginModeMatchQuery,
  LoginMode_LoginModeMatchQueryVariables
>;
