import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginTypeQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.LoginType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type LoginTypeQuery = {
  __typename?: 'Query';
  loginType: Array<{ __typename?: 'loginType'; id: string; label: string; status?: string | null; value: string }>;
};

export const LoginTypeDocument = gql`
  query loginType($filter: loginType_filter, $sort: [String], $limit: Int, $offset: Int, $page: Int, $search: String) {
    loginType(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      id
      label
      status
      value
    }
  }
`;

/**
 * __useLoginTypeQuery__
 *
 * To run a query within a React component, call `useLoginTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginTypeQuery({
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
export function useLoginTypeQuery(baseOptions?: Apollo.QueryHookOptions<LoginTypeQuery, LoginTypeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginTypeQuery, LoginTypeQueryVariables>(LoginTypeDocument, options);
}
export function useLoginTypeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginTypeQuery, LoginTypeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginTypeQuery, LoginTypeQueryVariables>(LoginTypeDocument, options);
}
export type LoginTypeQueryHookResult = ReturnType<typeof useLoginTypeQuery>;
export type LoginTypeLazyQueryHookResult = ReturnType<typeof useLoginTypeLazyQuery>;
export type LoginTypeQueryResult = Apollo.QueryResult<LoginTypeQuery, LoginTypeQueryVariables>;
