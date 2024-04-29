import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CodePushControl_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.CodePushControl_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type CodePushControl_AggregatedQuery = {
  __typename?: 'Query';
  codePushControl_aggregated: Array<{
    __typename?: 'codePushControl_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'codePushControl_aggregated_count';
      id?: number | null;
      status?: number | null;
      sort?: number | null;
      user_created?: number | null;
      date_created?: number | null;
      user_updated?: number | null;
      date_updated?: number | null;
      version?: number | null;
      label?: number | null;
      title?: number | null;
      content?: number | null;
      isForceUpdate?: number | null;
      updatedTitle?: number | null;
      updatedContent?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'codePushControl_aggregated_count';
      id?: number | null;
      status?: number | null;
      sort?: number | null;
      user_created?: number | null;
      date_created?: number | null;
      user_updated?: number | null;
      date_updated?: number | null;
      version?: number | null;
      label?: number | null;
      title?: number | null;
      content?: number | null;
      isForceUpdate?: number | null;
      updatedTitle?: number | null;
      updatedContent?: number | null;
    } | null;
    avg?: { __typename?: 'codePushControl_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sum?: { __typename?: 'codePushControl_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    avgDistinct?: { __typename?: 'codePushControl_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    sumDistinct?: { __typename?: 'codePushControl_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    min?: { __typename?: 'codePushControl_aggregated_fields'; id?: number | null; sort?: number | null } | null;
    max?: { __typename?: 'codePushControl_aggregated_fields'; id?: number | null; sort?: number | null } | null;
  }>;
};

export const CodePushControl_AggregatedDocument = gql`
  query codePushControl_aggregated(
    $groupBy: [String]
    $filter: codePushControl_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    codePushControl_aggregated(
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
        status
        sort
        user_created
        date_created
        user_updated
        date_updated
        version
        label
        title
        content
        isForceUpdate
        updatedTitle
        updatedContent
      }
      countDistinct {
        id
        status
        sort
        user_created
        date_created
        user_updated
        date_updated
        version
        label
        title
        content
        isForceUpdate
        updatedTitle
        updatedContent
      }
      avg {
        id
        sort
      }
      sum {
        id
        sort
      }
      avgDistinct {
        id
        sort
      }
      sumDistinct {
        id
        sort
      }
      min {
        id
        sort
      }
      max {
        id
        sort
      }
    }
  }
`;

/**
 * __useCodePushControl_AggregatedQuery__
 *
 * To run a query within a React component, call `useCodePushControl_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useCodePushControl_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCodePushControl_AggregatedQuery({
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
export function useCodePushControl_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<CodePushControl_AggregatedQuery, CodePushControl_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CodePushControl_AggregatedQuery, CodePushControl_AggregatedQueryVariables>(
    CodePushControl_AggregatedDocument,
    options,
  );
}
export function useCodePushControl_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CodePushControl_AggregatedQuery, CodePushControl_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CodePushControl_AggregatedQuery, CodePushControl_AggregatedQueryVariables>(
    CodePushControl_AggregatedDocument,
    options,
  );
}
export type CodePushControl_AggregatedQueryHookResult = ReturnType<typeof useCodePushControl_AggregatedQuery>;
export type CodePushControl_AggregatedLazyQueryHookResult = ReturnType<typeof useCodePushControl_AggregatedLazyQuery>;
export type CodePushControl_AggregatedQueryResult = Apollo.QueryResult<
  CodePushControl_AggregatedQuery,
  CodePushControl_AggregatedQueryVariables
>;
