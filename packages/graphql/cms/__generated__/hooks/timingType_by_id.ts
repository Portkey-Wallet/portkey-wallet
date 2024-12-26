import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TimingType_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type TimingType_By_IdQuery = {
  __typename?: 'Query';
  timingType_by_id?: { __typename?: 'timingType'; id: string; name?: string | null } | null;
};

export const TimingType_By_IdDocument = gql`
  query timingType_by_id($id: ID!) {
    timingType_by_id(id: $id) {
      id
      name
    }
  }
`;

/**
 * __useTimingType_By_IdQuery__
 *
 * To run a query within a React component, call `useTimingType_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimingType_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimingType_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTimingType_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<TimingType_By_IdQuery, TimingType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TimingType_By_IdQuery, TimingType_By_IdQueryVariables>(TimingType_By_IdDocument, options);
}
export function useTimingType_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TimingType_By_IdQuery, TimingType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TimingType_By_IdQuery, TimingType_By_IdQueryVariables>(TimingType_By_IdDocument, options);
}
export type TimingType_By_IdQueryHookResult = ReturnType<typeof useTimingType_By_IdQuery>;
export type TimingType_By_IdLazyQueryHookResult = ReturnType<typeof useTimingType_By_IdLazyQuery>;
export type TimingType_By_IdQueryResult = Apollo.QueryResult<TimingType_By_IdQuery, TimingType_By_IdQueryVariables>;
