import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CardType_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type CardType_By_IdQuery = {
  __typename?: 'Query';
  cardType_by_id?: {
    __typename?: 'cardType';
    id: string;
    label?: string | null;
    status?: string | null;
    value?: string | null;
  } | null;
};

export const CardType_By_IdDocument = gql`
  query cardType_by_id($id: ID!) {
    cardType_by_id(id: $id) {
      id
      label
      status
      value
    }
  }
`;

/**
 * __useCardType_By_IdQuery__
 *
 * To run a query within a React component, call `useCardType_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardType_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardType_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCardType_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<CardType_By_IdQuery, CardType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CardType_By_IdQuery, CardType_By_IdQueryVariables>(CardType_By_IdDocument, options);
}
export function useCardType_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CardType_By_IdQuery, CardType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CardType_By_IdQuery, CardType_By_IdQueryVariables>(CardType_By_IdDocument, options);
}
export type CardType_By_IdQueryHookResult = ReturnType<typeof useCardType_By_IdQuery>;
export type CardType_By_IdLazyQueryHookResult = ReturnType<typeof useCardType_By_IdLazyQuery>;
export type CardType_By_IdQueryResult = Apollo.QueryResult<CardType_By_IdQuery, CardType_By_IdQueryVariables>;
