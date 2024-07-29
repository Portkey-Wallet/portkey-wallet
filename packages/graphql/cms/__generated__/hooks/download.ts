import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DownloadQueryVariables = Types.Exact<{ [key: string]: never }>;

export type DownloadQuery = {
  __typename?: 'Query';
  download?: {
    __typename?: 'download';
    androidDownloadUrl?: string | null;
    androidProductImage?: string | null;
    androidQRCode?: string | null;
    date_updated?: any | null;
    extensionDownloadUrl?: string | null;
    extensionProductImage?: string | null;
    id: string;
    iosDownloadUrl?: string | null;
    iosProductImage?: string | null;
    iosQRCode?: string | null;
    user_updated?: string | null;
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

export const DownloadDocument = gql`
  query download {
    download {
      androidDownloadUrl
      androidProductImage
      androidQRCode
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
      extensionDownloadUrl
      extensionProductImage
      id
      iosDownloadUrl
      iosProductImage
      iosQRCode
      user_updated
    }
  }
`;

/**
 * __useDownloadQuery__
 *
 * To run a query within a React component, call `useDownloadQuery` and pass it any options that fit your needs.
 * When your component renders, `useDownloadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDownloadQuery({
 *   variables: {
 *   },
 * });
 */
export function useDownloadQuery(baseOptions?: Apollo.QueryHookOptions<DownloadQuery, DownloadQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DownloadQuery, DownloadQueryVariables>(DownloadDocument, options);
}
export function useDownloadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DownloadQuery, DownloadQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DownloadQuery, DownloadQueryVariables>(DownloadDocument, options);
}
export type DownloadQueryHookResult = ReturnType<typeof useDownloadQuery>;
export type DownloadLazyQueryHookResult = ReturnType<typeof useDownloadLazyQuery>;
export type DownloadQueryResult = Apollo.QueryResult<DownloadQuery, DownloadQueryVariables>;
