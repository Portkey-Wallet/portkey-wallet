import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OfficialSocialMediaQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.OfficialSocialMedia_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type OfficialSocialMediaQuery = {
  __typename?: 'Query';
  officialSocialMedia: Array<{
    __typename?: 'officialSocialMedia';
    activeSvg?: string | null;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    index: number;
    link: string;
    name: string;
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

export const OfficialSocialMediaDocument = gql`
  query officialSocialMedia(
    $filter: officialSocialMedia_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    officialSocialMedia(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      activeSvg
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
      link
      name
      sort
      status
      svg
      user_created
      user_updated
    }
  }
`;

/**
 * __useOfficialSocialMediaQuery__
 *
 * To run a query within a React component, call `useOfficialSocialMediaQuery` and pass it any options that fit your needs.
 * When your component renders, `useOfficialSocialMediaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOfficialSocialMediaQuery({
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
export function useOfficialSocialMediaQuery(
  baseOptions?: Apollo.QueryHookOptions<OfficialSocialMediaQuery, OfficialSocialMediaQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OfficialSocialMediaQuery, OfficialSocialMediaQueryVariables>(
    OfficialSocialMediaDocument,
    options,
  );
}
export function useOfficialSocialMediaLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OfficialSocialMediaQuery, OfficialSocialMediaQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OfficialSocialMediaQuery, OfficialSocialMediaQueryVariables>(
    OfficialSocialMediaDocument,
    options,
  );
}
export type OfficialSocialMediaQueryHookResult = ReturnType<typeof useOfficialSocialMediaQuery>;
export type OfficialSocialMediaLazyQueryHookResult = ReturnType<typeof useOfficialSocialMediaLazyQuery>;
export type OfficialSocialMediaQueryResult = Apollo.QueryResult<
  OfficialSocialMediaQuery,
  OfficialSocialMediaQueryVariables
>;
