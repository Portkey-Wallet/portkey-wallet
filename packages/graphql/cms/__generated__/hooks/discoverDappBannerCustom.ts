import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverDappBannerCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type DiscoverDappBannerCustomQuery = {
  __typename?: 'Query';
  discoverDappBanner?: {
    __typename?: 'discoverDappBanner';
    items?: Array<{
      __typename?: 'discoverDappBanner_portkeyCard';
      portkeyCard_id?: {
        __typename?: 'portkeyCard';
        status?: string | null;
        title?: string | null;
        url?: string | null;
        index?: any | null;
        value?: string | null;
        description?: string | null;
        buttonTitle?: string | null;
        imgUrl?: { __typename?: 'directus_files'; filename_disk?: string | null } | null;
      } | null;
    } | null> | null;
  } | null;
};

export const DiscoverDappBannerCustomDocument = gql`
  query discoverDappBannerCustom {
    discoverDappBanner {
      items {
        portkeyCard_id {
          status
          title
          url
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
 * __useDiscoverDappBannerCustomQuery__
 *
 * To run a query within a React component, call `useDiscoverDappBannerCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverDappBannerCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverDappBannerCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useDiscoverDappBannerCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverDappBannerCustomQuery, DiscoverDappBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverDappBannerCustomQuery, DiscoverDappBannerCustomQueryVariables>(
    DiscoverDappBannerCustomDocument,
    options,
  );
}
export function useDiscoverDappBannerCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverDappBannerCustomQuery, DiscoverDappBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverDappBannerCustomQuery, DiscoverDappBannerCustomQueryVariables>(
    DiscoverDappBannerCustomDocument,
    options,
  );
}
export type DiscoverDappBannerCustomQueryHookResult = ReturnType<typeof useDiscoverDappBannerCustomQuery>;
export type DiscoverDappBannerCustomLazyQueryHookResult = ReturnType<typeof useDiscoverDappBannerCustomLazyQuery>;
export type DiscoverDappBannerCustomQueryResult = Apollo.QueryResult<
  DiscoverDappBannerCustomQuery,
  DiscoverDappBannerCustomQueryVariables
>;
