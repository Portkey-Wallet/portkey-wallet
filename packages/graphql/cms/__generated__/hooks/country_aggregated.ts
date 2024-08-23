import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Country_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.Country_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type Country_AggregatedQuery = {
  __typename?: 'Query';
  country_aggregated: Array<{
    __typename?: 'country_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'country_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      label?: number | null;
      sort?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'country_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      label?: number | null;
      sort?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    avg?: { __typename?: 'country_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sum?: { __typename?: 'country_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    avgDistinct?: { __typename?: 'country_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sumDistinct?: { __typename?: 'country_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    min?: { __typename?: 'country_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    max?: { __typename?: 'country_aggregated_fields'; id?: number | null; sort?: number | null } | null;
  }>;
};

export const Country_AggregatedDocument = gql`
  query country_aggregated(
    $groupBy: [String]
    $filter: country_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    country_aggregated(
      groupBy: $groupBy
      filter: $filter
      limit: $limit
      offset: $offset
      page: $page
      search: $search
      sort: $sort
    ) {
      group
      countAll
      count {
        date_created
        date_updated
        id
        label
        sort
        status
        user_created
        user_updated
        value
      }
      countDistinct {
        date_created
        date_updated
        id
        label
        sort
        status
        user_created
        user_updated
        value
      }
      avg {
        id
        sort
      }
      sum {
        id
        sort
      }
      avgDistinct {
        id
        sort
      }
      sumDistinct {
        id
        sort
      }
      min {
        id
        sort
      }
      max {
        id
        sort
      }
    }
  }
`;

/**
 * __useCountry_AggregatedQuery__
 *
 * To run a query within a React component, call `useCountry_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountry_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountry_AggregatedQuery({
 *   variables: {
 *      groupBy: // value for 'groupBy'
 *      filter: // value for 'filter'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useCountry_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<Country_AggregatedQuery, Country_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Country_AggregatedQuery, Country_AggregatedQueryVariables>(
    Country_AggregatedDocument,
    options,
  );
}
export function useCountry_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Country_AggregatedQuery, Country_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Country_AggregatedQuery, Country_AggregatedQueryVariables>(
    Country_AggregatedDocument,
    options,
  );
}
export type Country_AggregatedQueryHookResult = ReturnType<typeof useCountry_AggregatedQuery>;
export type Country_AggregatedLazyQueryHookResult = ReturnType<typeof useCountry_AggregatedLazyQuery>;
export type Country_AggregatedQueryResult = Apollo.QueryResult<
  Country_AggregatedQuery,
  Country_AggregatedQueryVariables
>;
