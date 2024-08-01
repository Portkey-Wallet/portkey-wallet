import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpgradeStyleQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.UpgradeStyle_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type UpgradeStyleQuery = {
  __typename?: 'Query';
  upgradeStyle: Array<{
    __typename?: 'upgradeStyle';
    attribute?: string | null;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    sort?: number | null;
    status?: string | null;
    user_created?: string | null;
    user_updated?: string | null;
    value?: number | null;
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

export const UpgradeStyleDocument = gql`
  query upgradeStyle(
    $filter: upgradeStyle_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    upgradeStyle(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
 * __useUpgradeStyleQuery__
 *
 * To run a query within a React component, call `useUpgradeStyleQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradeStyleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradeStyleQuery({
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
export function useUpgradeStyleQuery(
  baseOptions?: Apollo.QueryHookOptions<UpgradeStyleQuery, UpgradeStyleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UpgradeStyleQuery, UpgradeStyleQueryVariables>(UpgradeStyleDocument, options);
}
export function useUpgradeStyleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UpgradeStyleQuery, UpgradeStyleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UpgradeStyleQuery, UpgradeStyleQueryVariables>(UpgradeStyleDocument, options);
}
export type UpgradeStyleQueryHookResult = ReturnType<typeof useUpgradeStyleQuery>;
export type UpgradeStyleLazyQueryHookResult = ReturnType<typeof useUpgradeStyleLazyQuery>;
export type UpgradeStyleQueryResult = Apollo.QueryResult<UpgradeStyleQuery, UpgradeStyleQueryVariables>;
