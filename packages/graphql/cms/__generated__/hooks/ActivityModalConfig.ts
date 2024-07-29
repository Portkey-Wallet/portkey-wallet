import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ActivityModalConfigQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.ClientType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.TimingType_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  filter2?: Types.InputMaybe<Types.ActivityModalConfig_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type ActivityModalConfigQuery = {
  __typename?: 'Query';
  ActivityModalConfig: Array<{
    __typename?: 'ActivityModalConfig';
    id: string;
    show?: boolean | null;
    showClose?: boolean | null;
    headerImg?: string | null;
    title?: string | null;
    description?: string | null;
    negtiveTitle?: string | null;
    positiveTitle?: string | null;
    positiveAction?: string | null;
    timingOperation?: string | null;
    label?: string | null;
    negativeTitle?: string | null;
    clientType?: { __typename?: 'clientType'; id: string; name?: string | null } | null;
    timingType?: { __typename?: 'timingType'; id: string; name?: string | null } | null;
  }>;
};

export const ActivityModalConfigDocument = gql`
  query ActivityModalConfig(
    $filter: clientType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: timingType_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $filter2: ActivityModalConfig_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
  ) {
    ActivityModalConfig(
      filter: $filter2
      sort: $sort2
      limit: $limit2
      offset: $offset2
      page: $page2
      search: $search2
    ) {
      id
      clientType(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
        id
        name
      }
      timingType(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
        id
        name
      }
      show
      showClose
      headerImg
      title
      description
      negtiveTitle
      positiveTitle
      positiveAction
      timingOperation
      label
      negativeTitle
    }
  }
`;

/**
 * __useActivityModalConfigQuery__
 *
 * To run a query within a React component, call `useActivityModalConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityModalConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityModalConfigQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      filter1: // value for 'filter1'
 *      sort1: // value for 'sort1'
 *      limit1: // value for 'limit1'
 *      offset1: // value for 'offset1'
 *      page1: // value for 'page1'
 *      search1: // value for 'search1'
 *      filter2: // value for 'filter2'
 *      sort2: // value for 'sort2'
 *      limit2: // value for 'limit2'
 *      offset2: // value for 'offset2'
 *      page2: // value for 'page2'
 *      search2: // value for 'search2'
 *   },
 * });
 */
export function useActivityModalConfigQuery(
  baseOptions?: Apollo.QueryHookOptions<ActivityModalConfigQuery, ActivityModalConfigQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ActivityModalConfigQuery, ActivityModalConfigQueryVariables>(
    ActivityModalConfigDocument,
    options,
  );
}
export function useActivityModalConfigLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ActivityModalConfigQuery, ActivityModalConfigQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ActivityModalConfigQuery, ActivityModalConfigQueryVariables>(
    ActivityModalConfigDocument,
    options,
  );
}
export type ActivityModalConfigQueryHookResult = ReturnType<typeof useActivityModalConfigQuery>;
export type ActivityModalConfigLazyQueryHookResult = ReturnType<typeof useActivityModalConfigLazyQuery>;
export type ActivityModalConfigQueryResult = Apollo.QueryResult<
  ActivityModalConfigQuery,
  ActivityModalConfigQueryVariables
>;
