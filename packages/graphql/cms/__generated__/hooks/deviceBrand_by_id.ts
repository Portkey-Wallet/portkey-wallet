import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeviceBrand_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type DeviceBrand_By_IdQuery = {
  __typename?: 'Query';
  deviceBrand_by_id?: {
    __typename?: 'deviceBrand';
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

export const DeviceBrand_By_IdDocument = gql`
  query deviceBrand_by_id($id: ID!) {
    deviceBrand_by_id(id: $id) {
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
 * __useDeviceBrand_By_IdQuery__
 *
 * To run a query within a React component, call `useDeviceBrand_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeviceBrand_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeviceBrand_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeviceBrand_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<DeviceBrand_By_IdQuery, DeviceBrand_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DeviceBrand_By_IdQuery, DeviceBrand_By_IdQueryVariables>(DeviceBrand_By_IdDocument, options);
}
export function useDeviceBrand_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DeviceBrand_By_IdQuery, DeviceBrand_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DeviceBrand_By_IdQuery, DeviceBrand_By_IdQueryVariables>(
    DeviceBrand_By_IdDocument,
    options,
  );
}
export type DeviceBrand_By_IdQueryHookResult = ReturnType<typeof useDeviceBrand_By_IdQuery>;
export type DeviceBrand_By_IdLazyQueryHookResult = ReturnType<typeof useDeviceBrand_By_IdLazyQuery>;
export type DeviceBrand_By_IdQueryResult = Apollo.QueryResult<DeviceBrand_By_IdQuery, DeviceBrand_By_IdQueryVariables>;
