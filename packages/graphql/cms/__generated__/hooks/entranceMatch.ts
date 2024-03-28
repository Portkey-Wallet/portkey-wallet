import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceMatchQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.EntranceMatch_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type EntranceMatchQuery = {
  __typename?: 'Query';
  entranceMatch: Array<{
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
  }>;
};

export const EntranceMatchDocument = gql`
  query entranceMatch(
    $filter: entranceMatch_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    entranceMatch(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
 * __useEntranceMatchQuery__
 *
 * To run a query within a React component, call `useEntranceMatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceMatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceMatchQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useEntranceMatchQuery(
  baseOptions?: Apollo.QueryHookOptions<EntranceMatchQuery, EntranceMatchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceMatchQuery, EntranceMatchQueryVariables>(EntranceMatchDocument, options);
}
export function useEntranceMatchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EntranceMatchQuery, EntranceMatchQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceMatchQuery, EntranceMatchQueryVariables>(EntranceMatchDocument, options);
}
export type EntranceMatchQueryHookResult = ReturnType<typeof useEntranceMatchQuery>;
export type EntranceMatchLazyQueryHookResult = ReturnType<typeof useEntranceMatchLazyQuery>;
export type EntranceMatchQueryResult = Apollo.QueryResult<EntranceMatchQuery, EntranceMatchQueryVariables>;
