import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginType_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type LoginType_By_IdQuery = {
  __typename?: 'Query';
  loginType_by_id?: {
    __typename?: 'loginType';
    id: string;
    label: string;
    status?: string | null;
    value: string;
  } | null;
};

export const LoginType_By_IdDocument = gql`
  query loginType_by_id($id: ID!) {
    loginType_by_id(id: $id) {
      id
      label
      status
      value
    }
  }
`;

/**
 * __useLoginType_By_IdQuery__
 *
 * To run a query within a React component, call `useLoginType_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginType_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginType_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLoginType_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<LoginType_By_IdQuery, LoginType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginType_By_IdQuery, LoginType_By_IdQueryVariables>(LoginType_By_IdDocument, options);
}
export function useLoginType_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginType_By_IdQuery, LoginType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginType_By_IdQuery, LoginType_By_IdQueryVariables>(LoginType_By_IdDocument, options);
}
export type LoginType_By_IdQueryHookResult = ReturnType<typeof useLoginType_By_IdQuery>;
export type LoginType_By_IdLazyQueryHookResult = ReturnType<typeof useLoginType_By_IdLazyQuery>;
export type LoginType_By_IdQueryResult = Apollo.QueryResult<LoginType_By_IdQuery, LoginType_By_IdQueryVariables>;
