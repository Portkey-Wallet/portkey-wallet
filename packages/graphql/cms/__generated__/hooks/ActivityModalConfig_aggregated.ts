import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ActivityModalConfig_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.ActivityModalConfig_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type ActivityModalConfig_AggregatedQuery = {
  __typename?: 'Query';
  ActivityModalConfig_aggregated: Array<{
    __typename?: 'ActivityModalConfig_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'ActivityModalConfig_aggregated_count';
      id?: number | null;
      clientType?: number | null;
      timingType?: number | null;
      show?: number | null;
      showClose?: number | null;
      headerImg?: number | null;
      title?: number | null;
      description?: number | null;
      negtiveTitle?: number | null;
      positiveTitle?: number | null;
      positiveAction?: number | null;
      timingOperation?: number | null;
      label?: number | null;
      negativeTitle?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'ActivityModalConfig_aggregated_count';
      id?: number | null;
      clientType?: number | null;
      timingType?: number | null;
      show?: number | null;
      showClose?: number | null;
      headerImg?: number | null;
      title?: number | null;
      description?: number | null;
      negtiveTitle?: number | null;
      positiveTitle?: number | null;
      positiveAction?: number | null;
      timingOperation?: number | null;
      label?: number | null;
      negativeTitle?: number | null;
    } | null;
    avg?: {
      __typename?: 'ActivityModalConfig_aggregated_fields';
      id?: number | null;
      clientType?: number | null;
      timingType?: number | null;
    } | null;
    sum?: {
      __typename?: 'ActivityModalConfig_aggregated_fields';
      id?: number | null;
      clientType?: number | null;
      timingType?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'ActivityModalConfig_aggregated_fields';
      id?: number | null;
      clientType?: number | null;
      timingType?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'ActivityModalConfig_aggregated_fields';
      id?: number | null;
      clientType?: number | null;
      timingType?: number | null;
    } | null;
    min?: {
      __typename?: 'ActivityModalConfig_aggregated_fields';
      id?: number | null;
      clientType?: number | null;
      timingType?: number | null;
    } | null;
    max?: {
      __typename?: 'ActivityModalConfig_aggregated_fields';
      id?: number | null;
      clientType?: number | null;
      timingType?: number | null;
    } | null;
  }>;
};

export const ActivityModalConfig_AggregatedDocument = gql`
  query ActivityModalConfig_aggregated(
    $groupBy: [String]
    $filter: ActivityModalConfig_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    ActivityModalConfig_aggregated(
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
        clientType
        timingType
        show
        showClose
        headerImg
        title
        description
        negtiveTitle
        positiveTitle
        positiveAction
        timingOperation
        label
        negativeTitle
      }
      countDistinct {
        id
        clientType
        timingType
        show
        showClose
        headerImg
        title
        description
        negtiveTitle
        positiveTitle
        positiveAction
        timingOperation
        label
        negativeTitle
      }
      avg {
        id
        clientType
        timingType
      }
      sum {
        id
        clientType
        timingType
      }
      avgDistinct {
        id
        clientType
        timingType
      }
      sumDistinct {
        id
        clientType
        timingType
      }
      min {
        id
        clientType
        timingType
      }
      max {
        id
        clientType
        timingType
      }
    }
  }
`;

/**
 * __useActivityModalConfig_AggregatedQuery__
 *
 * To run a query within a React component, call `useActivityModalConfig_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityModalConfig_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityModalConfig_AggregatedQuery({
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
export function useActivityModalConfig_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ActivityModalConfig_AggregatedQuery,
    ActivityModalConfig_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ActivityModalConfig_AggregatedQuery, ActivityModalConfig_AggregatedQueryVariables>(
    ActivityModalConfig_AggregatedDocument,
    options,
  );
}
export function useActivityModalConfig_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ActivityModalConfig_AggregatedQuery,
    ActivityModalConfig_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ActivityModalConfig_AggregatedQuery, ActivityModalConfig_AggregatedQueryVariables>(
    ActivityModalConfig_AggregatedDocument,
    options,
  );
}
export type ActivityModalConfig_AggregatedQueryHookResult = ReturnType<typeof useActivityModalConfig_AggregatedQuery>;
export type ActivityModalConfig_AggregatedLazyQueryHookResult = ReturnType<
  typeof useActivityModalConfig_AggregatedLazyQuery
>;
export type ActivityModalConfig_AggregatedQueryResult = Apollo.QueryResult<
  ActivityModalConfig_AggregatedQuery,
  ActivityModalConfig_AggregatedQueryVariables
>;
