import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OfficialSocialMedia_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type OfficialSocialMedia_By_IdQuery = {
  __typename?: 'Query';
  officialSocialMedia_by_id?: {
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
  } | null;
};

export const OfficialSocialMedia_By_IdDocument = gql`
  query officialSocialMedia_by_id($id: ID!) {
    officialSocialMedia_by_id(id: $id) {
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
 * __useOfficialSocialMedia_By_IdQuery__
 *
 * To run a query within a React component, call `useOfficialSocialMedia_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useOfficialSocialMedia_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOfficialSocialMedia_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOfficialSocialMedia_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<OfficialSocialMedia_By_IdQuery, OfficialSocialMedia_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OfficialSocialMedia_By_IdQuery, OfficialSocialMedia_By_IdQueryVariables>(
    OfficialSocialMedia_By_IdDocument,
    options,
  );
}
export function useOfficialSocialMedia_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OfficialSocialMedia_By_IdQuery, OfficialSocialMedia_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OfficialSocialMedia_By_IdQuery, OfficialSocialMedia_By_IdQueryVariables>(
    OfficialSocialMedia_By_IdDocument,
    options,
  );
}
export type OfficialSocialMedia_By_IdQueryHookResult = ReturnType<typeof useOfficialSocialMedia_By_IdQuery>;
export type OfficialSocialMedia_By_IdLazyQueryHookResult = ReturnType<typeof useOfficialSocialMedia_By_IdLazyQuery>;
export type OfficialSocialMedia_By_IdQueryResult = Apollo.QueryResult<
  OfficialSocialMedia_By_IdQuery,
  OfficialSocialMedia_By_IdQueryVariables
>;
