import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverLearnBannerCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type DiscoverLearnBannerCustomQuery = {
  __typename?: 'Query';
  discoverLearnBanner?: {
    __typename?: 'discoverLearnBanner';
    status?: string | null;
    items?: Array<{
      __typename?: 'discoverLearnBanner_portkeyCard';
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
        imgUrl?: never | null;
      } | null;
    } | null> | null;
  } | null;
};

export const DiscoverLearnBannerCustomDocument = gql`
  query discoverLearnBannerCustom {
    discoverLearnBanner {
      status
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
 * __useDiscoverLearnBannerCustomQuery__
 *
 * To run a query within a React component, call `useDiscoverLearnBannerCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverLearnBannerCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverLearnBannerCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useDiscoverLearnBannerCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverLearnBannerCustomQuery, DiscoverLearnBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverLearnBannerCustomQuery, DiscoverLearnBannerCustomQueryVariables>(
    DiscoverLearnBannerCustomDocument,
    options,
  );
}
export function useDiscoverLearnBannerCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverLearnBannerCustomQuery, DiscoverLearnBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverLearnBannerCustomQuery, DiscoverLearnBannerCustomQueryVariables>(
    DiscoverLearnBannerCustomDocument,
    options,
  );
}
export type DiscoverLearnBannerCustomQueryHookResult = ReturnType<typeof useDiscoverLearnBannerCustomQuery>;
export type DiscoverLearnBannerCustomLazyQueryHookResult = ReturnType<typeof useDiscoverLearnBannerCustomLazyQuery>;
export type DiscoverLearnBannerCustomQueryResult = Apollo.QueryResult<
  DiscoverLearnBannerCustomQuery,
  DiscoverLearnBannerCustomQueryVariables
>;
