import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ServiceSuspensionQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ServiceSuspensionQuery = {
  __typename?: 'Query';
  serviceSuspension?: {
    __typename?: 'serviceSuspension';
    androidUrl?: string | null;
    date_created?: any | null;
    date_updated?: any | null;
    extensionUrl?: string | null;
    id: string;
    iOSUrl?: string | null;
    isSuspended?: boolean | null;
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

export const ServiceSuspensionDocument = gql`
  query serviceSuspension {
    serviceSuspension {
      androidUrl
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
      extensionUrl
      id
      iOSUrl
      isSuspended
      user_created
      user_updated
    }
  }
`;

/**
 * __useServiceSuspensionQuery__
 *
 * To run a query within a React component, call `useServiceSuspensionQuery` and pass it any options that fit your needs.
 * When your component renders, `useServiceSuspensionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServiceSuspensionQuery({
 *   variables: {
 *   },
 * });
 */
export function useServiceSuspensionQuery(
  baseOptions?: Apollo.QueryHookOptions<ServiceSuspensionQuery, ServiceSuspensionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ServiceSuspensionQuery, ServiceSuspensionQueryVariables>(ServiceSuspensionDocument, options);
}
export function useServiceSuspensionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ServiceSuspensionQuery, ServiceSuspensionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ServiceSuspensionQuery, ServiceSuspensionQueryVariables>(
    ServiceSuspensionDocument,
    options,
  );
}
export type ServiceSuspensionQueryHookResult = ReturnType<typeof useServiceSuspensionQuery>;
export type ServiceSuspensionLazyQueryHookResult = ReturnType<typeof useServiceSuspensionLazyQuery>;
export type ServiceSuspensionQueryResult = Apollo.QueryResult<ServiceSuspensionQuery, ServiceSuspensionQueryVariables>;
