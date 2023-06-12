import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKit_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.MediaKit_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type MediaKit_AggregatedQuery = {
  __typename?: 'Query';
  mediaKit_aggregated: Array<{
    __typename?: 'mediaKit_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'mediaKit_aggregated_count';
      backgroundColor?: number | null;
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      name?: number | null;
      png?: number | null;
      sort?: number | null;
      status?: number | null;
      svg?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'mediaKit_aggregated_count';
      backgroundColor?: number | null;
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      name?: number | null;
      png?: number | null;
      sort?: number | null;
      status?: number | null;
      svg?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    avg?: {
      __typename?: 'mediaKit_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sum?: {
      __typename?: 'mediaKit_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'mediaKit_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'mediaKit_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    min?: {
      __typename?: 'mediaKit_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    max?: {
      __typename?: 'mediaKit_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
  }>;
};

export const MediaKit_AggregatedDocument = gql`
  query mediaKit_aggregated(
    $groupBy: [String]
    $filter: mediaKit_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    mediaKit_aggregated(
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
        backgroundColor
        date_created
        date_updated
        id
        index
        name
        png
        sort
        status
        svg
        user_created
        user_updated
      }
      countDistinct {
        backgroundColor
        date_created
        date_updated
        id
        index
        name
        png
        sort
        status
        svg
        user_created
        user_updated
      }
      avg {
        id
        index
        sort
      }
      sum {
        id
        index
        sort
      }
      avgDistinct {
        id
        index
        sort
      }
      sumDistinct {
        id
        index
        sort
      }
      min {
        id
        index
        sort
      }
      max {
        id
        index
        sort
      }
    }
  }
`;

/**
 * __useMediaKit_AggregatedQuery__
 *
 * To run a query within a React component, call `useMediaKit_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKit_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKit_AggregatedQuery({
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
export function useMediaKit_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<MediaKit_AggregatedQuery, MediaKit_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKit_AggregatedQuery, MediaKit_AggregatedQueryVariables>(
    MediaKit_AggregatedDocument,
    options,
  );
}
export function useMediaKit_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MediaKit_AggregatedQuery, MediaKit_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MediaKit_AggregatedQuery, MediaKit_AggregatedQueryVariables>(
    MediaKit_AggregatedDocument,
    options,
  );
}
export type MediaKit_AggregatedQueryHookResult = ReturnType<typeof useMediaKit_AggregatedQuery>;
export type MediaKit_AggregatedLazyQueryHookResult = ReturnType<typeof useMediaKit_AggregatedLazyQuery>;
export type MediaKit_AggregatedQueryResult = Apollo.QueryResult<
  MediaKit_AggregatedQuery,
  MediaKit_AggregatedQueryVariables
>;
