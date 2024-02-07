import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKitPage_Boilerplate_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.MediaKitPage_Boilerplate_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type MediaKitPage_Boilerplate_AggregatedQuery = {
  __typename?: 'Query';
  mediaKitPage_boilerplate_aggregated: Array<{
    __typename?: 'mediaKitPage_boilerplate_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'mediaKitPage_boilerplate_aggregated_count';
      boilerplate_id?: number | null;
      id?: number | null;
      mediaKitPage_id?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'mediaKitPage_boilerplate_aggregated_count';
      boilerplate_id?: number | null;
      id?: number | null;
      mediaKitPage_id?: number | null;
    } | null;
    avg?: {
      __typename?: 'mediaKitPage_boilerplate_aggregated_fields';
      boilerplate_id?: number | null;
      id?: number | null;
      mediaKitPage_id?: number | null;
    } | null;
    sum?: {
      __typename?: 'mediaKitPage_boilerplate_aggregated_fields';
      boilerplate_id?: number | null;
      id?: number | null;
      mediaKitPage_id?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'mediaKitPage_boilerplate_aggregated_fields';
      boilerplate_id?: number | null;
      id?: number | null;
      mediaKitPage_id?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'mediaKitPage_boilerplate_aggregated_fields';
      boilerplate_id?: number | null;
      id?: number | null;
      mediaKitPage_id?: number | null;
    } | null;
    min?: {
      __typename?: 'mediaKitPage_boilerplate_aggregated_fields';
      boilerplate_id?: number | null;
      id?: number | null;
      mediaKitPage_id?: number | null;
    } | null;
    max?: {
      __typename?: 'mediaKitPage_boilerplate_aggregated_fields';
      boilerplate_id?: number | null;
      id?: number | null;
      mediaKitPage_id?: number | null;
    } | null;
  }>;
};

export const MediaKitPage_Boilerplate_AggregatedDocument = gql`
  query mediaKitPage_boilerplate_aggregated(
    $groupBy: [String]
    $filter: mediaKitPage_boilerplate_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    mediaKitPage_boilerplate_aggregated(
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
        boilerplate_id
        id
        mediaKitPage_id
      }
      countDistinct {
        boilerplate_id
        id
        mediaKitPage_id
      }
      avg {
        boilerplate_id
        id
        mediaKitPage_id
      }
      sum {
        boilerplate_id
        id
        mediaKitPage_id
      }
      avgDistinct {
        boilerplate_id
        id
        mediaKitPage_id
      }
      sumDistinct {
        boilerplate_id
        id
        mediaKitPage_id
      }
      min {
        boilerplate_id
        id
        mediaKitPage_id
      }
      max {
        boilerplate_id
        id
        mediaKitPage_id
      }
    }
  }
`;

/**
 * __useMediaKitPage_Boilerplate_AggregatedQuery__
 *
 * To run a query within a React component, call `useMediaKitPage_Boilerplate_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKitPage_Boilerplate_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKitPage_Boilerplate_AggregatedQuery({
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
export function useMediaKitPage_Boilerplate_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    MediaKitPage_Boilerplate_AggregatedQuery,
    MediaKitPage_Boilerplate_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKitPage_Boilerplate_AggregatedQuery, MediaKitPage_Boilerplate_AggregatedQueryVariables>(
    MediaKitPage_Boilerplate_AggregatedDocument,
    options,
  );
}
export function useMediaKitPage_Boilerplate_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MediaKitPage_Boilerplate_AggregatedQuery,
    MediaKitPage_Boilerplate_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MediaKitPage_Boilerplate_AggregatedQuery,
    MediaKitPage_Boilerplate_AggregatedQueryVariables
  >(MediaKitPage_Boilerplate_AggregatedDocument, options);
}
export type MediaKitPage_Boilerplate_AggregatedQueryHookResult = ReturnType<
  typeof useMediaKitPage_Boilerplate_AggregatedQuery
>;
export type MediaKitPage_Boilerplate_AggregatedLazyQueryHookResult = ReturnType<
  typeof useMediaKitPage_Boilerplate_AggregatedLazyQuery
>;
export type MediaKitPage_Boilerplate_AggregatedQueryResult = Apollo.QueryResult<
  MediaKitPage_Boilerplate_AggregatedQuery,
  MediaKitPage_Boilerplate_AggregatedQueryVariables
>;
