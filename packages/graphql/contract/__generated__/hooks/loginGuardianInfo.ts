import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginGuardianInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetLoginGuardianInfoDto>;
}>;

export type LoginGuardianInfoQuery = {
  __typename?: 'Query';
  loginGuardianInfo?: Array<{
    __typename?: 'LoginGuardianDto';
    id?: string | null;
    chainId?: string | null;
    caHash?: string | null;
    caAddress?: string | null;
    manager?: string | null;
    loginGuardian?: {
      __typename?: 'GuardianDto';
      type: number;
      verifierId?: string | null;
      identifierHash?: string | null;
      salt?: string | null;
      isLoginGuardian: boolean;
    } | null;
  } | null> | null;
};

export const LoginGuardianInfoDocument = gql`
  query loginGuardianInfo($dto: GetLoginGuardianInfoDto) {
    loginGuardianInfo(dto: $dto) {
      id
      chainId
      caHash
      caAddress
      manager
      loginGuardian {
        type
        verifierId
        identifierHash
        salt
        isLoginGuardian
      }
    }
  }
`;

/**
 * __useLoginGuardianInfoQuery__
 *
 * To run a query within a React component, call `useLoginGuardianInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginGuardianInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginGuardianInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useLoginGuardianInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginGuardianInfoQuery, LoginGuardianInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginGuardianInfoQuery, LoginGuardianInfoQueryVariables>(LoginGuardianInfoDocument, options);
}
export function useLoginGuardianInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginGuardianInfoQuery, LoginGuardianInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginGuardianInfoQuery, LoginGuardianInfoQueryVariables>(
    LoginGuardianInfoDocument,
    options,
  );
}
export type LoginGuardianInfoQueryHookResult = ReturnType<typeof useLoginGuardianInfoQuery>;
export type LoginGuardianInfoLazyQueryHookResult = ReturnType<typeof useLoginGuardianInfoLazyQuery>;
export type LoginGuardianInfoQueryResult = Apollo.QueryResult<LoginGuardianInfoQuery, LoginGuardianInfoQueryVariables>;
