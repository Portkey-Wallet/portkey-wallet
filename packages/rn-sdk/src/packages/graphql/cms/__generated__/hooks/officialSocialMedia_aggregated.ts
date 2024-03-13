import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OfficialSocialMedia_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.OfficialSocialMedia_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type OfficialSocialMedia_AggregatedQuery = {
  __typename?: 'Query';
  officialSocialMedia_aggregated: Array<{
    __typename?: 'officialSocialMedia_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'officialSocialMedia_aggregated_count';
      activeSvg?: number | null;
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      link?: number | null;
      name?: number | null;
      sort?: number | null;
      status?: number | null;
      svg?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'officialSocialMedia_aggregated_count';
      activeSvg?: number | null;
      date_created?: number | null;
      date_updated?: number | null;
      id?: number | null;
      index?: number | null;
      link?: number | null;
      name?: number | null;
      sort?: number | null;
      status?: number | null;
      svg?: number | null;
      user_created?: number | null;
      user_updated?: number | null;
    } | null;
    avg?: {
      __typename?: 'officialSocialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sum?: {
      __typename?: 'officialSocialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'officialSocialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'officialSocialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    min?: {
      __typename?: 'officialSocialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
    max?: {
      __typename?: 'officialSocialMedia_aggregated_fields';
      id?: number | null;
      index?: number | null;
      sort?: number | null;
    } | null;
  }>;
};

export const OfficialSocialMedia_AggregatedDocument = gql`
  query officialSocialMedia_aggregated(
    $groupBy: [String]
    $filter: officialSocialMedia_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    officialSocialMedia_aggregated(
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
        activeSvg
        date_created
        date_updated
        id
        index
        link
        name
        sort
        status
        svg
        user_created
        user_updated
      }
      countDistinct {
        activeSvg
        date_created
        date_updated
        id
        index
        link
        name
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
 * __useOfficialSocialMedia_AggregatedQuery__
 *
 * To run a query within a React component, call `useOfficialSocialMedia_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useOfficialSocialMedia_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOfficialSocialMedia_AggregatedQuery({
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
export function useOfficialSocialMedia_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OfficialSocialMedia_AggregatedQuery,
    OfficialSocialMedia_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OfficialSocialMedia_AggregatedQuery, OfficialSocialMedia_AggregatedQueryVariables>(
    OfficialSocialMedia_AggregatedDocument,
    options,
  );
}
export function useOfficialSocialMedia_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OfficialSocialMedia_AggregatedQuery,
    OfficialSocialMedia_AggregatedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OfficialSocialMedia_AggregatedQuery, OfficialSocialMedia_AggregatedQueryVariables>(
    OfficialSocialMedia_AggregatedDocument,
    options,
  );
}
export type OfficialSocialMedia_AggregatedQueryHookResult = ReturnType<typeof useOfficialSocialMedia_AggregatedQuery>;
export type OfficialSocialMedia_AggregatedLazyQueryHookResult = ReturnType<
  typeof useOfficialSocialMedia_AggregatedLazyQuery
>;
export type OfficialSocialMedia_AggregatedQueryResult = Apollo.QueryResult<
  OfficialSocialMedia_AggregatedQuery,
  OfficialSocialMedia_AggregatedQueryVariables
>;
