import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceModuleName_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type EntranceModuleName_By_IdQuery = {
  __typename?: 'Query';
  entranceModuleName_by_id?: {
    __typename?: 'entranceModuleName';
    id: string;
    user_created?: string | null;
    date_created?: any | null;
    user_updated?: string | null;
    date_updated?: any | null;
    value?: string | null;
    description?: string | null;
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

export const EntranceModuleName_By_IdDocument = gql`
  query entranceModuleName_by_id($id: ID!) {
    entranceModuleName_by_id(id: $id) {
      id
      user_created
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
      user_updated
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
      value
      description
    }
  }
`;

/**
 * __useEntranceModuleName_By_IdQuery__
 *
 * To run a query within a React component, call `useEntranceModuleName_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceModuleName_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceModuleName_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEntranceModuleName_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<EntranceModuleName_By_IdQuery, EntranceModuleName_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceModuleName_By_IdQuery, EntranceModuleName_By_IdQueryVariables>(
    EntranceModuleName_By_IdDocument,
    options,
  );
}
export function useEntranceModuleName_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EntranceModuleName_By_IdQuery, EntranceModuleName_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceModuleName_By_IdQuery, EntranceModuleName_By_IdQueryVariables>(
    EntranceModuleName_By_IdDocument,
    options,
  );
}
export type EntranceModuleName_By_IdQueryHookResult = ReturnType<typeof useEntranceModuleName_By_IdQuery>;
export type EntranceModuleName_By_IdLazyQueryHookResult = ReturnType<typeof useEntranceModuleName_By_IdLazyQuery>;
export type EntranceModuleName_By_IdQueryResult = Apollo.QueryResult<
  EntranceModuleName_By_IdQuery,
  EntranceModuleName_By_IdQueryVariables
>;
