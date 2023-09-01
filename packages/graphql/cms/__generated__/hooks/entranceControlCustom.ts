import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceControlCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type EntranceControlCustomQuery = {
  __typename?: 'Query';
  entranceControl?: {
    __typename?: 'entranceControl';
    isAndroidBridgeShow?: boolean | null;
    isExtensionBridgeShow?: boolean | null;
    isIOSBridgeShow?: boolean | null;
  } | null;
};

export const EntranceControlCustomDocument = gql`
  query entranceControlCustom {
    entranceControl {
      isAndroidBridgeShow
      isExtensionBridgeShow
      isIOSBridgeShow
    }
  }
`;

/**
 * __useEntranceControlCustomQuery__
 *
 * To run a query within a React component, call `useEntranceControlCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceControlCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceControlCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useEntranceControlCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<EntranceControlCustomQuery, EntranceControlCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceControlCustomQuery, EntranceControlCustomQueryVariables>(
    EntranceControlCustomDocument,
    options,
  );
}
export function useEntranceControlCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EntranceControlCustomQuery, EntranceControlCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceControlCustomQuery, EntranceControlCustomQueryVariables>(
    EntranceControlCustomDocument,
    options,
  );
}
export type EntranceControlCustomQueryHookResult = ReturnType<typeof useEntranceControlCustomQuery>;
export type EntranceControlCustomLazyQueryHookResult = ReturnType<typeof useEntranceControlCustomLazyQuery>;
export type EntranceControlCustomQueryResult = Apollo.QueryResult<
  EntranceControlCustomQuery,
  EntranceControlCustomQueryVariables
>;
