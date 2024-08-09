import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ClientType_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.ClientType_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type ClientType_AggregatedQuery = {
  __typename?: 'Query';
  clientType_aggregated: Array<{
    __typename?: 'clientType_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: { __typename?: 'clientType_aggregated_count'; id?: number | null; name?: number | null } | null;
    countDistinct?: { __typename?: 'clientType_aggregated_count'; id?: number | null; name?: number | null } | null;
    avg?: { __typename?: 'clientType_aggregated_fields'; id?: number | null } | null;
    sum?: { __typename?: 'clientType_aggregated_fields'; id?: number | null } | null;
    avgDistinct?: { __typename?: 'clientType_aggregated_fields'; id?: number | null } | null;
    sumDistinct?: { __typename?: 'clientType_aggregated_fields'; id?: number | null } | null;
    min?: { __typename?: 'clientType_aggregated_fields'; id?: number | null } | null;
    max?: { __typename?: 'clientType_aggregated_fields'; id?: number | null } | null;
  }>;
};

export const ClientType_AggregatedDocument = gql`
  query clientType_aggregated(
    $groupBy: [String]
    $filter: clientType_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    clientType_aggregated(
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
 * __useClientType_AggregatedQuery__
 *
 * To run a query within a React component, call `useClientType_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientType_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientType_AggregatedQuery({
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
export function useClientType_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<ClientType_AggregatedQuery, ClientType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClientType_AggregatedQuery, ClientType_AggregatedQueryVariables>(
    ClientType_AggregatedDocument,
    options,
  );
}
export function useClientType_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClientType_AggregatedQuery, ClientType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClientType_AggregatedQuery, ClientType_AggregatedQueryVariables>(
    ClientType_AggregatedDocument,
    options,
  );
}
export type ClientType_AggregatedQueryHookResult = ReturnType<typeof useClientType_AggregatedQuery>;
export type ClientType_AggregatedLazyQueryHookResult = ReturnType<typeof useClientType_AggregatedLazyQuery>;
export type ClientType_AggregatedQueryResult = Apollo.QueryResult<
  ClientType_AggregatedQuery,
  ClientType_AggregatedQueryVariables
>;
