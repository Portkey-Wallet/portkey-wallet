import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DappListQueryVariables = Types.Exact<{ [key: string]: never }>;

export type DappListQuery = {
  __typename?: 'Query';
  dappList: Array<{ __typename?: 'dappList'; domainName?: string | null }>;
};

export const DappListDocument = gql`
  query dappList {
    dappList {
      domainName
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
