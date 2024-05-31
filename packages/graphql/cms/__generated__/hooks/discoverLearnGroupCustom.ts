import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverLearnGroupCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type DiscoverLearnGroupCustomQuery = {
  __typename?: 'Query';
  discoverLearnGroup: Array<{
    __typename?: 'discoverLearnGroup';
    status?: string | null;
    index?: any | null;
    title?: string | null;
    value?: string | null;
    items?: Array<{
      __typename?: 'discoverLearnGroup_portkeyCard';
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
  }>;
};

export const DiscoverLearnGroupCustomDocument = gql`
  query discoverLearnGroupCustom {
    discoverLearnGroup {
      status
      index
      title
      value
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
 * __useDiscoverLearnGroupCustomQuery__
 *
 * To run a query within a React component, call `useDiscoverLearnGroupCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverLearnGroupCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverLearnGroupCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useDiscoverLearnGroupCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverLearnGroupCustomQuery, DiscoverLearnGroupCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverLearnGroupCustomQuery, DiscoverLearnGroupCustomQueryVariables>(
    DiscoverLearnGroupCustomDocument,
    options,
  );
}
export function useDiscoverLearnGroupCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverLearnGroupCustomQuery, DiscoverLearnGroupCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverLearnGroupCustomQuery, DiscoverLearnGroupCustomQueryVariables>(
    DiscoverLearnGroupCustomDocument,
    options,
  );
}
export type DiscoverLearnGroupCustomQueryHookResult = ReturnType<typeof useDiscoverLearnGroupCustomQuery>;
export type DiscoverLearnGroupCustomLazyQueryHookResult = ReturnType<typeof useDiscoverLearnGroupCustomLazyQuery>;
export type DiscoverLearnGroupCustomQueryResult = Apollo.QueryResult<
  DiscoverLearnGroupCustomQuery,
  DiscoverLearnGroupCustomQueryVariables
>;
