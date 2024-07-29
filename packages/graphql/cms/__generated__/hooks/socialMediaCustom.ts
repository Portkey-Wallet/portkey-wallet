import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SocialMediaCustomQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.SocialMedia_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type SocialMediaCustomQuery = {
  __typename?: 'Query';
  socialMedia: Array<{
    __typename?: 'socialMedia';
    index?: number | null;
    link?: string | null;
    sort?: number | null;
    title?: string | null;
    svgUrl?: never | null;
  }>;
};

export const SocialMediaCustomDocument = gql`
  query socialMediaCustom(
    $filter: socialMedia_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    socialMedia(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      index
      link
      sort
      svgUrl {
        filename_disk
      }
      title
    }
  }
`;

/**
 * __useSocialMediaCustomQuery__
 *
 * To run a query within a React component, call `useSocialMediaCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useSocialMediaCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSocialMediaCustomQuery({
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
export function useSocialMediaCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<SocialMediaCustomQuery, SocialMediaCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SocialMediaCustomQuery, SocialMediaCustomQueryVariables>(SocialMediaCustomDocument, options);
}
export function useSocialMediaCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SocialMediaCustomQuery, SocialMediaCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SocialMediaCustomQuery, SocialMediaCustomQueryVariables>(
    SocialMediaCustomDocument,
    options,
  );
}
export type SocialMediaCustomQueryHookResult = ReturnType<typeof useSocialMediaCustomQuery>;
export type SocialMediaCustomLazyQueryHookResult = ReturnType<typeof useSocialMediaCustomLazyQuery>;
export type SocialMediaCustomQueryResult = Apollo.QueryResult<SocialMediaCustomQuery, SocialMediaCustomQueryVariables>;
