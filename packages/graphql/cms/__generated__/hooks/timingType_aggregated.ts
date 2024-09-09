import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TimingType_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.TimingType_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type TimingType_AggregatedQuery = {
  __typename?: 'Query';
  timingType_aggregated: Array<{
    __typename?: 'timingType_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: { __typename?: 'timingType_aggregated_count'; id?: number | null; name?: number | null } | null;
    countDistinct?: { __typename?: 'timingType_aggregated_count'; id?: number | null; name?: number | null } | null;
    avg?: { __typename?: 'timingType_aggregated_fields'; id?: number | null } | null;
    sum?: { __typename?: 'timingType_aggregated_fields'; id?: number | null } | null;
    avgDistinct?: { __typename?: 'timingType_aggregated_fields'; id?: number | null } | null;
    sumDistinct?: { __typename?: 'timingType_aggregated_fields'; id?: number | null } | null;
    min?: { __typename?: 'timingType_aggregated_fields'; id?: number | null } | null;
    max?: { __typename?: 'timingType_aggregated_fields'; id?: number | null } | null;
  }>;
};

export const TimingType_AggregatedDocument = gql`
  query timingType_aggregated(
    $groupBy: [String]
    $filter: timingType_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    timingType_aggregated(
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
        id
        name
      }
      countDistinct {
        id
        name
      }
      avg {
        id
      }
      sum {
        id
      }
      avgDistinct {
        id
      }
      sumDistinct {
        id
      }
      min {
        id
      }
      max {
        id
      }
    }
  }
`;

/**
 * __useTimingType_AggregatedQuery__
 *
 * To run a query within a React component, call `useTimingType_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimingType_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimingType_AggregatedQuery({
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
export function useTimingType_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<TimingType_AggregatedQuery, TimingType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TimingType_AggregatedQuery, TimingType_AggregatedQueryVariables>(
    TimingType_AggregatedDocument,
    options,
  );
}
export function useTimingType_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TimingType_AggregatedQuery, TimingType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TimingType_AggregatedQuery, TimingType_AggregatedQueryVariables>(
    TimingType_AggregatedDocument,
    options,
  );
}
export type TimingType_AggregatedQueryHookResult = ReturnType<typeof useTimingType_AggregatedQuery>;
export type TimingType_AggregatedLazyQueryHookResult = ReturnType<typeof useTimingType_AggregatedLazyQuery>;
export type TimingType_AggregatedQueryResult = Apollo.QueryResult<
  TimingType_AggregatedQuery,
  TimingType_AggregatedQueryVariables
>;
