import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CodePushControlCustomQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.CodePushControl_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type CodePushControlCustomQuery = {
  __typename?: 'Query';
  codePushControl: Array<{
    __typename?: 'codePushControl';
    content?: string | null;
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
  }>;
};

export const CodePushControlCustomDocument = gql`
  query codePushControlCustom(
    $filter: codePushControl_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    codePushControl(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      content
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
 * __useCodePushControlCustomQuery__
 *
 * To run a query within a React component, call `useCodePushControlCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useCodePushControlCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCodePushControlCustomQuery({
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
export function useCodePushControlCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<CodePushControlCustomQuery, CodePushControlCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CodePushControlCustomQuery, CodePushControlCustomQueryVariables>(
    CodePushControlCustomDocument,
    options,
  );
}
export function useCodePushControlCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CodePushControlCustomQuery, CodePushControlCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CodePushControlCustomQuery, CodePushControlCustomQueryVariables>(
    CodePushControlCustomDocument,
    options,
  );
}
export type CodePushControlCustomQueryHookResult = ReturnType<typeof useCodePushControlCustomQuery>;
export type CodePushControlCustomLazyQueryHookResult = ReturnType<typeof useCodePushControlCustomLazyQuery>;
export type CodePushControlCustomQueryResult = Apollo.QueryResult<
  CodePushControlCustomQuery,
  CodePushControlCustomQueryVariables
>;
