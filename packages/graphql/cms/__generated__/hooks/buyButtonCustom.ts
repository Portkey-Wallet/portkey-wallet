import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BuyButtonCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type BuyButtonCustomQuery = {
  __typename?: 'Query';
  buyButton?: {
    __typename?: 'buyButton';
    id: string;
    isAndroidBuyShow?: boolean | null;
    isAndroidSellShow?: boolean | null;
    isExtensionBuyShow?: boolean | null;
    isExtensionSellShow?: boolean | null;
    isIOSBuyShow?: boolean | null;
    isIOSSellShow?: boolean | null;
    status?: string | null;
  } | null;
};

export const BuyButtonCustomDocument = gql`
  query buyButtonCustom {
    buyButton {
      id
      isAndroidBuyShow
      isAndroidSellShow
      isExtensionBuyShow
      isExtensionSellShow
      isIOSBuyShow
      isIOSSellShow
      status
    }
  }
`;

/**
 * __useBuyButtonCustomQuery__
 *
 * To run a query within a React component, call `useBuyButtonCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useBuyButtonCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBuyButtonCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useBuyButtonCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<BuyButtonCustomQuery, BuyButtonCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BuyButtonCustomQuery, BuyButtonCustomQueryVariables>(BuyButtonCustomDocument, options);
}
export function useBuyButtonCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<BuyButtonCustomQuery, BuyButtonCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BuyButtonCustomQuery, BuyButtonCustomQueryVariables>(BuyButtonCustomDocument, options);
}
export type BuyButtonCustomQueryHookResult = ReturnType<typeof useBuyButtonCustomQuery>;
export type BuyButtonCustomLazyQueryHookResult = ReturnType<typeof useBuyButtonCustomLazyQuery>;
export type BuyButtonCustomQueryResult = Apollo.QueryResult<BuyButtonCustomQuery, BuyButtonCustomQueryVariables>;
