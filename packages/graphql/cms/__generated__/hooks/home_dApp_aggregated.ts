import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Home_DApp_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.Home_DApp_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type Home_DApp_AggregatedQuery = {
  __typename?: 'Query';
  home_dApp_aggregated: Array<{
    __typename?: 'home_dApp_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'home_dApp_aggregated_count';
      dApp_id?: number | null;
      home_id?: number | null;
      id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'home_dApp_aggregated_count';
      dApp_id?: number | null;
      home_id?: number | null;
      id?: number | null;
    } | null;
    avg?: {
      __typename?: 'home_dApp_aggregated_fields';
      dApp_id?: number | null;
      home_id?: number | null;
      id?: number | null;
    } | null;
    sum?: {
      __typename?: 'home_dApp_aggregated_fields';
      dApp_id?: number | null;
      home_id?: number | null;
      id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'home_dApp_aggregated_fields';
      dApp_id?: number | null;
      home_id?: number | null;
      id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'home_dApp_aggregated_fields';
      dApp_id?: number | null;
      home_id?: number | null;
      id?: number | null;
    } | null;
    min?: {
      __typename?: 'home_dApp_aggregated_fields';
      dApp_id?: number | null;
      home_id?: number | null;
      id?: number | null;
    } | null;
    max?: {
      __typename?: 'home_dApp_aggregated_fields';
      dApp_id?: number | null;
      home_id?: number | null;
      id?: number | null;
    } | null;
  }>;
};

export const Home_DApp_AggregatedDocument = gql`
  query home_dApp_aggregated(
    $groupBy: [String]
    $filter: home_dApp_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    home_dApp_aggregated(
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
        dApp_id
        home_id
        id
      }
      countDistinct {
        dApp_id
        home_id
        id
      }
      avg {
        dApp_id
        home_id
        id
      }
      sum {
        dApp_id
        home_id
        id
      }
      avgDistinct {
        dApp_id
        home_id
        id
      }
      sumDistinct {
        dApp_id
        home_id
        id
      }
      min {
        dApp_id
        home_id
        id
      }
      max {
        dApp_id
        home_id
        id
      }
    }
  }
`;

/**
 * __useHome_DApp_AggregatedQuery__
 *
 * To run a query within a React component, call `useHome_DApp_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useHome_DApp_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHome_DApp_AggregatedQuery({
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
export function useHome_DApp_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<Home_DApp_AggregatedQuery, Home_DApp_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Home_DApp_AggregatedQuery, Home_DApp_AggregatedQueryVariables>(
    Home_DApp_AggregatedDocument,
    options,
  );
}
export function useHome_DApp_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Home_DApp_AggregatedQuery, Home_DApp_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Home_DApp_AggregatedQuery, Home_DApp_AggregatedQueryVariables>(
    Home_DApp_AggregatedDocument,
    options,
  );
}
export type Home_DApp_AggregatedQueryHookResult = ReturnType<typeof useHome_DApp_AggregatedQuery>;
export type Home_DApp_AggregatedLazyQueryHookResult = ReturnType<typeof useHome_DApp_AggregatedLazyQuery>;
export type Home_DApp_AggregatedQueryResult = Apollo.QueryResult<
  Home_DApp_AggregatedQuery,
  Home_DApp_AggregatedQueryVariables
>;
