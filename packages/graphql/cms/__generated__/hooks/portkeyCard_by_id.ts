import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PortkeyCard_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.CardType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type PortkeyCard_By_IdQuery = {
  __typename?: 'Query';
  portkeyCard_by_id?: {
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
};

export const PortkeyCard_By_IdDocument = gql`
  query portkeyCard_by_id(
    $filter: cardType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $id: ID!
  ) {
    portkeyCard_by_id(id: $id) {
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
 * __usePortkeyCard_By_IdQuery__
 *
 * To run a query within a React component, call `usePortkeyCard_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortkeyCard_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortkeyCard_By_IdQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePortkeyCard_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>(PortkeyCard_By_IdDocument, options);
}
export function usePortkeyCard_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>(
    PortkeyCard_By_IdDocument,
    options,
  );
}
export type PortkeyCard_By_IdQueryHookResult = ReturnType<typeof usePortkeyCard_By_IdQuery>;
export type PortkeyCard_By_IdLazyQueryHookResult = ReturnType<typeof usePortkeyCard_By_IdLazyQuery>;
export type PortkeyCard_By_IdQueryResult = Apollo.QueryResult<PortkeyCard_By_IdQuery, PortkeyCard_By_IdQueryVariables>;
