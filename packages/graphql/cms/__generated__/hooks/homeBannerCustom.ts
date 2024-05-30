import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HomeBannerCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type HomeBannerCustomQuery = {
  __typename?: 'Query';
  homeBanner?: {
    __typename?: 'homeBanner';
    items?: Array<{
      __typename?: 'homeBanner_portkeyCard';
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

export const HomeBannerCustomDocument = gql`
  query homeBannerCustom {
    homeBanner {
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
 * __useHomeBannerCustomQuery__
 *
 * To run a query within a React component, call `useHomeBannerCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeBannerCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeBannerCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomeBannerCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<HomeBannerCustomQuery, HomeBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HomeBannerCustomQuery, HomeBannerCustomQueryVariables>(HomeBannerCustomDocument, options);
}
export function useHomeBannerCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<HomeBannerCustomQuery, HomeBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HomeBannerCustomQuery, HomeBannerCustomQueryVariables>(HomeBannerCustomDocument, options);
}
export type HomeBannerCustomQueryHookResult = ReturnType<typeof useHomeBannerCustomQuery>;
export type HomeBannerCustomLazyQueryHookResult = ReturnType<typeof useHomeBannerCustomLazyQuery>;
export type HomeBannerCustomQueryResult = Apollo.QueryResult<HomeBannerCustomQuery, HomeBannerCustomQueryVariables>;
