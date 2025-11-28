import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Entrance_EntranceMatch_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.Entrance_EntranceMatch_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type Entrance_EntranceMatch_AggregatedQuery = {
  __typename?: 'Query';
  entrance_entranceMatch_aggregated: Array<{
    __typename?: 'entrance_entranceMatch_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'entrance_entranceMatch_aggregated_count';
      entrance_id?: number | null;
      entranceMatch_id?: number | null;
      id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'entrance_entranceMatch_aggregated_count';
      entrance_id?: number | null;
      entranceMatch_id?: number | null;
      id?: number | null;
    } | null;
    avg?: {
      __typename?: 'entrance_entranceMatch_aggregated_fields';
      entrance_id?: number | null;
      entranceMatch_id?: number | null;
      id?: number | null;
    } | null;
    sum?: {
      __typename?: 'entrance_entranceMatch_aggregated_fields';
      entrance_id?: number | null;
      entranceMatch_id?: number | null;
      id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'entrance_entranceMatch_aggregated_fields';
      entrance_id?: number | null;
      entranceMatch_id?: number | null;
      id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'entrance_entranceMatch_aggregated_fields';
      entrance_id?: number | null;
      entranceMatch_id?: number | null;
      id?: number | null;
    } | null;
    min?: {
      __typename?: 'entrance_entranceMatch_aggregated_fields';
      entrance_id?: number | null;
      entranceMatch_id?: number | null;
      id?: number | null;
    } | null;
    max?: {
      __typename?: 'entrance_entranceMatch_aggregated_fields';
      entrance_id?: number | null;
      entranceMatch_id?: number | null;
      id?: number | null;
    } | null;
  }>;
};

export const Entrance_EntranceMatch_AggregatedDocument = gql`
  query entrance_entranceMatch_aggregated(
    $groupBy: [String]
    $filter: entrance_entranceMatch_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    entrance_entranceMatch_aggregated(
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
        entrance_id
        entranceMatch_id
        id
      }
      countDistinct {
        entrance_id
        entranceMatch_id
        id
      }
      avg {
        entrance_id
        entranceMatch_id
        id
      }
      sum {
        entrance_id
        entranceMatch_id
        id
      }
      avgDistinct {
        entrance_id
        entranceMatch_id
        id
      }
      sumDistinct {
        entrance_id
        entranceMatch_id
        id
      }
      min {
        entrance_id
        entranceMatch_id
        id
      }
      max {
        entrance_id
        entranceMatch_id
        id
      }
    }
  }
`;

/**
 * __useEntrance_EntranceMatch_AggregatedQuery__
 *
 * To run a query within a React component, call `useEntrance_EntranceMatch_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntrance_EntranceMatch_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntrance_EntranceMatch_AggregatedQuery({
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
export function useEntrance_EntranceMatch_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Entrance_EntranceMatch_AggregatedQuery,
    Entrance_EntranceMatch_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Entrance_EntranceMatch_AggregatedQuery, Entrance_EntranceMatch_AggregatedQueryVariables>(
    Entrance_EntranceMatch_AggregatedDocument,
    options,
  );
}
export function useEntrance_EntranceMatch_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Entrance_EntranceMatch_AggregatedQuery,
    Entrance_EntranceMatch_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Entrance_EntranceMatch_AggregatedQuery, Entrance_EntranceMatch_AggregatedQueryVariables>(
    Entrance_EntranceMatch_AggregatedDocument,
    options,
  );
}
export type Entrance_EntranceMatch_AggregatedQueryHookResult = ReturnType<
  typeof useEntrance_EntranceMatch_AggregatedQuery
>;
export type Entrance_EntranceMatch_AggregatedLazyQueryHookResult = ReturnType<
  typeof useEntrance_EntranceMatch_AggregatedLazyQuery
>;
export type Entrance_EntranceMatch_AggregatedQueryResult = Apollo.QueryResult<
  Entrance_EntranceMatch_AggregatedQuery,
  Entrance_EntranceMatch_AggregatedQueryVariables
>;
