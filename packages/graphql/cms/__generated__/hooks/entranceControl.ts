import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceControlQueryVariables = Types.Exact<{ [key: string]: never }>;

export type EntranceControlQuery = {
  __typename?: 'Query';
  entranceControl?: {
    __typename?: 'entranceControl';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    isAndroidBridgeShow?: boolean | null;
    isExtensionBridgeShow?: boolean | null;
    isIOSBridgeShow?: boolean | null;
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

export const EntranceControlDocument = gql`
  query entranceControl {
    entranceControl {
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
      isAndroidBridgeShow
      isExtensionBridgeShow
      isIOSBridgeShow
      user_created
      user_updated
    }
  }
`;

/**
 * __useEntranceControlQuery__
 *
 * To run a query within a React component, call `useEntranceControlQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceControlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceControlQuery({
 *   variables: {
 *   },
 * });
 */
export function useEntranceControlQuery(
  baseOptions?: Apollo.QueryHookOptions<EntranceControlQuery, EntranceControlQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceControlQuery, EntranceControlQueryVariables>(EntranceControlDocument, options);
}
export function useEntranceControlLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EntranceControlQuery, EntranceControlQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceControlQuery, EntranceControlQueryVariables>(EntranceControlDocument, options);
}
export type EntranceControlQueryHookResult = ReturnType<typeof useEntranceControlQuery>;
export type EntranceControlLazyQueryHookResult = ReturnType<typeof useEntranceControlLazyQuery>;
export type EntranceControlQueryResult = Apollo.QueryResult<EntranceControlQuery, EntranceControlQueryVariables>;
