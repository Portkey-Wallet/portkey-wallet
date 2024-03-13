import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderNftBalanceInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderNftInfoDto>;
}>;

export type CaHolderNftBalanceInfoQuery = {
  __typename?: 'Query';
  caHolderNFTBalanceInfo?: {
    __typename?: 'CAHolderNFTBalancePageResultDto';
    totalRecordCount: number;
    data?: Array<{
      __typename?: 'CAHolderNFTBalanceInfoDto';
      id?: string | null;
      chainId?: string | null;
      caAddress?: string | null;
      balance: number;
      nftInfo?: {
        __typename?: 'NFTItemInfoDto';
        symbol?: string | null;
        tokenContractAddress?: string | null;
        decimals: number;
        supply: number;
        totalSupply: number;
        tokenName?: string | null;
        issuer?: string | null;
        isBurnable: boolean;
        issueChainId: number;
        imageUrl?: string | null;
        collectionSymbol?: string | null;
        collectionName?: string | null;
      } | null;
    } | null> | null;
  } | null;
};

export const CaHolderNftBalanceInfoDocument = gql`
  query caHolderNFTBalanceInfo($dto: GetCAHolderNFTInfoDto) {
    caHolderNFTBalanceInfo(dto: $dto) {
      totalRecordCount
      data {
        id
        chainId
        caAddress
        balance
        nftInfo {
          symbol
          tokenContractAddress
          decimals
          supply
          totalSupply
          tokenName
          issuer
          isBurnable
          issueChainId
          imageUrl
          collectionSymbol
          collectionName
        }
      }
    }
  }
`;

/**
 * __useCaHolderNftBalanceInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderNftBalanceInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderNftBalanceInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderNftBalanceInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderNftBalanceInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<CaHolderNftBalanceInfoQuery, CaHolderNftBalanceInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderNftBalanceInfoQuery, CaHolderNftBalanceInfoQueryVariables>(
    CaHolderNftBalanceInfoDocument,
    options,
  );
}
export function useCaHolderNftBalanceInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CaHolderNftBalanceInfoQuery, CaHolderNftBalanceInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderNftBalanceInfoQuery, CaHolderNftBalanceInfoQueryVariables>(
    CaHolderNftBalanceInfoDocument,
    options,
  );
}
export type CaHolderNftBalanceInfoQueryHookResult = ReturnType<typeof useCaHolderNftBalanceInfoQuery>;
export type CaHolderNftBalanceInfoLazyQueryHookResult = ReturnType<typeof useCaHolderNftBalanceInfoLazyQuery>;
export type CaHolderNftBalanceInfoQueryResult = Apollo.QueryResult<
  CaHolderNftBalanceInfoQuery,
  CaHolderNftBalanceInfoQueryVariables
>;
