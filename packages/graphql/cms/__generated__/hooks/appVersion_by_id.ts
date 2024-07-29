import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AppVersion_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type AppVersion_By_IdQuery = {
  __typename?: 'Query';
  appVersion_by_id?: {
    __typename?: 'appVersion';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    label?: string | null;
    sort?: number | null;
    status?: string | null;
    user_created?: string | null;
    user_updated?: string | null;
    value?: string | null;
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

export const AppVersion_By_IdDocument = gql`
  query appVersion_by_id($id: ID!) {
    appVersion_by_id(id: $id) {
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
      label
      sort
      status
      user_created
      user_updated
      value
    }
  }
`;

/**
 * __useAppVersion_By_IdQuery__
 *
 * To run a query within a React component, call `useAppVersion_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppVersion_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppVersion_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAppVersion_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<AppVersion_By_IdQuery, AppVersion_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppVersion_By_IdQuery, AppVersion_By_IdQueryVariables>(AppVersion_By_IdDocument, options);
}
export function useAppVersion_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AppVersion_By_IdQuery, AppVersion_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppVersion_By_IdQuery, AppVersion_By_IdQueryVariables>(AppVersion_By_IdDocument, options);
}
export type AppVersion_By_IdQueryHookResult = ReturnType<typeof useAppVersion_By_IdQuery>;
export type AppVersion_By_IdLazyQueryHookResult = ReturnType<typeof useAppVersion_By_IdLazyQuery>;
export type AppVersion_By_IdQueryResult = Apollo.QueryResult<AppVersion_By_IdQuery, AppVersion_By_IdQueryVariables>;
