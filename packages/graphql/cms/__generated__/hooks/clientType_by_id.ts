import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ClientType_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type ClientType_By_IdQuery = {
  __typename?: 'Query';
  clientType_by_id?: { __typename?: 'clientType'; id: string; name?: string | null } | null;
};

export const ClientType_By_IdDocument = gql`
  query clientType_by_id($id: ID!) {
    clientType_by_id(id: $id) {
      id
      name
    }
  }
`;

/**
 * __useClientType_By_IdQuery__
 *
 * To run a query within a React component, call `useClientType_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientType_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientType_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useClientType_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<ClientType_By_IdQuery, ClientType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClientType_By_IdQuery, ClientType_By_IdQueryVariables>(ClientType_By_IdDocument, options);
}
export function useClientType_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClientType_By_IdQuery, ClientType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClientType_By_IdQuery, ClientType_By_IdQueryVariables>(ClientType_By_IdDocument, options);
}
export type ClientType_By_IdQueryHookResult = ReturnType<typeof useClientType_By_IdQuery>;
export type ClientType_By_IdLazyQueryHookResult = ReturnType<typeof useClientType_By_IdLazyQuery>;
export type ClientType_By_IdQueryResult = Apollo.QueryResult<ClientType_By_IdQuery, ClientType_By_IdQueryVariables>;
