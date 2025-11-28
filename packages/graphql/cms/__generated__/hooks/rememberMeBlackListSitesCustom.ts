import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RememberMeBlackListSitesCustomQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.RememberMeBlackListSites_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type RememberMeBlackListSitesCustomQuery = {
  __typename?: 'Query';
  rememberMeBlackListSites: Array<{
    __typename?: 'rememberMeBlackListSites';
    id: string;
    name?: string | null;
    url?: string | null;
  }>;
};

export const RememberMeBlackListSitesCustomDocument = gql`
  query rememberMeBlackListSitesCustom(
    $filter: rememberMeBlackListSites_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    rememberMeBlackListSites(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
      page: $page
      search: $search
    ) {
      id
      name
      url
    }
  }
`;

/**
 * __useRememberMeBlackListSitesCustomQuery__
 *
 * To run a query within a React component, call `useRememberMeBlackListSitesCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useRememberMeBlackListSitesCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRememberMeBlackListSitesCustomQuery({
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
export function useRememberMeBlackListSitesCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<
    RememberMeBlackListSitesCustomQuery,
    RememberMeBlackListSitesCustomQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RememberMeBlackListSitesCustomQuery, RememberMeBlackListSitesCustomQueryVariables>(
    RememberMeBlackListSitesCustomDocument,
    options,
  );
}
export function useRememberMeBlackListSitesCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    RememberMeBlackListSitesCustomQuery,
    RememberMeBlackListSitesCustomQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RememberMeBlackListSitesCustomQuery, RememberMeBlackListSitesCustomQueryVariables>(
    RememberMeBlackListSitesCustomDocument,
    options,
  );
}
export type RememberMeBlackListSitesCustomQueryHookResult = ReturnType<typeof useRememberMeBlackListSitesCustomQuery>;
export type RememberMeBlackListSitesCustomLazyQueryHookResult = ReturnType<
  typeof useRememberMeBlackListSitesCustomLazyQuery
>;
export type RememberMeBlackListSitesCustomQueryResult = Apollo.QueryResult<
  RememberMeBlackListSitesCustomQuery,
  RememberMeBlackListSitesCustomQueryVariables
>;
