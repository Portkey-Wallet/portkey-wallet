import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SocialMedia_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type SocialMedia_By_IdQuery = {
  __typename?: 'Query';
  socialMedia_by_id?: {
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
  } | null;
};

export const SocialMedia_By_IdDocument = gql`
  query socialMedia_by_id($id: ID!) {
    socialMedia_by_id(id: $id) {
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
 * __useSocialMedia_By_IdQuery__
 *
 * To run a query within a React component, call `useSocialMedia_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSocialMedia_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSocialMedia_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSocialMedia_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>(SocialMedia_By_IdDocument, options);
}
export function useSocialMedia_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>(
    SocialMedia_By_IdDocument,
    options,
  );
}
export type SocialMedia_By_IdQueryHookResult = ReturnType<typeof useSocialMedia_By_IdQuery>;
export type SocialMedia_By_IdLazyQueryHookResult = ReturnType<typeof useSocialMedia_By_IdLazyQuery>;
export type SocialMedia_By_IdQueryResult = Apollo.QueryResult<SocialMedia_By_IdQuery, SocialMedia_By_IdQueryVariables>;
