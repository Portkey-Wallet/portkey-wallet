import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverTabDataCustomQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.DiscoverTabData_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type DiscoverTabDataCustomQuery = {
  __typename?: 'Query';
  discoverTabData: Array<{
    __typename?: 'discoverTabData';
    id: string;
    status?: string | null;
    index?: any | null;
    name?: string | null;
    value?: string | null;
  }>;
};

export const DiscoverTabDataCustomDocument = gql`
  query discoverTabDataCustom(
    $filter: discoverTabData_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    discoverTabData(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      id
      status
      index
      name
      value
    }
  }
`;

/**
 * __useDiscoverTabDataCustomQuery__
 *
 * To run a query within a React component, call `useDiscoverTabDataCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverTabDataCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverTabDataCustomQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useDiscoverTabDataCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverTabDataCustomQuery, DiscoverTabDataCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverTabDataCustomQuery, DiscoverTabDataCustomQueryVariables>(
    DiscoverTabDataCustomDocument,
    options,
  );
}
export function useDiscoverTabDataCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverTabDataCustomQuery, DiscoverTabDataCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverTabDataCustomQuery, DiscoverTabDataCustomQueryVariables>(
    DiscoverTabDataCustomDocument,
    options,
  );
}
export type DiscoverTabDataCustomQueryHookResult = ReturnType<typeof useDiscoverTabDataCustomQuery>;
export type DiscoverTabDataCustomLazyQueryHookResult = ReturnType<typeof useDiscoverTabDataCustomLazyQuery>;
export type DiscoverTabDataCustomQueryResult = Apollo.QueryResult<
  DiscoverTabDataCustomQuery,
  DiscoverTabDataCustomQueryVariables
>;
