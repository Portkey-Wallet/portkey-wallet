import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DappList_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type DappList_By_IdQuery = {
  __typename?: 'Query';
  dappList_by_id?: {
    __typename?: 'dappList';
    Dapp_Name?: string | null;
    domainName?: string | null;
    id: string;
  } | null;
};

export const DappList_By_IdDocument = gql`
  query dappList_by_id($id: ID!) {
    dappList_by_id(id: $id) {
      Dapp_Name
      domainName
      id
    }
  }
`;

/**
 * __useDappList_By_IdQuery__
 *
 * To run a query within a React component, call `useDappList_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDappList_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDappList_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDappList_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<DappList_By_IdQuery, DappList_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DappList_By_IdQuery, DappList_By_IdQueryVariables>(DappList_By_IdDocument, options);
}
export function useDappList_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DappList_By_IdQuery, DappList_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DappList_By_IdQuery, DappList_By_IdQueryVariables>(DappList_By_IdDocument, options);
}
export type DappList_By_IdQueryHookResult = ReturnType<typeof useDappList_By_IdQuery>;
export type DappList_By_IdLazyQueryHookResult = ReturnType<typeof useDappList_By_IdLazyQuery>;
export type DappList_By_IdQueryResult = Apollo.QueryResult<DappList_By_IdQuery, DappList_By_IdQueryVariables>;
