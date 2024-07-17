import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MyReferralBanner_PortkeyCard_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.MyReferralBanner_PortkeyCard_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type MyReferralBanner_PortkeyCard_AggregatedQuery = {
  __typename?: 'Query';
  myReferralBanner_portkeyCard_aggregated: Array<{
    __typename?: 'myReferralBanner_portkeyCard_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'myReferralBanner_portkeyCard_aggregated_count';
      id?: number | null;
      myReferralBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'myReferralBanner_portkeyCard_aggregated_count';
      id?: number | null;
      myReferralBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'myReferralBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      myReferralBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'myReferralBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      myReferralBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'myReferralBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      myReferralBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'myReferralBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      myReferralBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    min?: {
      __typename?: 'myReferralBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      myReferralBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
    max?: {
      __typename?: 'myReferralBanner_portkeyCard_aggregated_fields';
      id?: number | null;
      myReferralBanner_id?: number | null;
      portkeyCard_id?: number | null;
    } | null;
  }>;
};

export const MyReferralBanner_PortkeyCard_AggregatedDocument = gql`
  query myReferralBanner_portkeyCard_aggregated(
    $groupBy: [String]
    $filter: myReferralBanner_portkeyCard_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    myReferralBanner_portkeyCard_aggregated(
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
        myReferralBanner_id
        portkeyCard_id
      }
      countDistinct {
        id
        myReferralBanner_id
        portkeyCard_id
      }
      avg {
        id
        myReferralBanner_id
        portkeyCard_id
      }
      sum {
        id
        myReferralBanner_id
        portkeyCard_id
      }
      avgDistinct {
        id
        myReferralBanner_id
        portkeyCard_id
      }
      sumDistinct {
        id
        myReferralBanner_id
        portkeyCard_id
      }
      min {
        id
        myReferralBanner_id
        portkeyCard_id
      }
      max {
        id
        myReferralBanner_id
        portkeyCard_id
      }
    }
  }
`;

/**
 * __useMyReferralBanner_PortkeyCard_AggregatedQuery__
 *
 * To run a query within a React component, call `useMyReferralBanner_PortkeyCard_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyReferralBanner_PortkeyCard_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyReferralBanner_PortkeyCard_AggregatedQuery({
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
export function useMyReferralBanner_PortkeyCard_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    MyReferralBanner_PortkeyCard_AggregatedQuery,
    MyReferralBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    MyReferralBanner_PortkeyCard_AggregatedQuery,
    MyReferralBanner_PortkeyCard_AggregatedQueryVariables
  >(MyReferralBanner_PortkeyCard_AggregatedDocument, options);
}
export function useMyReferralBanner_PortkeyCard_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MyReferralBanner_PortkeyCard_AggregatedQuery,
    MyReferralBanner_PortkeyCard_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MyReferralBanner_PortkeyCard_AggregatedQuery,
    MyReferralBanner_PortkeyCard_AggregatedQueryVariables
  >(MyReferralBanner_PortkeyCard_AggregatedDocument, options);
}
export type MyReferralBanner_PortkeyCard_AggregatedQueryHookResult = ReturnType<
  typeof useMyReferralBanner_PortkeyCard_AggregatedQuery
>;
export type MyReferralBanner_PortkeyCard_AggregatedLazyQueryHookResult = ReturnType<
  typeof useMyReferralBanner_PortkeyCard_AggregatedLazyQuery
>;
export type MyReferralBanner_PortkeyCard_AggregatedQueryResult = Apollo.QueryResult<
  MyReferralBanner_PortkeyCard_AggregatedQuery,
  MyReferralBanner_PortkeyCard_AggregatedQueryVariables
>;
