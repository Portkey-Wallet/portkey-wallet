import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CardTypeQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.CardType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type CardTypeQuery = {
  __typename?: 'Query';
  cardType: Array<{
    __typename?: 'cardType';
    id: string;
    label?: string | null;
    status?: string | null;
    value?: string | null;
  }>;
};

export const CardTypeDocument = gql`
  query cardType($filter: cardType_filter, $sort: [String], $limit: Int, $offset: Int, $page: Int, $search: String) {
    cardType(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      id
      label
      status
      value
    }
  }
`;

/**
 * __useCardTypeQuery__
 *
 * To run a query within a React component, call `useCardTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardTypeQuery({
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
export function useCardTypeQuery(baseOptions?: Apollo.QueryHookOptions<CardTypeQuery, CardTypeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CardTypeQuery, CardTypeQueryVariables>(CardTypeDocument, options);
}
export function useCardTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardTypeQuery, CardTypeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CardTypeQuery, CardTypeQueryVariables>(CardTypeDocument, options);
}
export type CardTypeQueryHookResult = ReturnType<typeof useCardTypeQuery>;
export type CardTypeLazyQueryHookResult = ReturnType<typeof useCardTypeLazyQuery>;
export type CardTypeQueryResult = Apollo.QueryResult<CardTypeQuery, CardTypeQueryVariables>;
