import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HomeBanner_PortkeyCard_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.HomeBanner_PortkeyCard_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type HomeBanner_PortkeyCard_AggregatedQuery = {
  __typename?: 'Query';
  homeBanner_portkeyCard_aggregated: Array<{
    __typename?: 'homeBanner_portkeyCard_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'homeBanner_portkeyCard_aggregated_count';
      homeBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'homeBanner_portkeyCard_aggregated_count';
      homeBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'homeBanner_portkeyCard_aggregated_fields';
      homeBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'homeBanner_portkeyCard_aggregated_fields';
      homeBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'homeBanner_portkeyCard_aggregated_fields';
      homeBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'homeBanner_portkeyCard_aggregated_fields';
      homeBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    min?: {
      __typename?: 'homeBanner_portkeyCard_aggregated_fields';
      homeBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    max?: {
      __typename?: 'homeBanner_portkeyCard_aggregated_fields';
      homeBanner_id?: number | null;
      id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
  }>;
};

export const HomeBanner_PortkeyCard_AggregatedDocument = gql`
  query homeBanner_portkeyCard_aggregated(
    $groupBy: [String]
    $filter: homeBanner_portkeyCard_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    homeBanner_portkeyCard_aggregated(
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
        homeBanner_id
        id
        portkeyCard_id
      }
      countDistinct {
        homeBanner_id
        id
        portkeyCard_id
      }
      avg {
        homeBanner_id
        id
        portkeyCard_id
      }
      sum {
        homeBanner_id
        id
        portkeyCard_id
      }
      avgDistinct {
        homeBanner_id
        id
        portkeyCard_id
      }
      sumDistinct {
        homeBanner_id
        id
        portkeyCard_id
      }
      min {
        homeBanner_id
        id
        portkeyCard_id
      }
      max {
        homeBanner_id
        id
        portkeyCard_id
      }
    }
  }
`;

/**
 * __useHomeBanner_PortkeyCard_AggregatedQuery__
 *
 * To run a query within a React component, call `useHomeBanner_PortkeyCard_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeBanner_PortkeyCard_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeBanner_PortkeyCard_AggregatedQuery({
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
export function useHomeBanner_PortkeyCard_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    HomeBanner_PortkeyCard_AggregatedQuery,
    HomeBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HomeBanner_PortkeyCard_AggregatedQuery, HomeBanner_PortkeyCard_AggregatedQueryVariables>(
    HomeBanner_PortkeyCard_AggregatedDocument,
    options,
  );
}
export function useHomeBanner_PortkeyCard_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    HomeBanner_PortkeyCard_AggregatedQuery,
    HomeBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HomeBanner_PortkeyCard_AggregatedQuery, HomeBanner_PortkeyCard_AggregatedQueryVariables>(
    HomeBanner_PortkeyCard_AggregatedDocument,
    options,
  );
}
export type HomeBanner_PortkeyCard_AggregatedQueryHookResult = ReturnType<
  typeof useHomeBanner_PortkeyCard_AggregatedQuery
>;
export type HomeBanner_PortkeyCard_AggregatedLazyQueryHookResult = ReturnType<
  typeof useHomeBanner_PortkeyCard_AggregatedLazyQuery
>;
export type HomeBanner_PortkeyCard_AggregatedQueryResult = Apollo.QueryResult<
  HomeBanner_PortkeyCard_AggregatedQuery,
  HomeBanner_PortkeyCard_AggregatedQueryVariables
>;
