import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Entrance_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.Entrance_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type Entrance_AggregatedQuery = {
  __typename?: 'Query';
  entrance_aggregated: Array<{
    __typename?: 'entrance_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'entrance_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      defaultSwitch?: number | null;
      id?: number | null;
      moduleName?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      matchList?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'entrance_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      defaultSwitch?: number | null;
      id?: number | null;
      moduleName?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      matchList?: number | null;
    } | null;
    avg?: { __typename?: 'entrance_aggregated_fields'; id?: number | null; moduleName?: number | null } | null;
    sum?: { __typename?: 'entrance_aggregated_fields'; id?: number | null; moduleName?: number | null } | null;
    avgDistinct?: { __typename?: 'entrance_aggregated_fields'; id?: number | null; moduleName?: number | null } | null;
    sumDistinct?: { __typename?: 'entrance_aggregated_fields'; id?: number | null; moduleName?: number | null } | null;
    min?: { __typename?: 'entrance_aggregated_fields'; id?: number | null; moduleName?: number | null } | null;
    max?: { __typename?: 'entrance_aggregated_fields'; id?: number | null; moduleName?: number | null } | null;
  }>;
};

export const Entrance_AggregatedDocument = gql`
  query entrance_aggregated(
    $groupBy: [String]
    $filter: entrance_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    entrance_aggregated(
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
        defaultSwitch
        id
        moduleName
        user_created
        user_updated
        matchList
      }
      countDistinct {
        date_created
        date_updated
        defaultSwitch
        id
        moduleName
        user_created
        user_updated
        matchList
      }
      avg {
        id
        moduleName
      }
      sum {
        id
        moduleName
      }
      avgDistinct {
        id
        moduleName
      }
      sumDistinct {
        id
        moduleName
      }
      min {
        id
        moduleName
      }
      max {
        id
        moduleName
      }
    }
  }
`;

/**
 * __useEntrance_AggregatedQuery__
 *
 * To run a query within a React component, call `useEntrance_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntrance_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntrance_AggregatedQuery({
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
export function useEntrance_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<Entrance_AggregatedQuery, Entrance_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Entrance_AggregatedQuery, Entrance_AggregatedQueryVariables>(
    Entrance_AggregatedDocument,
    options,
  );
}
export function useEntrance_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Entrance_AggregatedQuery, Entrance_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Entrance_AggregatedQuery, Entrance_AggregatedQueryVariables>(
    Entrance_AggregatedDocument,
    options,
  );
}
export type Entrance_AggregatedQueryHookResult = ReturnType<typeof useEntrance_AggregatedQuery>;
export type Entrance_AggregatedLazyQueryHookResult = ReturnType<typeof useEntrance_AggregatedLazyQuery>;
export type Entrance_AggregatedQueryResult = Apollo.QueryResult<
  Entrance_AggregatedQuery,
  Entrance_AggregatedQueryVariables
>;
