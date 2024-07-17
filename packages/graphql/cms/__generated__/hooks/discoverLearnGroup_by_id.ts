import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DiscoverLearnGroup_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.CardType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.PortkeyCard_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  filter2?: Types.InputMaybe<Types.DiscoverLearnGroup_PortkeyCard_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
  filter3?: Types.InputMaybe<Types.DiscoverLearnGroup_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
  filter4?: Types.InputMaybe<Types.DiscoverLearnGroup_PortkeyCard_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type DiscoverLearnGroup_By_IdQuery = {
  __typename?: 'Query';
  discoverLearnGroup_by_id?: {
    __typename?: 'discoverLearnGroup';
    id: string;
    index?: any | null;
    status?: string | null;
    title?: string | null;
    value?: string | null;
    items?: Array<{
      __typename?: 'discoverLearnGroup_portkeyCard';
      id: string;
      discoverLearnGroup_id?: {
        __typename?: 'discoverLearnGroup';
        id: string;
        index?: any | null;
        status?: string | null;
        title?: string | null;
        value?: string | null;
        items?: Array<{
          __typename?: 'discoverLearnGroup_portkeyCard';
          id: string;
          portkeyCard_id?: {
            __typename?: 'portkeyCard';
            appLink?: string | null;
            buttonTitle?: string | null;
            description?: string | null;
            extensionLink?: string | null;
            id: string;
            imgUrl?: string | null;
            index?: any | null;
            status?: string | null;
            title?: string | null;
            url?: string | null;
            value?: string | null;
            type?: {
              __typename?: 'cardType';
              id: string;
              label?: string | null;
              status?: string | null;
              value?: string | null;
            } | null;
          } | null;
        } | null> | null;
        items_func?: { __typename?: 'count_functions'; count?: number | null } | null;
      } | null;
    } | null> | null;
    items_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  } | null;
};

export const DiscoverLearnGroup_By_IdDocument = gql`
  query discoverLearnGroup_by_id(
    $filter: cardType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: portkeyCard_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $filter2: discoverLearnGroup_portkeyCard_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
    $filter3: discoverLearnGroup_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
    $filter4: discoverLearnGroup_portkeyCard_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $id: ID!
  ) {
    discoverLearnGroup_by_id(id: $id) {
      id
      index
      status
      title
      value
      items(filter: $filter4, sort: $sort4, limit: $limit4, offset: $offset4, page: $page4, search: $search4) {
        discoverLearnGroup_id(
          filter: $filter3
          sort: $sort3
          limit: $limit3
          offset: $offset3
          page: $page3
          search: $search3
        ) {
          id
          index
          status
          title
          value
          items(filter: $filter2, sort: $sort2, limit: $limit2, offset: $offset2, page: $page2, search: $search2) {
            id
            portkeyCard_id(
              filter: $filter1
              sort: $sort1
              limit: $limit1
              offset: $offset1
              page: $page1
              search: $search1
            ) {
              appLink
              buttonTitle
              description
              extensionLink
              id
              imgUrl
              index
              status
              title
              type(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
                id
                label
                status
                value
              }
              url
              value
            }
          }
          items_func {
            count
          }
        }
        id
      }
      items_func {
        count
      }
    }
  }
`;

/**
 * __useDiscoverLearnGroup_By_IdQuery__
 *
 * To run a query within a React component, call `useDiscoverLearnGroup_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverLearnGroup_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverLearnGroup_By_IdQuery({
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
 *      filter2: // value for 'filter2'
 *      sort2: // value for 'sort2'
 *      limit2: // value for 'limit2'
 *      offset2: // value for 'offset2'
 *      page2: // value for 'page2'
 *      search2: // value for 'search2'
 *      filter3: // value for 'filter3'
 *      sort3: // value for 'sort3'
 *      limit3: // value for 'limit3'
 *      offset3: // value for 'offset3'
 *      page3: // value for 'page3'
 *      search3: // value for 'search3'
 *      filter4: // value for 'filter4'
 *      sort4: // value for 'sort4'
 *      limit4: // value for 'limit4'
 *      offset4: // value for 'offset4'
 *      page4: // value for 'page4'
 *      search4: // value for 'search4'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDiscoverLearnGroup_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<DiscoverLearnGroup_By_IdQuery, DiscoverLearnGroup_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverLearnGroup_By_IdQuery, DiscoverLearnGroup_By_IdQueryVariables>(
    DiscoverLearnGroup_By_IdDocument,
    options,
  );
}
export function useDiscoverLearnGroup_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverLearnGroup_By_IdQuery, DiscoverLearnGroup_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverLearnGroup_By_IdQuery, DiscoverLearnGroup_By_IdQueryVariables>(
    DiscoverLearnGroup_By_IdDocument,
    options,
  );
}
export type DiscoverLearnGroup_By_IdQueryHookResult = ReturnType<typeof useDiscoverLearnGroup_By_IdQuery>;
export type DiscoverLearnGroup_By_IdLazyQueryHookResult = ReturnType<typeof useDiscoverLearnGroup_By_IdLazyQuery>;
export type DiscoverLearnGroup_By_IdQueryResult = Apollo.QueryResult<
  DiscoverLearnGroup_By_IdQuery,
  DiscoverLearnGroup_By_IdQueryVariables
>;
