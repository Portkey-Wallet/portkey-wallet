import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CodePushControlQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.CodePushControl_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type CodePushControlQuery = {
  __typename?: 'Query';
  codePushControl: Array<{
    __typename?: 'codePushControl';
    content?: string | null;
    date_created?: any | null;
    date_updated?: any | null;
    id: string;
    isForceUpdate?: boolean | null;
    label?: string | null;
    sort?: number | null;
    status?: string | null;
    title?: string | null;
    updatedContent?: string | null;
    updatedTitle?: string | null;
    user_created?: string | null;
    user_updated?: string | null;
    version?: string | null;
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

export const CodePushControlDocument = gql`
  query codePushControl(
    $filter: codePushControl_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    codePushControl(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      content
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
      isForceUpdate
      label
      sort
      status
      title
      updatedContent
      updatedTitle
      user_created
      user_updated
      version
    }
  }
`;

/**
 * __useCodePushControlQuery__
 *
 * To run a query within a React component, call `useCodePushControlQuery` and pass it any options that fit your needs.
 * When your component renders, `useCodePushControlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCodePushControlQuery({
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
export function useCodePushControlQuery(
  baseOptions?: Apollo.QueryHookOptions<CodePushControlQuery, CodePushControlQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CodePushControlQuery, CodePushControlQueryVariables>(CodePushControlDocument, options);
}
export function useCodePushControlLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CodePushControlQuery, CodePushControlQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CodePushControlQuery, CodePushControlQueryVariables>(CodePushControlDocument, options);
}
export type CodePushControlQueryHookResult = ReturnType<typeof useCodePushControlQuery>;
export type CodePushControlLazyQueryHookResult = ReturnType<typeof useCodePushControlLazyQuery>;
export type CodePushControlQueryResult = Apollo.QueryResult<CodePushControlQuery, CodePushControlQueryVariables>;
