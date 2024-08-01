import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DappListQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.DappList_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type DappListQuery = {
  __typename?: 'Query';
  dappList: Array<{ __typename?: 'dappList'; Dapp_Name?: string | null; domainName?: string | null; id: string }>;
};

export const DappListDocument = gql`
  query dappList($filter: dappList_filter, $sort: [String], $limit: Int, $offset: Int, $page: Int, $search: String) {
    dappList(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      Dapp_Name
      domainName
      id
    }
  }
`;

/**
 * __useDappListQuery__
 *
 * To run a query within a React component, call `useDappListQuery` and pass it any options that fit your needs.
 * When your component renders, `useDappListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDappListQuery({
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
export function useDappListQuery(baseOptions?: Apollo.QueryHookOptions<DappListQuery, DappListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DappListQuery, DappListQueryVariables>(DappListDocument, options);
}
export function useDappListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DappListQuery, DappListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DappListQuery, DappListQueryVariables>(DappListDocument, options);
}
export type DappListQueryHookResult = ReturnType<typeof useDappListQuery>;
export type DappListLazyQueryHookResult = ReturnType<typeof useDappListLazyQuery>;
export type DappListQueryResult = Apollo.QueryResult<DappListQuery, DappListQueryVariables>;
