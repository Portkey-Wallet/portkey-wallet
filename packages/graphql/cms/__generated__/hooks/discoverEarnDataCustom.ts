import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverEarnDataCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type DiscoverEarnDataCustomQuery = {
  __typename?: 'Query';
  discoverEarnData?: {
    __typename?: 'discoverEarnData';
    status?: string | null;
    items?: Array<{
      __typename?: 'discoverEarnData_portkeyCard';
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
  } | null;
};

export const DiscoverEarnDataCustomDocument = gql`
  query discoverEarnDataCustom {
    discoverEarnData {
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
 * __useDiscoverEarnDataCustomQuery__
 *
 * To run a query within a React component, call `useDiscoverEarnDataCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverEarnDataCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverEarnDataCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useDiscoverEarnDataCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverEarnDataCustomQuery, DiscoverEarnDataCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverEarnDataCustomQuery, DiscoverEarnDataCustomQueryVariables>(
    DiscoverEarnDataCustomDocument,
    options,
  );
}
export function useDiscoverEarnDataCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverEarnDataCustomQuery, DiscoverEarnDataCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverEarnDataCustomQuery, DiscoverEarnDataCustomQueryVariables>(
    DiscoverEarnDataCustomDocument,
    options,
  );
}
export type DiscoverEarnDataCustomQueryHookResult = ReturnType<typeof useDiscoverEarnDataCustomQuery>;
export type DiscoverEarnDataCustomLazyQueryHookResult = ReturnType<typeof useDiscoverEarnDataCustomLazyQuery>;
export type DiscoverEarnDataCustomQueryResult = Apollo.QueryResult<
  DiscoverEarnDataCustomQuery,
  DiscoverEarnDataCustomQueryVariables
>;
