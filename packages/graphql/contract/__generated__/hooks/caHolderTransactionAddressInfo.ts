import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderTransactionAddressInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderTransactionAddressDto>;
}>;

export type CaHolderTransactionAddressInfoQuery = {
  __typename?: 'Query';
  caHolderTransactionAddressInfo?: {
    __typename?: 'CAHolderTransactionAddressPageResultDto';
    totalRecordCount: number;
    data?: Array<{
      __typename?: 'CAHolderTransactionAddressDto';
      chainId?: string | null;
      caAddress?: string | null;
      address?: string | null;
      addressChainId?: string | null;
      transactionTime: number;
    } | null> | null;
  } | null;
};

export const CaHolderTransactionAddressInfoDocument = gql`
  query caHolderTransactionAddressInfo($dto: GetCAHolderTransactionAddressDto) {
    caHolderTransactionAddressInfo(dto: $dto) {
      totalRecordCount
      data {
        chainId
        caAddress
        address
        addressChainId
        transactionTime
      }
    }
  }
`;

/**
 * __useCaHolderTransactionAddressInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderTransactionAddressInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderTransactionAddressInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderTransactionAddressInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderTransactionAddressInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CaHolderTransactionAddressInfoQuery,
    CaHolderTransactionAddressInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderTransactionAddressInfoQuery, CaHolderTransactionAddressInfoQueryVariables>(
    CaHolderTransactionAddressInfoDocument,
    options,
  );
}
export function useCaHolderTransactionAddressInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CaHolderTransactionAddressInfoQuery,
    CaHolderTransactionAddressInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderTransactionAddressInfoQuery, CaHolderTransactionAddressInfoQueryVariables>(
    CaHolderTransactionAddressInfoDocument,
    options,
  );
}
export type CaHolderTransactionAddressInfoQueryHookResult = ReturnType<typeof useCaHolderTransactionAddressInfoQuery>;
export type CaHolderTransactionAddressInfoLazyQueryHookResult = ReturnType<
  typeof useCaHolderTransactionAddressInfoLazyQuery
>;
export type CaHolderTransactionAddressInfoQueryResult = Apollo.QueryResult<
  CaHolderTransactionAddressInfoQuery,
  CaHolderTransactionAddressInfoQueryVariables
>;
