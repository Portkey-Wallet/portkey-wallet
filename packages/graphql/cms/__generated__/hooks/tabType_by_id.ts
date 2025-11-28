import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TabType_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type TabType_By_IdQuery = {
  __typename?: 'Query';
  tabType_by_id?: {
    __typename?: 'tabType';
    attribute?: string | null;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
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

export const TabType_By_IdDocument = gql`
  query tabType_by_id($id: ID!) {
    tabType_by_id(id: $id) {
      attribute
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
      sort
      status
      user_created
      user_updated
      value
    }
  }
`;

/**
 * __useTabType_By_IdQuery__
 *
 * To run a query within a React component, call `useTabType_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTabType_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTabType_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTabType_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<TabType_By_IdQuery, TabType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TabType_By_IdQuery, TabType_By_IdQueryVariables>(TabType_By_IdDocument, options);
}
export function useTabType_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TabType_By_IdQuery, TabType_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TabType_By_IdQuery, TabType_By_IdQueryVariables>(TabType_By_IdDocument, options);
}
export type TabType_By_IdQueryHookResult = ReturnType<typeof useTabType_By_IdQuery>;
export type TabType_By_IdLazyQueryHookResult = ReturnType<typeof useTabType_By_IdLazyQuery>;
export type TabType_By_IdQueryResult = Apollo.QueryResult<TabType_By_IdQuery, TabType_By_IdQueryVariables>;
