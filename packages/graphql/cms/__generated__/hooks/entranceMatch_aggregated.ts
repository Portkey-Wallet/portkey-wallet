import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceMatch_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.EntranceMatch_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type EntranceMatch_AggregatedQuery = {
  __typename?: 'Query';
  entranceMatch_aggregated: Array<{
    __typename?: 'entranceMatch_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'entranceMatch_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      description?: number | null;
      id?: number | null;
      matchRuleList?: number | null;
      matchSwitch?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      weight?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'entranceMatch_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      description?: number | null;
      id?: number | null;
      matchRuleList?: number | null;
      matchSwitch?: number | null;
      status?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      weight?: number | null;
    } | null;
    avg?: { __typename?: 'entranceMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
    sum?: { __typename?: 'entranceMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
    avgDistinct?: { __typename?: 'entranceMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
    sumDistinct?: { __typename?: 'entranceMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
    min?: { __typename?: 'entranceMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
    max?: { __typename?: 'entranceMatch_aggregated_fields'; id?: number | null; weight?: number | null } | null;
  }>;
};

export const EntranceMatch_AggregatedDocument = gql`
  query entranceMatch_aggregated(
    $groupBy: [String]
    $filter: entranceMatch_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    entranceMatch_aggregated(
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
        description
        id
        matchRuleList
        matchSwitch
        status
        user_created
        user_updated
        weight
      }
      countDistinct {
        date_created
        date_updated
        description
        id
        matchRuleList
        matchSwitch
        status
        user_created
        user_updated
        weight
      }
      avg {
        id
        weight
      }
      sum {
        id
        weight
      }
      avgDistinct {
        id
        weight
      }
      sumDistinct {
        id
        weight
      }
      min {
        id
        weight
      }
      max {
        id
        weight
      }
    }
  }
`;

/**
 * __useEntranceMatch_AggregatedQuery__
 *
 * To run a query within a React component, call `useEntranceMatch_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceMatch_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceMatch_AggregatedQuery({
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
export function useEntranceMatch_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<EntranceMatch_AggregatedQuery, EntranceMatch_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceMatch_AggregatedQuery, EntranceMatch_AggregatedQueryVariables>(
    EntranceMatch_AggregatedDocument,
    options,
  );
}
export function useEntranceMatch_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EntranceMatch_AggregatedQuery, EntranceMatch_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceMatch_AggregatedQuery, EntranceMatch_AggregatedQueryVariables>(
    EntranceMatch_AggregatedDocument,
    options,
  );
}
export type EntranceMatch_AggregatedQueryHookResult = ReturnType<typeof useEntranceMatch_AggregatedQuery>;
export type EntranceMatch_AggregatedLazyQueryHookResult = ReturnType<typeof useEntranceMatch_AggregatedLazyQuery>;
export type EntranceMatch_AggregatedQueryResult = Apollo.QueryResult<
  EntranceMatch_AggregatedQuery,
  EntranceMatch_AggregatedQueryVariables
>;
