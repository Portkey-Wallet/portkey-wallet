import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderTransactionQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderTransactionDto>;
}>;

export type CaHolderTransactionQuery = {
  __typename?: 'Query';
  caHolderTransaction?: {
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

export const CaHolderTransactionDocument = gql`
  query caHolderTransaction($dto: GetCAHolderTransactionDto) {
    caHolderTransaction(dto: $dto) {
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
 * __useCaHolderTransactionQuery__
 *
 * To run a query within a React component, call `useCaHolderTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderTransactionQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderTransactionQuery(
  baseOptions?: Apollo.QueryHookOptions<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>(
    CaHolderTransactionDocument,
    options,
  );
}
export function useCaHolderTransactionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>(
    CaHolderTransactionDocument,
    options,
  );
}
export type CaHolderTransactionQueryHookResult = ReturnType<typeof useCaHolderTransactionQuery>;
export type CaHolderTransactionLazyQueryHookResult = ReturnType<typeof useCaHolderTransactionLazyQuery>;
export type CaHolderTransactionQueryResult = Apollo.QueryResult<
  CaHolderTransactionQuery,
  CaHolderTransactionQueryVariables
>;
