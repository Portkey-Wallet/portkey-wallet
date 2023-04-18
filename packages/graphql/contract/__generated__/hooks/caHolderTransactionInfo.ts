import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderTransactionInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderTransactionDto>;
}>;

export type CaHolderTransactionInfoQuery = {
  __typename?: 'Query';
  caHolderTransactionInfo?: {
    __typename?: 'CAHolderTransactionPageResultDto';
    totalRecordCount: number;
    data?: Array<{
      __typename?: 'CAHolderTransactionDto';
      id?: string | null;
      chainId?: string | null;
      blockHash?: string | null;
      blockHeight: number;
      previousBlockHash?: string | null;
      transactionId?: string | null;
      methodName?: string | null;
      status: Types.TransactionStatus;
      timestamp: number;
      fromAddress?: string | null;
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
      transferInfo?: {
        __typename?: 'TransferInfo';
        fromAddress?: string | null;
        fromCAAddress?: string | null;
        toAddress?: string | null;
        amount: number;
        fromChainId?: string | null;
        toChainId?: string | null;
        transferTransactionId?: string | null;
      } | null;
      transactionFees?: Array<{ __typename?: 'TransactionFee'; symbol?: string | null; amount: number } | null> | null;
    } | null> | null;
  } | null;
};

export const CaHolderTransactionInfoDocument = gql`
  query caHolderTransactionInfo($dto: GetCAHolderTransactionDto) {
    caHolderTransactionInfo(dto: $dto) {
      totalRecordCount
      data {
        id
        chainId
        blockHash
        blockHeight
        previousBlockHash
        transactionId
        methodName
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
        status
        timestamp
        transferInfo {
          fromAddress
          fromCAAddress
          toAddress
          amount
          fromChainId
          toChainId
          transferTransactionId
        }
        fromAddress
        transactionFees {
          symbol
          amount
        }
      }
    }
  }
`;

/**
 * __useCaHolderTransactionInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderTransactionInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderTransactionInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderTransactionInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderTransactionInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<CaHolderTransactionInfoQuery, CaHolderTransactionInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderTransactionInfoQuery, CaHolderTransactionInfoQueryVariables>(
    CaHolderTransactionInfoDocument,
    options,
  );
}
export function useCaHolderTransactionInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CaHolderTransactionInfoQuery, CaHolderTransactionInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderTransactionInfoQuery, CaHolderTransactionInfoQueryVariables>(
    CaHolderTransactionInfoDocument,
    options,
  );
}
export type CaHolderTransactionInfoQueryHookResult = ReturnType<typeof useCaHolderTransactionInfoQuery>;
export type CaHolderTransactionInfoLazyQueryHookResult = ReturnType<typeof useCaHolderTransactionInfoLazyQuery>;
export type CaHolderTransactionInfoQueryResult = Apollo.QueryResult<
  CaHolderTransactionInfoQuery,
  CaHolderTransactionInfoQueryVariables
>;
