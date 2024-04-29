import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceModuleNameQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.EntranceModuleName_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type EntranceModuleNameQuery = {
  __typename?: 'Query';
  entranceModuleName: Array<{
    __typename?: 'entranceModuleName';
    id: string;
    user_created?: string | null;
    date_created?: any | null;
    user_updated?: string | null;
    date_updated?: any | null;
    value?: string | null;
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
  }>;
};

export const EntranceModuleNameDocument = gql`
  query entranceModuleName(
    $filter: entranceModuleName_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    entranceModuleName(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      id
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
      value
      description
    }
  }
`;

/**
 * __useEntranceModuleNameQuery__
 *
 * To run a query within a React component, call `useEntranceModuleNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceModuleNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceModuleNameQuery({
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
export function useEntranceModuleNameQuery(
  baseOptions?: Apollo.QueryHookOptions<EntranceModuleNameQuery, EntranceModuleNameQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceModuleNameQuery, EntranceModuleNameQueryVariables>(
    EntranceModuleNameDocument,
    options,
  );
}
export function useEntranceModuleNameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EntranceModuleNameQuery, EntranceModuleNameQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceModuleNameQuery, EntranceModuleNameQueryVariables>(
    EntranceModuleNameDocument,
    options,
  );
}
export type EntranceModuleNameQueryHookResult = ReturnType<typeof useEntranceModuleNameQuery>;
export type EntranceModuleNameLazyQueryHookResult = ReturnType<typeof useEntranceModuleNameLazyQuery>;
export type EntranceModuleNameQueryResult = Apollo.QueryResult<
  EntranceModuleNameQuery,
  EntranceModuleNameQueryVariables
>;
