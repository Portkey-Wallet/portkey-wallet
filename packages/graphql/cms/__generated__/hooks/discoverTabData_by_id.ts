import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverTabData_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type DiscoverTabData_By_IdQuery = {
  __typename?: 'Query';
  discoverTabData_by_id?: {
    __typename?: 'discoverTabData';
    id: string;
    status?: string | null;
    index?: any | null;
    name?: string | null;
    value?: string | null;
  } | null;
};

export const DiscoverTabData_By_IdDocument = gql`
  query discoverTabData_by_id($id: ID!) {
    discoverTabData_by_id(id: $id) {
      id
      status
      index
      name
      value
    }
  }
`;

/**
 * __useDiscoverTabData_By_IdQuery__
 *
 * To run a query within a React component, call `useDiscoverTabData_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverTabData_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverTabData_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDiscoverTabData_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<DiscoverTabData_By_IdQuery, DiscoverTabData_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverTabData_By_IdQuery, DiscoverTabData_By_IdQueryVariables>(
    DiscoverTabData_By_IdDocument,
    options,
  );
}
export function useDiscoverTabData_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverTabData_By_IdQuery, DiscoverTabData_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverTabData_By_IdQuery, DiscoverTabData_By_IdQueryVariables>(
    DiscoverTabData_By_IdDocument,
    options,
  );
}
export type DiscoverTabData_By_IdQueryHookResult = ReturnType<typeof useDiscoverTabData_By_IdQuery>;
export type DiscoverTabData_By_IdLazyQueryHookResult = ReturnType<typeof useDiscoverTabData_By_IdLazyQuery>;
export type DiscoverTabData_By_IdQueryResult = Apollo.QueryResult<
  DiscoverTabData_By_IdQuery,
  DiscoverTabData_By_IdQueryVariables
>;
