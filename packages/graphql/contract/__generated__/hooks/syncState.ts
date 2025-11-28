import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SyncStateQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetSyncStateDto>;
}>;

export type SyncStateQuery = {
  __typename?: 'Query';
  syncState?: { __typename?: 'SyncStateDto'; confirmedBlockHeight: number } | null;
};

export const SyncStateDocument = gql`
  query syncState($dto: GetSyncStateDto) {
    syncState(dto: $dto) {
      confirmedBlockHeight
    }
  }
`;

/**
 * __useSyncStateQuery__
 *
 * To run a query within a React component, call `useSyncStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useSyncStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSyncStateQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useSyncStateQuery(baseOptions?: Apollo.QueryHookOptions<SyncStateQuery, SyncStateQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SyncStateQuery, SyncStateQueryVariables>(SyncStateDocument, options);
}
export function useSyncStateLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SyncStateQuery, SyncStateQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SyncStateQuery, SyncStateQueryVariables>(SyncStateDocument, options);
}
export type SyncStateQueryHookResult = ReturnType<typeof useSyncStateQuery>;
export type SyncStateLazyQueryHookResult = ReturnType<typeof useSyncStateLazyQuery>;
export type SyncStateQueryResult = Apollo.QueryResult<SyncStateQuery, SyncStateQueryVariables>;
