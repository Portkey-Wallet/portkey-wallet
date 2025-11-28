import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderNftCollectionBalanceInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderNftCollectionInfoDto>;
}>;

export type CaHolderNftCollectionBalanceInfoQuery = {
  __typename?: 'Query';
  caHolderNFTCollectionBalanceInfo?: {
    __typename?: 'CAHolderNFTCollectionBalancePageResultDto';
    totalRecordCount: number;
    data?: Array<{
      __typename?: 'CAHolderNFTCollectionBalanceInfoDto';
      id?: string | null;
      chainId?: string | null;
      caAddress?: string | null;
      tokenIds?: Array<number> | null;
      nftCollectionInfo?: {
        __typename?: 'NFTCollectionDto';
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
      } | null;
    } | null> | null;
  } | null;
};

export const CaHolderNftCollectionBalanceInfoDocument = gql`
  query caHolderNFTCollectionBalanceInfo($dto: GetCAHolderNFTCollectionInfoDto) {
    caHolderNFTCollectionBalanceInfo(dto: $dto) {
      totalRecordCount
      data {
        id
        chainId
        caAddress
        tokenIds
        nftCollectionInfo {
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
        }
      }
    }
  }
`;

/**
 * __useCaHolderNftCollectionBalanceInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderNftCollectionBalanceInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderNftCollectionBalanceInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderNftCollectionBalanceInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderNftCollectionBalanceInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CaHolderNftCollectionBalanceInfoQuery,
    CaHolderNftCollectionBalanceInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderNftCollectionBalanceInfoQuery, CaHolderNftCollectionBalanceInfoQueryVariables>(
    CaHolderNftCollectionBalanceInfoDocument,
    options,
  );
}
export function useCaHolderNftCollectionBalanceInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CaHolderNftCollectionBalanceInfoQuery,
    CaHolderNftCollectionBalanceInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderNftCollectionBalanceInfoQuery, CaHolderNftCollectionBalanceInfoQueryVariables>(
    CaHolderNftCollectionBalanceInfoDocument,
    options,
  );
}
export type CaHolderNftCollectionBalanceInfoQueryHookResult = ReturnType<
  typeof useCaHolderNftCollectionBalanceInfoQuery
>;
export type CaHolderNftCollectionBalanceInfoLazyQueryHookResult = ReturnType<
  typeof useCaHolderNftCollectionBalanceInfoLazyQuery
>;
export type CaHolderNftCollectionBalanceInfoQueryResult = Apollo.QueryResult<
  CaHolderNftCollectionBalanceInfoQuery,
  CaHolderNftCollectionBalanceInfoQueryVariables
>;
