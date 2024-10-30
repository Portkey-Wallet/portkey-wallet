import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AppVersionQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.AppVersion_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type AppVersionQuery = {
  __typename?: 'Query';
  appVersion: Array<{
    __typename?: 'appVersion';
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
  }>;
};

export const AppVersionDocument = gql`
  query appVersion(
    $filter: appVersion_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    appVersion(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
 * __useAppVersionQuery__
 *
 * To run a query within a React component, call `useAppVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppVersionQuery({
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
export function useAppVersionQuery(baseOptions?: Apollo.QueryHookOptions<AppVersionQuery, AppVersionQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppVersionQuery, AppVersionQueryVariables>(AppVersionDocument, options);
}
export function useAppVersionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AppVersionQuery, AppVersionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppVersionQuery, AppVersionQueryVariables>(AppVersionDocument, options);
}
export type AppVersionQueryHookResult = ReturnType<typeof useAppVersionQuery>;
export type AppVersionLazyQueryHookResult = ReturnType<typeof useAppVersionLazyQuery>;
export type AppVersionQueryResult = Apollo.QueryResult<AppVersionQuery, AppVersionQueryVariables>;
