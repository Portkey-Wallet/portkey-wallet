import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SocialMedia_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.SocialMedia_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type SocialMedia_AggregatedQuery = {
  __typename?: 'Query';
  socialMedia_aggregated: Array<{
    __typename?: 'socialMedia_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'socialMedia_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      link?: number | null;
      sort?: number | null;
      status?: number | null;
      svgUrl?: number | null;
      title?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'socialMedia_aggregated_count';
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      link?: number | null;
      sort?: number | null;
      status?: number | null;
      svgUrl?: number | null;
      title?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    avg?: {
      __typename?: 'socialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sum?: {
      __typename?: 'socialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'socialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'socialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    min?: {
      __typename?: 'socialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    max?: {
      __typename?: 'socialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
  }>;
};

export const SocialMedia_AggregatedDocument = gql`
  query socialMedia_aggregated(
    $groupBy: [String]
    $filter: socialMedia_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    socialMedia_aggregated(
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
        date_created
        date_updated
        id
        index
        link
        sort
        status
        svgUrl
        title
        user_created
        user_updated
      }
      countDistinct {
        date_created
        date_updated
        id
        index
        link
        sort
        status
        svgUrl
        title
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
 * __useSocialMedia_AggregatedQuery__
 *
 * To run a query within a React component, call `useSocialMedia_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useSocialMedia_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSocialMedia_AggregatedQuery({
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
export function useSocialMedia_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<SocialMedia_AggregatedQuery, SocialMedia_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SocialMedia_AggregatedQuery, SocialMedia_AggregatedQueryVariables>(
    SocialMedia_AggregatedDocument,
    options,
  );
}
export function useSocialMedia_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SocialMedia_AggregatedQuery, SocialMedia_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SocialMedia_AggregatedQuery, SocialMedia_AggregatedQueryVariables>(
    SocialMedia_AggregatedDocument,
    options,
  );
}
export type SocialMedia_AggregatedQueryHookResult = ReturnType<typeof useSocialMedia_AggregatedQuery>;
export type SocialMedia_AggregatedLazyQueryHookResult = ReturnType<typeof useSocialMedia_AggregatedLazyQuery>;
export type SocialMedia_AggregatedQueryResult = Apollo.QueryResult<
  SocialMedia_AggregatedQuery,
  SocialMedia_AggregatedQueryVariables
>;
