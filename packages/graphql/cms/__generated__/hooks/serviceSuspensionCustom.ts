import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ServiceSuspensionCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ServiceSuspensionCustomQuery = {
  __typename?: 'Query';
  serviceSuspension?: {
    __typename?: 'serviceSuspension';
    androidUrl?: string | null;
    extensionUrl?: string | null;
    iOSUrl?: string | null;
    isSuspended?: boolean | null;
  } | null;
};

export const ServiceSuspensionCustomDocument = gql`
  query serviceSuspensionCustom {
    serviceSuspension {
      androidUrl
      extensionUrl
      iOSUrl
      isSuspended
    }
  }
`;

/**
 * __useServiceSuspensionCustomQuery__
 *
 * To run a query within a React component, call `useServiceSuspensionCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useServiceSuspensionCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServiceSuspensionCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useServiceSuspensionCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<ServiceSuspensionCustomQuery, ServiceSuspensionCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ServiceSuspensionCustomQuery, ServiceSuspensionCustomQueryVariables>(
    ServiceSuspensionCustomDocument,
    options,
  );
}
export function useServiceSuspensionCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ServiceSuspensionCustomQuery, ServiceSuspensionCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ServiceSuspensionCustomQuery, ServiceSuspensionCustomQueryVariables>(
    ServiceSuspensionCustomDocument,
    options,
  );
}
export type ServiceSuspensionCustomQueryHookResult = ReturnType<typeof useServiceSuspensionCustomQuery>;
export type ServiceSuspensionCustomLazyQueryHookResult = ReturnType<typeof useServiceSuspensionCustomLazyQuery>;
export type ServiceSuspensionCustomQueryResult = Apollo.QueryResult<
  ServiceSuspensionCustomQuery,
  ServiceSuspensionCustomQueryVariables
>;
