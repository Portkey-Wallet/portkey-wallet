import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ClientTypeQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.ClientType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type ClientTypeQuery = {
  __typename?: 'Query';
  clientType: Array<{ __typename?: 'clientType'; id: string; name?: string | null }>;
};

export const ClientTypeDocument = gql`
  query clientType(
    $filter: clientType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    clientType(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      id
      name
    }
  }
`;

/**
 * __useClientTypeQuery__
 *
 * To run a query within a React component, call `useClientTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientTypeQuery({
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
export function useClientTypeQuery(baseOptions?: Apollo.QueryHookOptions<ClientTypeQuery, ClientTypeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClientTypeQuery, ClientTypeQueryVariables>(ClientTypeDocument, options);
}
export function useClientTypeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClientTypeQuery, ClientTypeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClientTypeQuery, ClientTypeQueryVariables>(ClientTypeDocument, options);
}
export type ClientTypeQueryHookResult = ReturnType<typeof useClientTypeQuery>;
export type ClientTypeLazyQueryHookResult = ReturnType<typeof useClientTypeLazyQuery>;
export type ClientTypeQueryResult = Apollo.QueryResult<ClientTypeQuery, ClientTypeQueryVariables>;
