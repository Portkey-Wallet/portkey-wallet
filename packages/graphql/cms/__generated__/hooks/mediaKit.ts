import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MediaKitQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.MediaKit_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type MediaKitQuery = {
  __typename?: 'Query';
  mediaKit: Array<{
    __typename?: 'mediaKit';
    backgroundColor?: string | null;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    index?: number | null;
    name: string;
    png?: string | null;
    sort?: number | null;
    status?: string | null;
    svg?: string | null;
    user_created?: string | null;
    user_updated?: string | null;
    date_created_func?: {
      __typename?: 'datetime_functions';
      year?: number | null;
      month?: number | null;
      week?: number | null;
      day?: number | null;
      weekday?: number | null;
      hour?: number | null;
      minute?: number | null;
      second?: number | null;
    } | null;
    date_updated_func?: {
      __typename?: 'datetime_functions';
      year?: number | null;
      month?: number | null;
      week?: number | null;
      day?: number | null;
      weekday?: number | null;
      hour?: number | null;
      minute?: number | null;
      second?: number | null;
    } | null;
  }>;
};

export const MediaKitDocument = gql`
  query mediaKit($filter: mediaKit_filter, $sort: [String], $limit: Int, $offset: Int, $page: Int, $search: String) {
    mediaKit(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      backgroundColor
      date_created
      date_created_func {
        year
        month
        week
        day
        weekday
        hour
        minute
        second
      }
      date_updated
      date_updated_func {
        year
        month
        week
        day
        weekday
        hour
        minute
        second
      }
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
  }
`;

/**
 * __useMediaKitQuery__
 *
 * To run a query within a React component, call `useMediaKitQuery` and pass it any options that fit your needs.
 * When your component renders, `useMediaKitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMediaKitQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useMediaKitQuery(baseOptions?: Apollo.QueryHookOptions<MediaKitQuery, MediaKitQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MediaKitQuery, MediaKitQueryVariables>(MediaKitDocument, options);
}
export function useMediaKitLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MediaKitQuery, MediaKitQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MediaKitQuery, MediaKitQueryVariables>(MediaKitDocument, options);
}
export type MediaKitQueryHookResult = ReturnType<typeof useMediaKitQuery>;
export type MediaKitLazyQueryHookResult = ReturnType<typeof useMediaKitLazyQuery>;
export type MediaKitQueryResult = Apollo.QueryResult<MediaKitQuery, MediaKitQueryVariables>;
