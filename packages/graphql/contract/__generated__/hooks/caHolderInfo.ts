import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderInfoDto>;
}>;

export type CaHolderInfoQuery = {
  __typename?: 'Query';
  caHolderInfo?: Array<{
    __typename?: 'CAHolderInfoDto';
    id?: string | null;
    chainId?: string | null;
    caHash?: string | null;
    caAddress?: string | null;
    originChainId?: string | null;
    managerInfos?: Array<{
      __typename?: 'ManagerInfo';
      address?: string | null;
      extraData?: string | null;
    } | null> | null;
    guardianList?: {
      __typename?: 'GuardianList';
      guardians?: Array<{
        __typename?: 'Guardian';
        type: number;
        verifierId?: string | null;
        identifierHash?: string | null;
        salt?: string | null;
        isLoginGuardian: boolean;
      } | null> | null;
    } | null;
  } | null> | null;
};

export const CaHolderInfoDocument = gql`
  query caHolderInfo($dto: GetCAHolderInfoDto) {
    caHolderInfo(dto: $dto) {
      id
      chainId
      caHash
      caAddress
      managerInfos {
        address
        extraData
      }
      originChainId
      guardianList {
        guardians {
          type
          verifierId
          identifierHash
          salt
          isLoginGuardian
        }
      }
    }
  }
`;

/**
 * __useCaHolderInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<CaHolderInfoQuery, CaHolderInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderInfoQuery, CaHolderInfoQueryVariables>(CaHolderInfoDocument, options);
}
export function useCaHolderInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CaHolderInfoQuery, CaHolderInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderInfoQuery, CaHolderInfoQueryVariables>(CaHolderInfoDocument, options);
}
export type CaHolderInfoQueryHookResult = ReturnType<typeof useCaHolderInfoQuery>;
export type CaHolderInfoLazyQueryHookResult = ReturnType<typeof useCaHolderInfoLazyQuery>;
export type CaHolderInfoQueryResult = Apollo.QueryResult<CaHolderInfoQuery, CaHolderInfoQueryVariables>;
