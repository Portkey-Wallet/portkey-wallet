import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BuyButtonQueryVariables = Types.Exact<{ [key: string]: never }>;

export type BuyButtonQuery = {
  __typename?: 'Query';
  buyButton?: {
    __typename?: 'buyButton';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    isAndroidBuyShow?: boolean | null;
    isAndroidSellShow?: boolean | null;
    isBuySectionShow?: boolean | null;
    isExtensionBuyShow?: boolean | null;
    isExtensionSellShow?: boolean | null;
    isIOSBuyShow?: boolean | null;
    isIOSSellShow?: boolean | null;
    isSellSectionShow?: boolean | null;
    status?: string | null;
    user_created?: string | null;
    user_updated?: string | null;
    date_created_func?: {
      __typename?: 'datetime_functions';
      year?: number | null;
      month?: number | null;
      week?: number | null;
      day?: number | null;
      weekday?: number | null;
      hour?: number | null;
      minute?: number | null;
      second?: number | null;
    } | null;
    date_updated_func?: {
      __typename?: 'datetime_functions';
      year?: number | null;
      month?: number | null;
      week?: number | null;
      day?: number | null;
      weekday?: number | null;
      hour?: number | null;
      minute?: number | null;
      second?: number | null;
    } | null;
  } | null;
};

export const BuyButtonDocument = gql`
  query buyButton {
    buyButton {
      date_created
      date_created_func {
        year
        month
        week
        day
        weekday
        hour
        minute
        second
      }
      date_updated
      date_updated_func {
        year
        month
        week
        day
        weekday
        hour
        minute
        second
      }
      id
      isAndroidBuyShow
      isAndroidSellShow
      isBuySectionShow
      isExtensionBuyShow
      isExtensionSellShow
      isIOSBuyShow
      isIOSSellShow
      isSellSectionShow
      status
      user_created
      user_updated
    }
  }
`;

/**
 * __useBuyButtonQuery__
 *
 * To run a query within a React component, call `useBuyButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useBuyButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBuyButtonQuery({
 *   variables: {
 *   },
 * });
 */
export function useBuyButtonQuery(baseOptions?: Apollo.QueryHookOptions<BuyButtonQuery, BuyButtonQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BuyButtonQuery, BuyButtonQueryVariables>(BuyButtonDocument, options);
}
export function useBuyButtonLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<BuyButtonQuery, BuyButtonQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BuyButtonQuery, BuyButtonQueryVariables>(BuyButtonDocument, options);
}
export type BuyButtonQueryHookResult = ReturnType<typeof useBuyButtonQuery>;
export type BuyButtonLazyQueryHookResult = ReturnType<typeof useBuyButtonLazyQuery>;
export type BuyButtonQueryResult = Apollo.QueryResult<BuyButtonQuery, BuyButtonQueryVariables>;
