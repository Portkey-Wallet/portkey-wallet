import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverGroupCustomQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.DiscoverGroup_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.DiscoverItem_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type DiscoverGroupCustomQuery = {
  __typename?: 'Query';
  discoverGroup: Array<{
    __typename?: 'discoverGroup';
    id: string;
    index?: number | null;
    status?: string | null;
    title?: string | null;
    items?: Array<{
      __typename?: 'discoverItem';
      id: string;
      index?: number | null;
      status?: string | null;
      title?: string | null;
      description?: string | null;
      url?: string | null;
      appLink?: string | null;
      extensionLink?: string | null;
      imgUrl?: never | null;
    } | null> | null;
  }>;
};

export const DiscoverGroupCustomDocument = gql`
  query discoverGroupCustom(
    $filter: discoverGroup_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: discoverItem_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
  ) {
    discoverGroup(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      id
      index
      status
      title
      items(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
        id
        index
        status
        title
        description
        url
        appLink
        extensionLink
        imgUrl {
          filename_disk
        }
      }
    }
  }
`;

/**
 * __useDiscoverGroupCustomQuery__
 *
 * To run a query within a React component, call `useDiscoverGroupCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverGroupCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverGroupCustomQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      filter1: // value for 'filter1'
 *      sort1: // value for 'sort1'
 *      limit1: // value for 'limit1'
 *      offset1: // value for 'offset1'
 *      page1: // value for 'page1'
 *      search1: // value for 'search1'
 *   },
 * });
 */
export function useDiscoverGroupCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverGroupCustomQuery, DiscoverGroupCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverGroupCustomQuery, DiscoverGroupCustomQueryVariables>(
    DiscoverGroupCustomDocument,
    options,
  );
}
export function useDiscoverGroupCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverGroupCustomQuery, DiscoverGroupCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverGroupCustomQuery, DiscoverGroupCustomQueryVariables>(
    DiscoverGroupCustomDocument,
    options,
  );
}
export type DiscoverGroupCustomQueryHookResult = ReturnType<typeof useDiscoverGroupCustomQuery>;
export type DiscoverGroupCustomLazyQueryHookResult = ReturnType<typeof useDiscoverGroupCustomLazyQuery>;
export type DiscoverGroupCustomQueryResult = Apollo.QueryResult<
  DiscoverGroupCustomQuery,
  DiscoverGroupCustomQueryVariables
>;
