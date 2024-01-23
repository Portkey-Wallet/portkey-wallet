import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DApp_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DApp_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DApp_AggregatedQuery = {
  __typename?: 'Query';
  dApp_aggregated: Array<{
    __typename?: 'dApp_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'dApp_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      logo?: number | null;
      name?: number | null;
      status?: number | null;
      url?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'dApp_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      logo?: number | null;
      name?: number | null;
      status?: number | null;
      url?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    avg?: { __typename?: 'dApp_aggregated_fields'; id?: number | null; index?: number | null } | null;
    sum?: { __typename?: 'dApp_aggregated_fields'; id?: number | null; index?: number | null } | null;
    avgDistinct?: { __typename?: 'dApp_aggregated_fields'; id?: number | null; index?: number | null } | null;
    sumDistinct?: { __typename?: 'dApp_aggregated_fields'; id?: number | null; index?: number | null } | null;
    min?: { __typename?: 'dApp_aggregated_fields'; id?: number | null; index?: number | null } | null;
    max?: { __typename?: 'dApp_aggregated_fields'; id?: number | null; index?: number | null } | null;
  }>;
};

export const DApp_AggregatedDocument = gql`
  query dApp_aggregated(
    $groupBy: [String]
    $filter: dApp_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    dApp_aggregated(
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
        logo
        name
        status
        url
        user_created
        user_updated
      }
      countDistinct {
        date_created
        date_updated
        id
        index
        logo
        name
        status
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
 * __useDApp_AggregatedQuery__
 *
 * To run a query within a React component, call `useDApp_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDApp_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDApp_AggregatedQuery({
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
export function useDApp_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<DApp_AggregatedQuery, DApp_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DApp_AggregatedQuery, DApp_AggregatedQueryVariables>(DApp_AggregatedDocument, options);
}
export function useDApp_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DApp_AggregatedQuery, DApp_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DApp_AggregatedQuery, DApp_AggregatedQueryVariables>(DApp_AggregatedDocument, options);
}
export type DApp_AggregatedQueryHookResult = ReturnType<typeof useDApp_AggregatedQuery>;
export type DApp_AggregatedLazyQueryHookResult = ReturnType<typeof useDApp_AggregatedLazyQuery>;
export type DApp_AggregatedQueryResult = Apollo.QueryResult<DApp_AggregatedQuery, DApp_AggregatedQueryVariables>;
