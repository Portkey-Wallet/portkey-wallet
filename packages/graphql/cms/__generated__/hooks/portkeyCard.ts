import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PortkeyCardQueryVariables = Types.Exact<{
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
}>;

export type PortkeyCardQuery = {
  __typename?: 'Query';
  portkeyCard: Array<{
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
  }>;
};

export const PortkeyCardDocument = gql`
  query portkeyCard(
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
  ) {
    portkeyCard(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
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
`;

/**
 * __usePortkeyCardQuery__
 *
 * To run a query within a React component, call `usePortkeyCardQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortkeyCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortkeyCardQuery({
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
export function usePortkeyCardQuery(
  baseOptions?: Apollo.QueryHookOptions<PortkeyCardQuery, PortkeyCardQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PortkeyCardQuery, PortkeyCardQueryVariables>(PortkeyCardDocument, options);
}
export function usePortkeyCardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PortkeyCardQuery, PortkeyCardQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PortkeyCardQuery, PortkeyCardQueryVariables>(PortkeyCardDocument, options);
}
export type PortkeyCardQueryHookResult = ReturnType<typeof usePortkeyCardQuery>;
export type PortkeyCardLazyQueryHookResult = ReturnType<typeof usePortkeyCardLazyQuery>;
export type PortkeyCardQueryResult = Apollo.QueryResult<PortkeyCardQuery, PortkeyCardQueryVariables>;
