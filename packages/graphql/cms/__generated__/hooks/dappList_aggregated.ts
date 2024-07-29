import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DappList_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.DappList_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type DappList_AggregatedQuery = {
  __typename?: 'Query';
  dappList_aggregated: Array<{
    __typename?: 'dappList_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'dappList_aggregated_count';
      id?: number | null;
      domainName?: number | null;
      Dapp_Name?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'dappList_aggregated_count';
      id?: number | null;
      domainName?: number | null;
      Dapp_Name?: number | null;
    } | null;
    avg?: { __typename?: 'dappList_aggregated_fields'; id?: number | null } | null;
    sum?: { __typename?: 'dappList_aggregated_fields'; id?: number | null } | null;
    avgDistinct?: { __typename?: 'dappList_aggregated_fields'; id?: number | null } | null;
    sumDistinct?: { __typename?: 'dappList_aggregated_fields'; id?: number | null } | null;
    min?: { __typename?: 'dappList_aggregated_fields'; id?: number | null } | null;
    max?: { __typename?: 'dappList_aggregated_fields'; id?: number | null } | null;
  }>;
};

export const DappList_AggregatedDocument = gql`
  query dappList_aggregated(
    $groupBy: [String]
    $filter: dappList_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    dappList_aggregated(
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
        domainName
        Dapp_Name
      }
      countDistinct {
        id
        domainName
        Dapp_Name
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
 * __useDappList_AggregatedQuery__
 *
 * To run a query within a React component, call `useDappList_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useDappList_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDappList_AggregatedQuery({
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
export function useDappList_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<DappList_AggregatedQuery, DappList_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DappList_AggregatedQuery, DappList_AggregatedQueryVariables>(
    DappList_AggregatedDocument,
    options,
  );
}
export function useDappList_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DappList_AggregatedQuery, DappList_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DappList_AggregatedQuery, DappList_AggregatedQueryVariables>(
    DappList_AggregatedDocument,
    options,
  );
}
export type DappList_AggregatedQueryHookResult = ReturnType<typeof useDappList_AggregatedQuery>;
export type DappList_AggregatedLazyQueryHookResult = ReturnType<typeof useDappList_AggregatedLazyQuery>;
export type DappList_AggregatedQueryResult = Apollo.QueryResult<
  DappList_AggregatedQuery,
  DappList_AggregatedQueryVariables
>;
