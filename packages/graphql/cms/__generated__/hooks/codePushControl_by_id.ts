import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CodePushControl_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type CodePushControl_By_IdQuery = {
  __typename?: 'Query';
  codePushControl_by_id?: {
    __typename?: 'codePushControl';
    id: string;
    status?: string | null;
    sort?: number | null;
    user_created?: string | null;
    date_created?: any | null;
    user_updated?: string | null;
    date_updated?: any | null;
    version?: string | null;
    label?: string | null;
    title?: string | null;
    content?: string | null;
    isForceUpdate?: boolean | null;
    updatedTitle?: string | null;
    updatedContent?: string | null;
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

export const CodePushControl_By_IdDocument = gql`
  query codePushControl_by_id($id: ID!) {
    codePushControl_by_id(id: $id) {
      id
      status
      sort
      user_created
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
      user_updated
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
      version
      label
      title
      content
      isForceUpdate
      updatedTitle
      updatedContent
    }
  }
`;

/**
 * __useCodePushControl_By_IdQuery__
 *
 * To run a query within a React component, call `useCodePushControl_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useCodePushControl_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCodePushControl_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCodePushControl_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<CodePushControl_By_IdQuery, CodePushControl_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CodePushControl_By_IdQuery, CodePushControl_By_IdQueryVariables>(
    CodePushControl_By_IdDocument,
    options,
  );
}
export function useCodePushControl_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CodePushControl_By_IdQuery, CodePushControl_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CodePushControl_By_IdQuery, CodePushControl_By_IdQueryVariables>(
    CodePushControl_By_IdDocument,
    options,
  );
}
export type CodePushControl_By_IdQueryHookResult = ReturnType<typeof useCodePushControl_By_IdQuery>;
export type CodePushControl_By_IdLazyQueryHookResult = ReturnType<typeof useCodePushControl_By_IdLazyQuery>;
export type CodePushControl_By_IdQueryResult = Apollo.QueryResult<
  CodePushControl_By_IdQuery,
  CodePushControl_By_IdQueryVariables
>;
