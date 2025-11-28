import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderTokenBalanceInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderTokenBalanceDto>;
}>;

export type CaHolderTokenBalanceInfoQuery = {
  __typename?: 'Query';
  caHolderTokenBalanceInfo?: {
    __typename?: 'CAHolderTokenBalancePageResultDto';
    totalRecordCount: number;
    data?: Array<{
      __typename?: 'CAHolderTokenBalanceDto';
      chainId?: string | null;
      caAddress?: string | null;
      balance: number;
      tokenIds?: Array<number> | null;
      tokenInfo?: {
        __typename?: 'TokenInfoDto';
        id?: string | null;
        chainId?: string | null;
        blockHash?: string | null;
        blockHeight: number;
        previousBlockHash?: string | null;
        symbol?: string | null;
        type: Types.TokenType;
        tokenContractAddress?: string | null;
        decimals: number;
        totalSupply: number;
        tokenName?: string | null;
        issuer?: string | null;
        isBurnable: boolean;
        issueChainId: number;
      } | null;
    } | null> | null;
  } | null;
};

export const CaHolderTokenBalanceInfoDocument = gql`
  query caHolderTokenBalanceInfo($dto: GetCAHolderTokenBalanceDto) {
    caHolderTokenBalanceInfo(dto: $dto) {
      totalRecordCount
      data {
        chainId
        caAddress
        tokenInfo {
          id
          chainId
          blockHash
          blockHeight
          previousBlockHash
          symbol
          type
          tokenContractAddress
          decimals
          totalSupply
          tokenName
          issuer
          isBurnable
          issueChainId
        }
        balance
        tokenIds
      }
    }
  }
`;

/**
 * __useCaHolderTokenBalanceInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderTokenBalanceInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderTokenBalanceInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderTokenBalanceInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderTokenBalanceInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<CaHolderTokenBalanceInfoQuery, CaHolderTokenBalanceInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderTokenBalanceInfoQuery, CaHolderTokenBalanceInfoQueryVariables>(
    CaHolderTokenBalanceInfoDocument,
    options,
  );
}
export function useCaHolderTokenBalanceInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CaHolderTokenBalanceInfoQuery, CaHolderTokenBalanceInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderTokenBalanceInfoQuery, CaHolderTokenBalanceInfoQueryVariables>(
    CaHolderTokenBalanceInfoDocument,
    options,
  );
}
export type CaHolderTokenBalanceInfoQueryHookResult = ReturnType<typeof useCaHolderTokenBalanceInfoQuery>;
export type CaHolderTokenBalanceInfoLazyQueryHookResult = ReturnType<typeof useCaHolderTokenBalanceInfoLazyQuery>;
export type CaHolderTokenBalanceInfoQueryResult = Apollo.QueryResult<
  CaHolderTokenBalanceInfoQuery,
  CaHolderTokenBalanceInfoQueryVariables
>;
