import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RememberMeBlackListSites_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type RememberMeBlackListSites_By_IdQuery = {
  __typename?: 'Query';
  rememberMeBlackListSites_by_id?: {
    __typename?: 'rememberMeBlackListSites';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    name?: string | null;
    sort?: number | null;
    status?: string | null;
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

export const RememberMeBlackListSites_By_IdDocument = gql`
  query rememberMeBlackListSites_by_id($id: ID!) {
    rememberMeBlackListSites_by_id(id: $id) {
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
      name
      sort
      status
      url
      user_created
      user_updated
    }
  }
`;

/**
 * __useRememberMeBlackListSites_By_IdQuery__
 *
 * To run a query within a React component, call `useRememberMeBlackListSites_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useRememberMeBlackListSites_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRememberMeBlackListSites_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRememberMeBlackListSites_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<
    RememberMeBlackListSites_By_IdQuery,
    RememberMeBlackListSites_By_IdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RememberMeBlackListSites_By_IdQuery, RememberMeBlackListSites_By_IdQueryVariables>(
    RememberMeBlackListSites_By_IdDocument,
    options,
  );
}
export function useRememberMeBlackListSites_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    RememberMeBlackListSites_By_IdQuery,
    RememberMeBlackListSites_By_IdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RememberMeBlackListSites_By_IdQuery, RememberMeBlackListSites_By_IdQueryVariables>(
    RememberMeBlackListSites_By_IdDocument,
    options,
  );
}
export type RememberMeBlackListSites_By_IdQueryHookResult = ReturnType<typeof useRememberMeBlackListSites_By_IdQuery>;
export type RememberMeBlackListSites_By_IdLazyQueryHookResult = ReturnType<
  typeof useRememberMeBlackListSites_By_IdLazyQuery
>;
export type RememberMeBlackListSites_By_IdQueryResult = Apollo.QueryResult<
  RememberMeBlackListSites_By_IdQuery,
  RememberMeBlackListSites_By_IdQueryVariables
>;
