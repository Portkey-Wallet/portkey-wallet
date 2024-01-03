import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BoilerplateQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Boilerplate_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type BoilerplateQuery = {
  __typename?: 'Query';
  boilerplate: Array<{
    __typename?: 'boilerplate';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    index?: number | null;
    name?: string | null;
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
  }>;
};

export const BoilerplateDocument = gql`
  query boilerplate(
    $filter: boilerplate_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    boilerplate(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
      url
      user_created
      user_updated
    }
  }
`;

/**
 * __useBoilerplateQuery__
 *
 * To run a query within a React component, call `useBoilerplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoilerplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoilerplateQuery({
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
export function useBoilerplateQuery(
  baseOptions?: Apollo.QueryHookOptions<BoilerplateQuery, BoilerplateQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BoilerplateQuery, BoilerplateQueryVariables>(BoilerplateDocument, options);
}
export function useBoilerplateLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<BoilerplateQuery, BoilerplateQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BoilerplateQuery, BoilerplateQueryVariables>(BoilerplateDocument, options);
}
export type BoilerplateQueryHookResult = ReturnType<typeof useBoilerplateQuery>;
export type BoilerplateLazyQueryHookResult = ReturnType<typeof useBoilerplateLazyQuery>;
export type BoilerplateQueryResult = Apollo.QueryResult<BoilerplateQuery, BoilerplateQueryVariables>;
