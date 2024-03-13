import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceModuleName_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.EntranceModuleName_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type EntranceModuleName_AggregatedQuery = {
  __typename?: 'Query';
  entranceModuleName_aggregated: Array<{
    __typename?: 'entranceModuleName_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'entranceModuleName_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      description?: number | null;
      id?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'entranceModuleName_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      description?: number | null;
      id?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
      value?: number | null;
    } | null;
    avg?: { __typename?: 'entranceModuleName_aggregated_fields'; id?: number | null } | null;
    sum?: { __typename?: 'entranceModuleName_aggregated_fields'; id?: number | null } | null;
    avgDistinct?: { __typename?: 'entranceModuleName_aggregated_fields'; id?: number | null } | null;
    sumDistinct?: { __typename?: 'entranceModuleName_aggregated_fields'; id?: number | null } | null;
    min?: { __typename?: 'entranceModuleName_aggregated_fields'; id?: number | null } | null;
    max?: { __typename?: 'entranceModuleName_aggregated_fields'; id?: number | null } | null;
  }>;
};

export const EntranceModuleName_AggregatedDocument = gql`
  query entranceModuleName_aggregated(
    $groupBy: [String]
    $filter: entranceModuleName_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    entranceModuleName_aggregated(
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
        user_created
        user_updated
        value
      }
      countDistinct {
        date_created
        date_updated
        description
        id
        user_created
        user_updated
        value
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
 * __useEntranceModuleName_AggregatedQuery__
 *
 * To run a query within a React component, call `useEntranceModuleName_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceModuleName_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceModuleName_AggregatedQuery({
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
export function useEntranceModuleName_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    EntranceModuleName_AggregatedQuery,
    EntranceModuleName_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceModuleName_AggregatedQuery, EntranceModuleName_AggregatedQueryVariables>(
    EntranceModuleName_AggregatedDocument,
    options,
  );
}
export function useEntranceModuleName_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    EntranceModuleName_AggregatedQuery,
    EntranceModuleName_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceModuleName_AggregatedQuery, EntranceModuleName_AggregatedQueryVariables>(
    EntranceModuleName_AggregatedDocument,
    options,
  );
}
export type EntranceModuleName_AggregatedQueryHookResult = ReturnType<typeof useEntranceModuleName_AggregatedQuery>;
export type EntranceModuleName_AggregatedLazyQueryHookResult = ReturnType<
  typeof useEntranceModuleName_AggregatedLazyQuery
>;
export type EntranceModuleName_AggregatedQueryResult = Apollo.QueryResult<
  EntranceModuleName_AggregatedQuery,
  EntranceModuleName_AggregatedQueryVariables
>;
