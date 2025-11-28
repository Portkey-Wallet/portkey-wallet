import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverTabDataQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.DiscoverTabData_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type DiscoverTabDataQuery = {
  __typename?: 'Query';
  discoverTabData: Array<{
    __typename?: 'discoverTabData';
    id: string;
    index?: any | null;
    name?: string | null;
    status?: string | null;
    value?: string | null;
  }>;
};

export const DiscoverTabDataDocument = gql`
  query discoverTabData(
    $filter: discoverTabData_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    discoverTabData(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      id
      index
      name
      status
      value
    }
  }
`;

/**
 * __useDiscoverTabDataQuery__
 *
 * To run a query within a React component, call `useDiscoverTabDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverTabDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverTabDataQuery({
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
export function useDiscoverTabDataQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverTabDataQuery, DiscoverTabDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverTabDataQuery, DiscoverTabDataQueryVariables>(DiscoverTabDataDocument, options);
}
export function useDiscoverTabDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverTabDataQuery, DiscoverTabDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverTabDataQuery, DiscoverTabDataQueryVariables>(DiscoverTabDataDocument, options);
}
export type DiscoverTabDataQueryHookResult = ReturnType<typeof useDiscoverTabDataQuery>;
export type DiscoverTabDataLazyQueryHookResult = ReturnType<typeof useDiscoverTabDataLazyQuery>;
export type DiscoverTabDataQueryResult = Apollo.QueryResult<DiscoverTabDataQuery, DiscoverTabDataQueryVariables>;
