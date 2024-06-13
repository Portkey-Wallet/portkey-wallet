import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceMatch_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type EntranceMatch_By_IdQuery = {
  __typename?: 'Query';
  entranceMatch_by_id?: {
    __typename?: 'entranceMatch';
    id: string;
    status?: string | null;
    user_created?: string | null;
    date_created?: any | null;
    user_updated?: string | null;
    date_updated?: any | null;
    matchRuleList?: any | null;
    weight?: number | null;
    matchSwitch?: boolean | null;
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
    matchRuleList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  } | null;
};

export const EntranceMatch_By_IdDocument = gql`
  query entranceMatch_by_id($id: ID!) {
    entranceMatch_by_id(id: $id) {
      id
      status
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
      matchRuleList
      matchRuleList_func {
        count
      }
      weight
      matchSwitch
      description
    }
  }
`;

/**
 * __useEntranceMatch_By_IdQuery__
 *
 * To run a query within a React component, call `useEntranceMatch_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceMatch_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceMatch_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEntranceMatch_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<EntranceMatch_By_IdQuery, EntranceMatch_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceMatch_By_IdQuery, EntranceMatch_By_IdQueryVariables>(
    EntranceMatch_By_IdDocument,
    options,
  );
}
export function useEntranceMatch_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EntranceMatch_By_IdQuery, EntranceMatch_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceMatch_By_IdQuery, EntranceMatch_By_IdQueryVariables>(
    EntranceMatch_By_IdDocument,
    options,
  );
}
export type EntranceMatch_By_IdQueryHookResult = ReturnType<typeof useEntranceMatch_By_IdQuery>;
export type EntranceMatch_By_IdLazyQueryHookResult = ReturnType<typeof useEntranceMatch_By_IdLazyQuery>;
export type EntranceMatch_By_IdQueryResult = Apollo.QueryResult<
  EntranceMatch_By_IdQuery,
  EntranceMatch_By_IdQueryVariables
>;
