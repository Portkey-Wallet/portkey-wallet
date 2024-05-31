import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PortkeyCard_AggregatedQueryVariables = Types.Exact<{
  groupBy?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  filter?: Types.InputMaybe<Types.PortkeyCard_Filter>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type PortkeyCard_AggregatedQuery = {
  __typename?: 'Query';
  portkeyCard_aggregated: Array<{
    __typename?: 'portkeyCard_aggregated';
    group?: any | null;
    countAll?: number | null;
    count?: {
      __typename?: 'portkeyCard_aggregated_count';
      id?: number | null;
      status?: number | null;
      index?: number | null;
      title?: number | null;
      value?: number | null;
      description?: number | null;
      buttonTitle?: number | null;
      imgUrl?: number | null;
      url?: number | null;
      type?: number | null;
    } | null;
    countDistinct?: {
      __typename?: 'portkeyCard_aggregated_count';
      id?: number | null;
      status?: number | null;
      index?: number | null;
      title?: number | null;
      value?: number | null;
      description?: number | null;
      buttonTitle?: number | null;
      imgUrl?: number | null;
      url?: number | null;
      type?: number | null;
    } | null;
    avg?: {
      __typename?: 'portkeyCard_aggregated_fields';
      id?: number | null;
      index?: number | null;
      type?: number | null;
    } | null;
    sum?: {
      __typename?: 'portkeyCard_aggregated_fields';
      id?: number | null;
      index?: number | null;
      type?: number | null;
    } | null;
    avgDistinct?: {
      __typename?: 'portkeyCard_aggregated_fields';
      id?: number | null;
      index?: number | null;
      type?: number | null;
    } | null;
    sumDistinct?: {
      __typename?: 'portkeyCard_aggregated_fields';
      id?: number | null;
      index?: number | null;
      type?: number | null;
    } | null;
    min?: {
      __typename?: 'portkeyCard_aggregated_fields';
      id?: number | null;
      index?: number | null;
      type?: number | null;
    } | null;
    max?: {
      __typename?: 'portkeyCard_aggregated_fields';
      id?: number | null;
      index?: number | null;
      type?: number | null;
    } | null;
  }>;
};

export const PortkeyCard_AggregatedDocument = gql`
  query portkeyCard_aggregated(
    $groupBy: [String]
    $filter: portkeyCard_filter
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $sort: [String]
  ) {
    portkeyCard_aggregated(
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
        index
        title
        value
        description
        buttonTitle
        imgUrl
        url
        type
      }
      countDistinct {
        id
        status
        index
        title
        value
        description
        buttonTitle
        imgUrl
        url
        type
      }
      avg {
        id
        index
        type
      }
      sum {
        id
        index
        type
      }
      avgDistinct {
        id
        index
        type
      }
      sumDistinct {
        id
        index
        type
      }
      min {
        id
        index
        type
      }
      max {
        id
        index
        type
      }
    }
  }
`;

/**
 * __usePortkeyCard_AggregatedQuery__
 *
 * To run a query within a React component, call `usePortkeyCard_AggregatedQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortkeyCard_AggregatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortkeyCard_AggregatedQuery({
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
export function usePortkeyCard_AggregatedQuery(
  baseOptions?: Apollo.QueryHookOptions<PortkeyCard_AggregatedQuery, PortkeyCard_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PortkeyCard_AggregatedQuery, PortkeyCard_AggregatedQueryVariables>(
    PortkeyCard_AggregatedDocument,
    options,
  );
}
export function usePortkeyCard_AggregatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PortkeyCard_AggregatedQuery, PortkeyCard_AggregatedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PortkeyCard_AggregatedQuery, PortkeyCard_AggregatedQueryVariables>(
    PortkeyCard_AggregatedDocument,
    options,
  );
}
export type PortkeyCard_AggregatedQueryHookResult = ReturnType<typeof usePortkeyCard_AggregatedQuery>;
export type PortkeyCard_AggregatedLazyQueryHookResult = ReturnType<typeof usePortkeyCard_AggregatedLazyQuery>;
export type PortkeyCard_AggregatedQueryResult = Apollo.QueryResult<
  PortkeyCard_AggregatedQuery,
  PortkeyCard_AggregatedQueryVariables
>;
