import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Boilerplate_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.Boilerplate_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type Boilerplate_AggregatedQuery = {
  __typename?: 'Query';
  boilerplate_aggregated: Array<{
    __typename?: 'boilerplate_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'boilerplate_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      name?: number | null;
      url?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'boilerplate_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      name?: number | null;
      url?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    avg?: { __typename?: 'boilerplate_aggregated_fields'; id?: number | null; index?: number | null } | null;
    sum?: { __typename?: 'boilerplate_aggregated_fields'; id?: number | null; index?: number | null } | null;
    avgDistinct?: { __typename?: 'boilerplate_aggregated_fields'; id?: number | null; index?: number | null } | null;
    sumDistinct?: { __typename?: 'boilerplate_aggregated_fields'; id?: number | null; index?: number | null } | null;
    min?: { __typename?: 'boilerplate_aggregated_fields'; id?: number | null; index?: number | null } | null;
    max?: { __typename?: 'boilerplate_aggregated_fields'; id?: number | null; index?: number | null } | null;
  }>;
};

export const Boilerplate_AggregatedDocument = gql`
  query boilerplate_aggregated(
    $groupBy: [String]
    $filter: boilerplate_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    boilerplate_aggregated(
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
        index
        name
        url
        user_created
        user_updated
      }
      countDistinct {
        date_created
        date_updated
        id
        index
        name
        url
        user_created
        user_updated
      }
      avg {
        id
        index
      }
      sum {
        id
        index
      }
      avgDistinct {
        id
        index
      }
      sumDistinct {
        id
        index
      }
      min {
        id
        index
      }
      max {
        id
        index
      }
    }
  }
`;

/**
 * __useBoilerplate_AggregatedQuery__
 *
 * To run a query within a React component, call `useBoilerplate_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoilerplate_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoilerplate_AggregatedQuery({
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
export function useBoilerplate_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<Boilerplate_AggregatedQuery, Boilerplate_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Boilerplate_AggregatedQuery, Boilerplate_AggregatedQueryVariables>(
    Boilerplate_AggregatedDocument,
    options,
  );
}
export function useBoilerplate_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Boilerplate_AggregatedQuery, Boilerplate_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Boilerplate_AggregatedQuery, Boilerplate_AggregatedQueryVariables>(
    Boilerplate_AggregatedDocument,
    options,
  );
}
export type Boilerplate_AggregatedQueryHookResult = ReturnType<typeof useBoilerplate_AggregatedQuery>;
export type Boilerplate_AggregatedLazyQueryHookResult = ReturnType<typeof useBoilerplate_AggregatedLazyQuery>;
export type Boilerplate_AggregatedQueryResult = Apollo.QueryResult<
  Boilerplate_AggregatedQuery,
  Boilerplate_AggregatedQueryVariables
>;
