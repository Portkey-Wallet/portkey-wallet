import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKit_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type MediaKit_By_IdQuery = {
  __typename?: 'Query';
  mediaKit_by_id?: {
    __typename?: 'mediaKit';
    backgroundColor?: string | null;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    index?: number | null;
    name: string;
    png?: string | null;
    sort?: number | null;
    status?: string | null;
    svg?: string | null;
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

export const MediaKit_By_IdDocument = gql`
  query mediaKit_by_id($id: ID!) {
    mediaKit_by_id(id: $id) {
      backgroundColor
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
      png
      sort
      status
      svg
      user_created
      user_updated
    }
  }
`;

/**
 * __useMediaKit_By_IdQuery__
 *
 * To run a query within a React component, call `useMediaKit_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKit_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKit_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMediaKit_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>(MediaKit_By_IdDocument, options);
}
export function useMediaKit_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>(MediaKit_By_IdDocument, options);
}
export type MediaKit_By_IdQueryHookResult = ReturnType<typeof useMediaKit_By_IdQuery>;
export type MediaKit_By_IdLazyQueryHookResult = ReturnType<typeof useMediaKit_By_IdLazyQuery>;
export type MediaKit_By_IdQueryResult = Apollo.QueryResult<MediaKit_By_IdQuery, MediaKit_By_IdQueryVariables>;
