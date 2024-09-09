import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginModeMatchQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.LoginModeMatch_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type LoginModeMatchQuery = {
  __typename?: 'Query';
  loginModeMatch: Array<{
    __typename?: 'loginModeMatch';
    description: string;
    id: string;
    matchRuleList: any;
    matchSwitch: boolean;
    status?: string | null;
    weight: any;
    matchRuleList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  }>;
};

export const LoginModeMatchDocument = gql`
  query loginModeMatch(
    $filter: loginModeMatch_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    loginModeMatch(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
`;

/**
 * __useLoginModeMatchQuery__
 *
 * To run a query within a React component, call `useLoginModeMatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginModeMatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginModeMatchQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useLoginModeMatchQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginModeMatchQuery, LoginModeMatchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginModeMatchQuery, LoginModeMatchQueryVariables>(LoginModeMatchDocument, options);
}
export function useLoginModeMatchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginModeMatchQuery, LoginModeMatchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginModeMatchQuery, LoginModeMatchQueryVariables>(LoginModeMatchDocument, options);
}
export type LoginModeMatchQueryHookResult = ReturnType<typeof useLoginModeMatchQuery>;
export type LoginModeMatchLazyQueryHookResult = ReturnType<typeof useLoginModeMatchLazyQuery>;
export type LoginModeMatchQueryResult = Apollo.QueryResult<LoginModeMatchQuery, LoginModeMatchQueryVariables>;
