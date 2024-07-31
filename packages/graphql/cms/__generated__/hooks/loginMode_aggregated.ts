import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginMode_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.LoginMode_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type LoginMode_AggregatedQuery = {
  __typename?: 'Query';
  loginMode_aggregated: Array<{
    __typename?: 'loginMode_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'loginMode_aggregated_count';
      androidIndex?: number | null;
      androidRecommend?: number | null;
      defaultSwitch?: number | null;
      extensionIndex?: number | null;
      extensionRecommend?: number | null;
      id?: number | null;
      iOSIndex?: number | null;
      iOSRecommend?: number | null;
      status?: number | null;
      type?: number | null;
      matchList?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'loginMode_aggregated_count';
      androidIndex?: number | null;
      androidRecommend?: number | null;
      defaultSwitch?: number | null;
      extensionIndex?: number | null;
      extensionRecommend?: number | null;
      id?: number | null;
      iOSIndex?: number | null;
      iOSRecommend?: number | null;
      status?: number | null;
      type?: number | null;
      matchList?: number | null;
    } | null;
    avg?: {
      __typename?: 'loginMode_aggregated_fields';
      androidIndex?: number | null;
      extensionIndex?: number | null;
      id?: number | null;
      iOSIndex?: number | null;
      type?: number | null;
    } | null;
    sum?: {
      __typename?: 'loginMode_aggregated_fields';
      androidIndex?: number | null;
      extensionIndex?: number | null;
      id?: number | null;
      iOSIndex?: number | null;
      type?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'loginMode_aggregated_fields';
      androidIndex?: number | null;
      extensionIndex?: number | null;
      id?: number | null;
      iOSIndex?: number | null;
      type?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'loginMode_aggregated_fields';
      androidIndex?: number | null;
      extensionIndex?: number | null;
      id?: number | null;
      iOSIndex?: number | null;
      type?: number | null;
    } | null;
    min?: {
      __typename?: 'loginMode_aggregated_fields';
      androidIndex?: number | null;
      extensionIndex?: number | null;
      id?: number | null;
      iOSIndex?: number | null;
      type?: number | null;
    } | null;
    max?: {
      __typename?: 'loginMode_aggregated_fields';
      androidIndex?: number | null;
      extensionIndex?: number | null;
      id?: number | null;
      iOSIndex?: number | null;
      type?: number | null;
    } | null;
  }>;
};

export const LoginMode_AggregatedDocument = gql`
  query loginMode_aggregated(
    $groupBy: [String]
    $filter: loginMode_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    loginMode_aggregated(
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
        androidIndex
        androidRecommend
        defaultSwitch
        extensionIndex
        extensionRecommend
        id
        iOSIndex
        iOSRecommend
        status
        type
        matchList
      }
      countDistinct {
        androidIndex
        androidRecommend
        defaultSwitch
        extensionIndex
        extensionRecommend
        id
        iOSIndex
        iOSRecommend
        status
        type
        matchList
      }
      avg {
        androidIndex
        extensionIndex
        id
        iOSIndex
        type
      }
      sum {
        androidIndex
        extensionIndex
        id
        iOSIndex
        type
      }
      avgDistinct {
        androidIndex
        extensionIndex
        id
        iOSIndex
        type
      }
      sumDistinct {
        androidIndex
        extensionIndex
        id
        iOSIndex
        type
      }
      min {
        androidIndex
        extensionIndex
        id
        iOSIndex
        type
      }
      max {
        androidIndex
        extensionIndex
        id
        iOSIndex
        type
      }
    }
  }
`;

/**
 * __useLoginMode_AggregatedQuery__
 *
 * To run a query within a React component, call `useLoginMode_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginMode_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginMode_AggregatedQuery({
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
export function useLoginMode_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginMode_AggregatedQuery, LoginMode_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginMode_AggregatedQuery, LoginMode_AggregatedQueryVariables>(
    LoginMode_AggregatedDocument,
    options,
  );
}
export function useLoginMode_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginMode_AggregatedQuery, LoginMode_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginMode_AggregatedQuery, LoginMode_AggregatedQueryVariables>(
    LoginMode_AggregatedDocument,
    options,
  );
}
export type LoginMode_AggregatedQueryHookResult = ReturnType<typeof useLoginMode_AggregatedQuery>;
export type LoginMode_AggregatedLazyQueryHookResult = ReturnType<typeof useLoginMode_AggregatedLazyQuery>;
export type LoginMode_AggregatedQueryResult = Apollo.QueryResult<
  LoginMode_AggregatedQuery,
  LoginMode_AggregatedQueryVariables
>;
