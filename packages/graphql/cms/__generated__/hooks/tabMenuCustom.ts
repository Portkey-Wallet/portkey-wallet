import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TabMenuCustomQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.TabMenu_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type TabMenuCustomQuery = {
  __typename?: 'Query';
  tabMenu: Array<{
    __typename?: 'tabMenu';
    index?: number | null;
    status?: string | null;
    title?: string | null;
    type?: { __typename?: 'tabType'; value?: string | null } | null;
  }>;
};

export const TabMenuCustomDocument = gql`
  query tabMenuCustom(
    $filter: tabMenu_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    tabMenu(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      index
      status
      title
      type {
        value
      }
    }
  }
`;

/**
 * __useTabMenuCustomQuery__
 *
 * To run a query within a React component, call `useTabMenuCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useTabMenuCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTabMenuCustomQuery({
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
export function useTabMenuCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<TabMenuCustomQuery, TabMenuCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TabMenuCustomQuery, TabMenuCustomQueryVariables>(TabMenuCustomDocument, options);
}
export function useTabMenuCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TabMenuCustomQuery, TabMenuCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TabMenuCustomQuery, TabMenuCustomQueryVariables>(TabMenuCustomDocument, options);
}
export type TabMenuCustomQueryHookResult = ReturnType<typeof useTabMenuCustomQuery>;
export type TabMenuCustomLazyQueryHookResult = ReturnType<typeof useTabMenuCustomLazyQuery>;
export type TabMenuCustomQueryResult = Apollo.QueryResult<TabMenuCustomQuery, TabMenuCustomQueryVariables>;
