import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TokenDetailBannerCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type TokenDetailBannerCustomQuery = {
  __typename?: 'Query';
  tokenDetailBanner: Array<{
    __typename?: 'tokenDetailBanner';
    id: string;
    status?: string | null;
    chainId?: string | null;
    symbol?: string | null;
    items?: Array<{
      __typename?: 'tokenDetailBanner_portkeyCard';
      portkeyCard_id?: {
        __typename?: 'portkeyCard';
        status?: string | null;
        title?: string | null;
        url?: string | null;
        appLink?: string | null;
        extensionLink?: string | null;
        index?: any | null;
        value?: string | null;
        description?: string | null;
        buttonTitle?: string | null;
        imgUrl?: { __typename?: 'directus_files'; filename_disk?: string | null } | null;
      } | null;
    } | null> | null;
  }>;
};

export const TokenDetailBannerCustomDocument = gql`
  query tokenDetailBannerCustom {
    tokenDetailBanner {
      id
      status
      chainId
      symbol
      items {
        portkeyCard_id {
          status
          title
          url
          appLink
          extensionLink
          index
          value
          description
          buttonTitle
          imgUrl {
            filename_disk
          }
        }
      }
    }
  }
`;

/**
 * __useTokenDetailBannerCustomQuery__
 *
 * To run a query within a React component, call `useTokenDetailBannerCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenDetailBannerCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenDetailBannerCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useTokenDetailBannerCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<TokenDetailBannerCustomQuery, TokenDetailBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TokenDetailBannerCustomQuery, TokenDetailBannerCustomQueryVariables>(
    TokenDetailBannerCustomDocument,
    options,
  );
}
export function useTokenDetailBannerCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TokenDetailBannerCustomQuery, TokenDetailBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TokenDetailBannerCustomQuery, TokenDetailBannerCustomQueryVariables>(
    TokenDetailBannerCustomDocument,
    options,
  );
}
export type TokenDetailBannerCustomQueryHookResult = ReturnType<typeof useTokenDetailBannerCustomQuery>;
export type TokenDetailBannerCustomLazyQueryHookResult = ReturnType<typeof useTokenDetailBannerCustomLazyQuery>;
export type TokenDetailBannerCustomQueryResult = Apollo.QueryResult<
  TokenDetailBannerCustomQuery,
  TokenDetailBannerCustomQueryVariables
>;
