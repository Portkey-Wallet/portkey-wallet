import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TokenInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetTokenInfoDto>;
}>;

export type TokenInfoQuery = {
  __typename?: 'Query';
  tokenInfo?: Array<{
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
  } | null> | null;
};

export const TokenInfoDocument = gql`
  query tokenInfo($dto: GetTokenInfoDto) {
    tokenInfo(dto: $dto) {
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
  }
`;

/**
 * __useTokenInfoQuery__
 *
 * To run a query within a React component, call `useTokenInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useTokenInfoQuery(baseOptions?: Apollo.QueryHookOptions<TokenInfoQuery, TokenInfoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TokenInfoQuery, TokenInfoQueryVariables>(TokenInfoDocument, options);
}
export function useTokenInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TokenInfoQuery, TokenInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TokenInfoQuery, TokenInfoQueryVariables>(TokenInfoDocument, options);
}
export type TokenInfoQueryHookResult = ReturnType<typeof useTokenInfoQuery>;
export type TokenInfoLazyQueryHookResult = ReturnType<typeof useTokenInfoLazyQuery>;
export type TokenInfoQueryResult = Apollo.QueryResult<TokenInfoQuery, TokenInfoQueryVariables>;
