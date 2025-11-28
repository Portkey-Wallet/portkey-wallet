import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CountryQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Country_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type CountryQuery = {
  __typename?: 'Query';
  country: Array<{
    __typename?: 'country';
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

export const CountryDocument = gql`
  query country($filter: country_filter, $sort: [String], $limit: Int, $offset: Int, $page: Int, $search: String) {
    country(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
 * __useCountryQuery__
 *
 * To run a query within a React component, call `useCountryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountryQuery({
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
export function useCountryQuery(baseOptions?: Apollo.QueryHookOptions<CountryQuery, CountryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CountryQuery, CountryQueryVariables>(CountryDocument, options);
}
export function useCountryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CountryQuery, CountryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CountryQuery, CountryQueryVariables>(CountryDocument, options);
}
export type CountryQueryHookResult = ReturnType<typeof useCountryQuery>;
export type CountryLazyQueryHookResult = ReturnType<typeof useCountryLazyQuery>;
export type CountryQueryResult = Apollo.QueryResult<CountryQuery, CountryQueryVariables>;
