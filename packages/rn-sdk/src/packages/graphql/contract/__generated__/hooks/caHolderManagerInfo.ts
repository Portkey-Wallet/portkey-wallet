import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderManagerInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderManagerInfoDto>;
}>;

export type CaHolderManagerInfoQuery = {
  __typename?: 'Query';
  caHolderManagerInfo?: Array<{
    __typename?: 'CAHolderManagerDto';
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
  } | null> | null;
};

export const CaHolderManagerInfoDocument = gql`
  query caHolderManagerInfo($dto: GetCAHolderManagerInfoDto) {
    caHolderManagerInfo(dto: $dto) {
      id
      chainId
      caHash
      caAddress
      managerInfos {
        address
        extraData
      }
      originChainId
    }
  }
`;

/**
 * __useCaHolderManagerInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderManagerInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderManagerInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderManagerInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderManagerInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<CaHolderManagerInfoQuery, CaHolderManagerInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderManagerInfoQuery, CaHolderManagerInfoQueryVariables>(
    CaHolderManagerInfoDocument,
    options,
  );
}
export function useCaHolderManagerInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CaHolderManagerInfoQuery, CaHolderManagerInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderManagerInfoQuery, CaHolderManagerInfoQueryVariables>(
    CaHolderManagerInfoDocument,
    options,
  );
}
export type CaHolderManagerInfoQueryHookResult = ReturnType<typeof useCaHolderManagerInfoQuery>;
export type CaHolderManagerInfoLazyQueryHookResult = ReturnType<typeof useCaHolderManagerInfoLazyQuery>;
export type CaHolderManagerInfoQueryResult = Apollo.QueryResult<
  CaHolderManagerInfoQuery,
  CaHolderManagerInfoQueryVariables
>;
