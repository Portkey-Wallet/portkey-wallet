import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SocialMediaQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.SocialMedia_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type SocialMediaQuery = {
  __typename?: 'Query';
  socialMedia: Array<{
    __typename?: 'socialMedia';
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    index?: number | null;
    link?: string | null;
    sort?: number | null;
    status?: string | null;
    svgUrl?: string | null;
    title?: string | null;
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

export const SocialMediaDocument = gql`
  query socialMedia(
    $filter: socialMedia_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    socialMedia(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
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
      sort
      status
      svgUrl
      title
      user_created
      user_updated
    }
  }
`;

/**
 * __useSocialMediaQuery__
 *
 * To run a query within a React component, call `useSocialMediaQuery` and pass it any options that fit your needs.
 * When your component renders, `useSocialMediaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSocialMediaQuery({
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
export function useSocialMediaQuery(
  baseOptions?: Apollo.QueryHookOptions<SocialMediaQuery, SocialMediaQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SocialMediaQuery, SocialMediaQueryVariables>(SocialMediaDocument, options);
}
export function useSocialMediaLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SocialMediaQuery, SocialMediaQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SocialMediaQuery, SocialMediaQueryVariables>(SocialMediaDocument, options);
}
export type SocialMediaQueryHookResult = ReturnType<typeof useSocialMediaQuery>;
export type SocialMediaLazyQueryHookResult = ReturnType<typeof useSocialMediaLazyQuery>;
export type SocialMediaQueryResult = Apollo.QueryResult<SocialMediaQuery, SocialMediaQueryVariables>;
