import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Boilerplate_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type Boilerplate_By_IdQuery = {
  __typename?: 'Query';
  boilerplate_by_id?: {
    __typename?: 'boilerplate';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    index?: number | null;
    name?: string | null;
    url?: string | null;
    user_created?: string | null;
    user_updated?: string | null;
    date_created_func?: {
      __typename?: 'datetime_functions';
      year?: number | null;
      month?: number | null;
      week?: number | null;
      day?: number | null;
      weekday?: number | null;
      hour?: number | null;
      minute?: number | null;
      second?: number | null;
    } | null;
    date_updated_func?: {
      __typename?: 'datetime_functions';
      year?: number | null;
      month?: number | null;
      week?: number | null;
      day?: number | null;
      weekday?: number | null;
      hour?: number | null;
      minute?: number | null;
      second?: number | null;
    } | null;
  } | null;
};

export const Boilerplate_By_IdDocument = gql`
  query boilerplate_by_id($id: ID!) {
    boilerplate_by_id(id: $id) {
      date_created
      date_created_func {
        year
        month
        week
        day
        weekday
        hour
        minute
        second
      }
      date_updated
      date_updated_func {
        year
        month
        week
        day
        weekday
        hour
        minute
        second
      }
      id
      index
      name
      url
      user_created
      user_updated
    }
  }
`;

/**
 * __useBoilerplate_By_IdQuery__
 *
 * To run a query within a React component, call `useBoilerplate_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoilerplate_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoilerplate_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBoilerplate_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<Boilerplate_By_IdQuery, Boilerplate_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Boilerplate_By_IdQuery, Boilerplate_By_IdQueryVariables>(Boilerplate_By_IdDocument, options);
}
export function useBoilerplate_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Boilerplate_By_IdQuery, Boilerplate_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Boilerplate_By_IdQuery, Boilerplate_By_IdQueryVariables>(
    Boilerplate_By_IdDocument,
    options,
  );
}
export type Boilerplate_By_IdQueryHookResult = ReturnType<typeof useBoilerplate_By_IdQuery>;
export type Boilerplate_By_IdLazyQueryHookResult = ReturnType<typeof useBoilerplate_By_IdLazyQuery>;
export type Boilerplate_By_IdQueryResult = Apollo.QueryResult<Boilerplate_By_IdQuery, Boilerplate_By_IdQueryVariables>;
