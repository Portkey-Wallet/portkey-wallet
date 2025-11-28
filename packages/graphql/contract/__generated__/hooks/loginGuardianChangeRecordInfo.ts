import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginGuardianChangeRecordInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetLoginGuardianChangeRecordDto>;
}>;

export type LoginGuardianChangeRecordInfoQuery = {
  __typename?: 'Query';
  loginGuardianChangeRecordInfo?: Array<{
    __typename?: 'LoginGuardianChangeRecordDto';
    changeType?: string | null;
    blockHeight: number;
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

export const LoginGuardianChangeRecordInfoDocument = gql`
  query loginGuardianChangeRecordInfo($dto: GetLoginGuardianChangeRecordDto) {
    loginGuardianChangeRecordInfo(dto: $dto) {
      changeType
      blockHeight
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
 * __useLoginGuardianChangeRecordInfoQuery__
 *
 * To run a query within a React component, call `useLoginGuardianChangeRecordInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginGuardianChangeRecordInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginGuardianChangeRecordInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useLoginGuardianChangeRecordInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoginGuardianChangeRecordInfoQuery,
    LoginGuardianChangeRecordInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginGuardianChangeRecordInfoQuery, LoginGuardianChangeRecordInfoQueryVariables>(
    LoginGuardianChangeRecordInfoDocument,
    options,
  );
}
export function useLoginGuardianChangeRecordInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoginGuardianChangeRecordInfoQuery,
    LoginGuardianChangeRecordInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginGuardianChangeRecordInfoQuery, LoginGuardianChangeRecordInfoQueryVariables>(
    LoginGuardianChangeRecordInfoDocument,
    options,
  );
}
export type LoginGuardianChangeRecordInfoQueryHookResult = ReturnType<typeof useLoginGuardianChangeRecordInfoQuery>;
export type LoginGuardianChangeRecordInfoLazyQueryHookResult = ReturnType<
  typeof useLoginGuardianChangeRecordInfoLazyQuery
>;
export type LoginGuardianChangeRecordInfoQueryResult = Apollo.QueryResult<
  LoginGuardianChangeRecordInfoQuery,
  LoginGuardianChangeRecordInfoQueryVariables
>;
