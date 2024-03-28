import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKitPage_MediaKit_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.MediaKitPage_MediaKit_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type MediaKitPage_MediaKit_AggregatedQuery = {
  __typename?: 'Query';
  mediaKitPage_mediaKit_aggregated: Array<{
    __typename?: 'mediaKitPage_mediaKit_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'mediaKitPage_mediaKit_aggregated_count';
      id?: number | null;
      mediaKitPage_id?: number | null;
      mediaKit_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'mediaKitPage_mediaKit_aggregated_count';
      id?: number | null;
      mediaKitPage_id?: number | null;
      mediaKit_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'mediaKitPage_mediaKit_aggregated_fields';
      id?: number | null;
      mediaKitPage_id?: number | null;
      mediaKit_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'mediaKitPage_mediaKit_aggregated_fields';
      id?: number | null;
      mediaKitPage_id?: number | null;
      mediaKit_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'mediaKitPage_mediaKit_aggregated_fields';
      id?: number | null;
      mediaKitPage_id?: number | null;
      mediaKit_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'mediaKitPage_mediaKit_aggregated_fields';
      id?: number | null;
      mediaKitPage_id?: number | null;
      mediaKit_id?: number | null;
    } | null;
    min?: {
      __typename?: 'mediaKitPage_mediaKit_aggregated_fields';
      id?: number | null;
      mediaKitPage_id?: number | null;
      mediaKit_id?: number | null;
    } | null;
    max?: {
      __typename?: 'mediaKitPage_mediaKit_aggregated_fields';
      id?: number | null;
      mediaKitPage_id?: number | null;
      mediaKit_id?: number | null;
    } | null;
  }>;
};

export const MediaKitPage_MediaKit_AggregatedDocument = gql`
  query mediaKitPage_mediaKit_aggregated(
    $groupBy: [String]
    $filter: mediaKitPage_mediaKit_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    mediaKitPage_mediaKit_aggregated(
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
        mediaKitPage_id
        mediaKit_id
      }
      countDistinct {
        id
        mediaKitPage_id
        mediaKit_id
      }
      avg {
        id
        mediaKitPage_id
        mediaKit_id
      }
      sum {
        id
        mediaKitPage_id
        mediaKit_id
      }
      avgDistinct {
        id
        mediaKitPage_id
        mediaKit_id
      }
      sumDistinct {
        id
        mediaKitPage_id
        mediaKit_id
      }
      min {
        id
        mediaKitPage_id
        mediaKit_id
      }
      max {
        id
        mediaKitPage_id
        mediaKit_id
      }
    }
  }
`;

/**
 * __useMediaKitPage_MediaKit_AggregatedQuery__
 *
 * To run a query within a React component, call `useMediaKitPage_MediaKit_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKitPage_MediaKit_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKitPage_MediaKit_AggregatedQuery({
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
export function useMediaKitPage_MediaKit_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    MediaKitPage_MediaKit_AggregatedQuery,
    MediaKitPage_MediaKit_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKitPage_MediaKit_AggregatedQuery, MediaKitPage_MediaKit_AggregatedQueryVariables>(
    MediaKitPage_MediaKit_AggregatedDocument,
    options,
  );
}
export function useMediaKitPage_MediaKit_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MediaKitPage_MediaKit_AggregatedQuery,
    MediaKitPage_MediaKit_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MediaKitPage_MediaKit_AggregatedQuery, MediaKitPage_MediaKit_AggregatedQueryVariables>(
    MediaKitPage_MediaKit_AggregatedDocument,
    options,
  );
}
export type MediaKitPage_MediaKit_AggregatedQueryHookResult = ReturnType<
  typeof useMediaKitPage_MediaKit_AggregatedQuery
>;
export type MediaKitPage_MediaKit_AggregatedLazyQueryHookResult = ReturnType<
  typeof useMediaKitPage_MediaKit_AggregatedLazyQuery
>;
export type MediaKitPage_MediaKit_AggregatedQueryResult = Apollo.QueryResult<
  MediaKitPage_MediaKit_AggregatedQuery,
  MediaKitPage_MediaKit_AggregatedQueryVariables
>;
