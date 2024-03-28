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
      loginModeMatch_id?: {
        __typename?: 'loginModeMatch';
        status?: string | null;
        weight: any;
        matchSwitch: boolean;
        matchRuleList: any;
        description: string;
      } | null;
    } | null> | null;
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
      matchList(filter: $filter5, sort: $sort5, limit: $limit5, offset: $offset5, page: $page5, search: $search5) {
        loginModeMatch_id {
          status
          weight
          matchSwitch
          matchRuleList
          description
        }
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
