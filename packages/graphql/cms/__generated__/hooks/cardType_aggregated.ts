import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CardType_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.CardType_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type CardType_AggregatedQuery = {
  __typename?: 'Query';
  cardType_aggregated: Array<{
    __typename?: 'cardType_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'cardType_aggregated_count';
      id?: number | null;
      label?: number | null;
      status?: number | null;
      value?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'cardType_aggregated_count';
      id?: number | null;
      label?: number | null;
      status?: number | null;
      value?: number | null;
    } | null;
    avg?: { __typename?: 'cardType_aggregated_fields'; id?: number | null } | null;
    sum?: { __typename?: 'cardType_aggregated_fields'; id?: number | null } | null;
    avgDistinct?: { __typename?: 'cardType_aggregated_fields'; id?: number | null } | null;
    sumDistinct?: { __typename?: 'cardType_aggregated_fields'; id?: number | null } | null;
    min?: { __typename?: 'cardType_aggregated_fields'; id?: number | null } | null;
    max?: { __typename?: 'cardType_aggregated_fields'; id?: number | null } | null;
  }>;
};

export const CardType_AggregatedDocument = gql`
  query cardType_aggregated(
    $groupBy: [String]
    $filter: cardType_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    cardType_aggregated(
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
        label
        status
        value
      }
      countDistinct {
        id
        label
        status
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
 * __useCardType_AggregatedQuery__
 *
 * To run a query within a React component, call `useCardType_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardType_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardType_AggregatedQuery({
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
export function useCardType_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<CardType_AggregatedQuery, CardType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CardType_AggregatedQuery, CardType_AggregatedQueryVariables>(
    CardType_AggregatedDocument,
    options,
  );
}
export function useCardType_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CardType_AggregatedQuery, CardType_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CardType_AggregatedQuery, CardType_AggregatedQueryVariables>(
    CardType_AggregatedDocument,
    options,
  );
}
export type CardType_AggregatedQueryHookResult = ReturnType<typeof useCardType_AggregatedQuery>;
export type CardType_AggregatedLazyQueryHookResult = ReturnType<typeof useCardType_AggregatedLazyQuery>;
export type CardType_AggregatedQueryResult = Apollo.QueryResult<
  CardType_AggregatedQuery,
  CardType_AggregatedQueryVariables
>;
